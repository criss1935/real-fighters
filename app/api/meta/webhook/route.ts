import { NextRequest, NextResponse, after } from "next/server";
import { wantsHuman, handoffMessage } from "@/lib/bot/prompt";
import { generateReply } from "@/lib/bot/reply";
import {
  alreadyProcessed,
  getConversation,
  isPausedForHuman,
  isRateLimited,
  pauseForHuman,
  trimHistory,
} from "@/lib/bot/state";
import {
  sendSenderAction,
  sendText,
  verifySignature,
  type MetaChannel,
} from "@/lib/meta/graph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// El flujo completo (OpenAI + delay humano) corre en after(); dar margen suficiente
export const maxDuration = 30;

const MIN_TYPING_DELAY_MS = 1_500;
const MAX_TYPING_DELAY_MS = 4_000;
const ATTACHMENT_REPLY =
  "Por aquí solo puedo leer mensajes de texto. Cuéntame por escrito qué te gustaría saber de las clases 🙂";

interface MessagingEvent {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
    app_id?: number | string;
    attachments?: unknown[];
  };
}

interface IncomingMessage {
  channel: MetaChannel;
  mid: string;
  senderId: string;
  text: string | null; // null = mensaje sin texto (imagen, sticker, audio…)
}

// --- GET: verificación del webhook por Meta ---
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const expected = process.env.META_VERIFY_TOKEN;
  if (expected && mode === "subscribe" && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// --- POST: mensajes de Messenger (object=page) e Instagram (object=instagram) ---
export async function POST(req: NextRequest) {
  // La firma se calcula sobre el cuerpo crudo: leerlo como texto antes de parsear
  const rawBody = await req.text();

  if (!verifySignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    console.error("[meta-webhook] Firma inválida o META_APP_SECRET ausente");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    // Payload ilegible: responder 200 para que Meta no reintente
    return NextResponse.json({ status: "ignored" });
  }

  const messages = collectMessages(body);

  if (messages.length > 0) {
    // after() difiere el trabajo hasta después de responder el 200 a Meta
    after(async () => {
      const results = await Promise.allSettled(messages.map(handleIncomingMessage));
      for (const result of results) {
        if (result.status === "rejected") {
          console.error("[meta-webhook] Error procesando mensaje:", result.reason);
        }
      }
    });
  }

  return NextResponse.json({ status: "ok" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectMessages(body: any): IncomingMessage[] {
  const channel: MetaChannel | null =
    body?.object === "page" ? "messenger" : body?.object === "instagram" ? "instagram" : null;
  if (!channel || !Array.isArray(body.entry)) return [];

  const collected: IncomingMessage[] = [];

  for (const entry of body.entry) {
    for (const event of (entry?.messaging ?? []) as MessagingEvent[]) {
      const message = event.message;
      if (!message?.mid) continue; // postbacks, reads, deliveries, reacciones…

      if (message.is_echo) {
        // Eco de un mensaje enviado desde la página/cuenta. Si NO lo mandó esta
        // app, una persona del gym respondió a mano: pausar el bot en ese hilo.
        const ourAppId = process.env.META_APP_ID;
        const userId = event.recipient?.id;
        if (ourAppId && userId && String(message.app_id ?? "") !== ourAppId) {
          pauseForHuman(`${channel}:${userId}`);
        }
        continue;
      }

      const senderId = event.sender?.id;
      if (!senderId) continue;

      const text = typeof message.text === "string" ? message.text.trim() : "";
      if (text === "" && !message.attachments?.length) continue;

      collected.push({ channel, mid: message.mid, senderId, text: text || null });
    }
  }
  return collected;
}

async function handleIncomingMessage(message: IncomingMessage) {
  const { channel, senderId, mid } = message;
  const key = `${channel}:${senderId}`;

  if (alreadyProcessed(mid)) return;
  if (isPausedForHuman(key)) return;
  if (isRateLimited(key)) return;

  await sendSenderAction(channel, senderId, "mark_seen");
  await sendSenderAction(channel, senderId, "typing_on");

  if (message.text === null) {
    await sleep(MIN_TYPING_DELAY_MS);
    await sendText(channel, senderId, ATTACHMENT_REPLY);
    return;
  }

  const conversation = getConversation(key);
  conversation.messages.push({ role: "user", content: message.text });
  conversation.lastActivity = Date.now();

  const reply = wantsHuman(message.text)
    ? handoffMessage()
    : await generateReply(conversation.messages);

  // Delay dinámico según longitud de la respuesta (simula tiempo de escritura)
  await sleep(
    Math.min(MAX_TYPING_DELAY_MS, Math.max(MIN_TYPING_DELAY_MS, reply.length * 35)),
  );

  await sendText(channel, senderId, reply);

  conversation.messages.push({ role: "assistant", content: reply });
  trimHistory(conversation);
  conversation.lastActivity = Date.now();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
