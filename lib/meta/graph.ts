import { createHmac, timingSafeEqual } from "node:crypto";

// Permite apuntar a un mock local en pruebas (META_GRAPH_BASE).
const GRAPH_API_BASE = process.env.META_GRAPH_BASE || "https://graph.facebook.com/v20.0";
// Los tokens de la API de Instagram con login de Instagram (INSTAGRAM_ACCESS_TOKEN)
// se usan contra graph.instagram.com.
const INSTAGRAM_GRAPH_API_BASE =
  process.env.META_GRAPH_BASE || "https://graph.instagram.com/v20.0";

export type MetaChannel = "messenger" | "instagram";

/**
 * Valida X-Hub-Signature-256 contra el cuerpo CRUDO de la petición.
 * Devuelve false si falta el app secret, el header o si no coincide.
 */
export function verifySignature(rawBody: string, header: string | null): boolean {
  if (!header?.startsWith("sha256=")) return false;

  // Messenger firma con el app secret de la app; Instagram (login de Instagram)
  // firma con el app secret propio de la app de Instagram.
  const secrets = [process.env.META_APP_SECRET, process.env.INSTAGRAM_APP_SECRET].filter(
    (s): s is string => Boolean(s),
  );
  const received = Buffer.from(header.slice("sha256=".length), "utf8");

  return secrets.some((secret) => {
    const expected = Buffer.from(
      createHmac("sha256", secret).update(rawBody, "utf8").digest("hex"),
      "utf8",
    );
    return expected.length === received.length && timingSafeEqual(expected, received);
  });
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
  const base =
    channel === "instagram" && process.env.INSTAGRAM_ACCESS_TOKEN
      ? INSTAGRAM_GRAPH_API_BASE
      : GRAPH_API_BASE;
  try {
    const res = await fetch(`${base}/me/messages`, {
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
