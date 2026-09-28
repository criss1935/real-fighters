import { createHmac, timingSafeEqual } from "node:crypto";

// Permite apuntar a un mock local en pruebas (META_GRAPH_BASE).
const GRAPH_API_BASE = process.env.META_GRAPH_BASE || "https://graph.facebook.com/v20.0";

export type MetaChannel = "messenger" | "instagram";

/**
 * Valida X-Hub-Signature-256 contra el cuerpo CRUDO de la petición.
 * Devuelve false si falta el app secret, el header o si no coincide.
 */
export function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const received = header.slice("sha256=".length);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function accessTokenFor(channel: MetaChannel): string | undefined {
  // Instagram usa el token propio si existe; si la cuenta está ligada a la
  // página, sirve el mismo Page Access Token.
  if (channel === "instagram") {
    return process.env.INSTAGRAM_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
  }
  return process.env.META_PAGE_ACCESS_TOKEN;
}

async function post(channel: MetaChannel, payload: Record<string, unknown>) {
  const token = accessTokenFor(channel);
  if (!token) {
    console.error(`[meta] Falta el access token para ${channel}`);
    return;
  }
  try {
    const res = await fetch(`${GRAPH_API_BASE}/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[meta] ${channel} respondió ${res.status}:`, await res.text());
    }
  } catch (error) {
    console.error(`[meta] Error de red hacia Graph API (${channel}):`, error);
  }
}

export async function sendSenderAction(
  channel: MetaChannel,
  recipientId: string,
  action: "mark_seen" | "typing_on",
) {
  await post(channel, { recipient: { id: recipientId }, sender_action: action });
}

export async function sendText(channel: MetaChannel, recipientId: string, text: string) {
  // Messenger e Instagram limitan el texto a 2000 caracteres por mensaje.
  await post(channel, {
    recipient: { id: recipientId },
    messaging_type: "RESPONSE",
    message: { text: text.slice(0, 2000) },
  });
}
