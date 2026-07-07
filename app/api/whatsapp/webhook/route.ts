import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// El flujo completo (Claude + delay humano) corre en after(); dar margen suficiente
export const maxDuration = 30;

const GRAPH_API_BASE = "https://graph.facebook.com/v20.0";

const SYSTEM_PROMPT = `Eres el asistente virtual de Real Fighters MX, academia de MMA y artes marciales en CDMX.
Responde siempre en español mexicano, tono amigable y directo como hablaría un humano del gym.
Usa frases cortas, naturales. Puedes usar algún emoji ocasionalmente (no en cada mensaje).
Nunca digas que eres un bot o IA.

INFORMACIÓN DEL GYM (usa solo estos datos, no inventes nada más):

UBICACIÓN:
Calz. del Hueso 590, Coapa, Los Girasoles, Coyoacán, 04920, Ciudad de México, CDMX.

CLASES, HORARIOS Y PRECIOS:
- MMA (desde 13 años): Lunes, Miércoles y Viernes — 7:00 a 8:00 am / 9:00 a 10:30 am / 8:00 a 9:30 pm. $900/mes.
- Muay Thai (desde 10 años): Martes, Jueves y Sábado — 9:00 a 10:30 am / Principiantes 7:00 a 8:00 pm / Todos los niveles 8:00 a 9:30 pm. $900/mes.
- Jiu Jitsu (desde 6 años): Martes y Jueves — 7:00 a 8:30 am / 8:00 a 9:30 pm. $900/mes.
- Boxeo Mexicano (desde 8 años): Lunes a Sábado — 7:00 a 11:00 am / 6:00 a 10:00 pm. $1,200/mes.
- CrossFit (desde 15 años): Lunes a Sábado — clases a las 5, 6, 7, 8 y 9 pm. $1,200/mes.
- Plan RFM (el más popular): acceso ilimitado a TODAS las clases y disciplinas, horarios flexibles. $1,600/mes.

PRIMERA CLASE:
No hay clases gratis. Se puede agendar una clase muestra; si preguntan cómo agendarla o cuánto cuesta, di que ahorita les confirman los detalles.

QUÉ LLEVAR:
Ropa cómoda y agua. A los alumnos nuevos se les presta equipo (guantes, espinilleras, según la disciplina). Para boxeo/Muay Thai conviene llevar vendas de 5 cm — también las vendemos en el gym.

CONSEJOS PARA EMPEZAR:
Cualquiera puede empezar sin experiencia; hay clases para principiantes. Recomienda llegar 10-15 minutos antes de la clase. Si no saben qué disciplina elegir, pregúntales qué buscan (defensa personal, condición física, competencia) y recomienda con base en eso, o sugiere el Plan RFM para probar de todo.

Si te preguntan algo que NO está en esta información (inscripción, promociones, formas de pago, disponibilidad de cupo, clases para niños menores a las edades indicadas, etc.), di que ahorita te checan y que espere un momento, o que llame al gym. No inventes información. Máximo 3 párrafos cortos por respuesta.`;

const FALLBACK_MESSAGE = "Ahorita no te puedo responder, intenta en un momento 🙏";

const MAX_HISTORY_MESSAGES = 20;
const RATE_LIMIT_MS = 2_000;
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1_000;
const MAX_PROCESSED_IDS = 1_000;
const MIN_TYPING_DELAY_MS = 1_500;
const MAX_TYPING_DELAY_MS = 4_000;

// Lazy: instanciar en build time falla si OPENAI_API_KEY no está definida
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  openaiClient ??= new OpenAI();
  return openaiClient;
}

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// Estado en memoria: vive mientras la instancia serverless esté caliente.
// Suficiente para dedupe/rate-limit/contexto conversacional de corto plazo.
const processedMessageIds = new Set<string>();
const lastMessageTimestamps = new Map<string, number>();
const conversations = new Map<
  string,
  { messages: ChatMessage[]; lastActivity: number }
>();

interface IncomingTextMessage {
  id: string;
  from: string;
  type: string;
  text?: { body: string };
}

// --- GET: verificación del webhook por Meta ---
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// --- POST: recepción de mensajes ---
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    // Payload ilegible: responder 200 igual para que Meta no reintente
    return NextResponse.json({ status: "ignored" });
  }

  const message = extractTextMessage(body);

  // Ignora silenciosamente status updates, entregas y mensajes no-texto
  if (message && !processedMessageIds.has(message.id)) {
    rememberMessageId(message.id);
    // after() difiere el trabajo hasta después de responder el 200 a Meta
    after(async () => {
      try {
        await handleIncomingMessage(message);
      } catch (error) {
        console.error("[whatsapp-webhook] Error procesando mensaje:", error);
      }
    });
  }

  return NextResponse.json({ status: "ok" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextMessage(body: any): IncomingTextMessage | null {
  const value = body?.entry?.[0]?.changes?.[0]?.value;
  // Notificaciones de estado (sent/delivered/read) llegan en value.statuses
  if (!value || value.statuses) return null;

  const message = value.messages?.[0];
  if (!message || message.type !== "text" || !message.id || !message.from) return null;
  if (typeof message.text?.body !== "string" || message.text.body.trim() === "") return null;

  return message as IncomingTextMessage;
}

function rememberMessageId(id: string) {
  processedMessageIds.add(id);
  if (processedMessageIds.size > MAX_PROCESSED_IDS) {
    // Set itera en orden de inserción: borra los más antiguos
    for (const oldId of processedMessageIds) {
      processedMessageIds.delete(oldId);
      if (processedMessageIds.size <= MAX_PROCESSED_IDS / 2) break;
    }
  }
}

async function handleIncomingMessage(message: IncomingTextMessage) {
  const phone = message.from;
  const now = Date.now();

  // Rate limit: máximo 1 mensaje cada 2s por número
  const lastAt = lastMessageTimestamps.get(phone);
  lastMessageTimestamps.set(phone, now);
  if (lastAt !== undefined && now - lastAt < RATE_LIMIT_MS) return;

  cleanupStaleConversations(now);

  // 1-2. Marcar como leído + indicador de "escribiendo..."
  // (la Cloud API los combina en una sola llamada; el indicador se apaga
  // automáticamente al enviar la respuesta)
  await markAsReadWithTyping(message.id);

  const conversation = conversations.get(phone) ?? { messages: [], lastActivity: now };
  conversation.messages.push({ role: "user", content: message.text!.body });
  conversation.lastActivity = now;
  conversations.set(phone, conversation);

  const reply = await generateReply(conversation.messages);

  // 3. Delay dinámico según longitud de la respuesta (simula tiempo de escritura)
  const typingDelay = Math.min(
    MAX_TYPING_DELAY_MS,
    Math.max(MIN_TYPING_DELAY_MS, reply.length * 35),
  );
  await sleep(typingDelay);

  // 4-5. Enviar respuesta (esto apaga el indicador de escritura en WhatsApp)
  await sendTextMessage(phone, reply);

  conversation.messages.push({ role: "assistant", content: reply });
  if (conversation.messages.length > MAX_HISTORY_MESSAGES) {
    conversation.messages = conversation.messages.slice(-MAX_HISTORY_MESSAGES);
  }
  conversation.lastActivity = Date.now();
}

function cleanupStaleConversations(now: number) {
  for (const [phone, conversation] of conversations) {
    if (now - conversation.lastActivity > CONVERSATION_TTL_MS) {
      conversations.delete(phone);
      lastMessageTimestamps.delete(phone);
    }
  }
}

async function generateReply(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";

    return text !== "" ? text : FALLBACK_MESSAGE;
  } catch (error) {
    console.error("[whatsapp-webhook] Error llamando a OpenAI:", error);
    return FALLBACK_MESSAGE;
  }
}

async function markAsReadWithTyping(messageId: string) {
  await sendGraphRequest({
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
    typing_indicator: { type: "text" },
  });
}

async function sendTextMessage(to: string, text: string) {
  await sendGraphRequest({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body: text },
  });
}

async function sendGraphRequest(payload: Record<string, unknown>) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) {
    console.error("[whatsapp-webhook] Faltan WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN");
    return;
  }

  try {
    const res = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(
        `[whatsapp-webhook] WhatsApp API respondió ${res.status}:`,
        await res.text(),
      );
    }
  } catch (error) {
    console.error("[whatsapp-webhook] Error de red hacia WhatsApp API:", error);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
