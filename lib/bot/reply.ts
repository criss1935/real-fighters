import OpenAI from "openai";
import { FALLBACK_MESSAGE, buildSystemPrompt } from "@/lib/bot/prompt";
import type { ChatMessage } from "@/lib/bot/state";

// Cadena de proveedores: se intenta cada uno en orden y se pasa al siguiente si
// falla (sin saldo, rate limit, caída, timeout o respuesta vacía).
//
//   1. OpenAI            -> OPENAI_API_KEY (+ OPENAI_MODEL, por defecto gpt-4o-mini)
//   2. Respaldo gratuito -> FALLBACK_API_KEY + FALLBACK_BASE_URL + FALLBACK_MODEL
//      Cualquier API compatible con OpenAI: Groq, OpenRouter, Gemini, etc.
//   3. Segundo respaldo  -> FALLBACK2_API_KEY + FALLBACK2_BASE_URL + FALLBACK2_MODEL (opcional)

interface Provider {
  name: string;
  model: string;
  client: () => OpenAI;
}

const REQUEST_TIMEOUT_MS = 10_000;
const QUOTA_COOLDOWN_MS = 10 * 60_000; // sin saldo / llave inválida: no reintentar por un rato
const ERROR_COOLDOWN_MS = 60_000; // otros errores: pausa corta para no sumar latencia

// Estado en memoria por instancia serverless (mismo criterio que el resto del bot)
const clients = new Map<string, OpenAI>();
const skipUntil = new Map<string, number>();

function lazyClient(name: string, create: () => OpenAI): () => OpenAI {
  // Lazy: instanciar en build time falla si la llave no está definida
  return () => {
    let client = clients.get(name);
    if (!client) {
      client = create();
      clients.set(name, client);
    }
    return client;
  };
}

function configuredProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      client: lazyClient("openai", () => new OpenAI()),
    });
  }

  for (const [name, prefix] of [
    ["fallback", "FALLBACK"],
    ["fallback2", "FALLBACK2"],
  ] as const) {
    const apiKey = process.env[`${prefix}_API_KEY`];
    const baseURL = process.env[`${prefix}_BASE_URL`];
    const model = process.env[`${prefix}_MODEL`];
    if (apiKey && baseURL && model) {
      providers.push({
        name,
        model,
        client: lazyClient(name, () => new OpenAI({ apiKey, baseURL })),
      });
    }
  }

  return providers;
}

function isQuotaOrAuthError(error: unknown): boolean {
  const e = error as { status?: number; code?: string } | undefined;
  return (
    e?.code === "insufficient_quota" ||
    e?.code === "credit_balance_exhausted" ||
    e?.status === 401 ||
    e?.status === 402 ||
    e?.status === 403
  );
}

export async function generateReply(messages: ChatMessage[]): Promise<string> {
  const now = Date.now();
  const all = configuredProviders();
  // Si todos están en pausa, se intentan todos igual antes de rendirse
  const active = all.filter((p) => (skipUntil.get(p.name) ?? 0) <= now);
  const candidates = active.length > 0 ? active : all;

  for (const provider of candidates) {
    try {
      const response = await provider.client().chat.completions.create(
        {
          model: provider.model,
          max_tokens: 400,
          messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
        },
        { timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 },
      );

      const text = response.choices[0]?.message?.content?.trim() ?? "";
      if (text !== "") {
        skipUntil.delete(provider.name);
        return text;
      }
      console.error(`[bot] ${provider.name} devolvió una respuesta vacía`);
    } catch (error) {
      const cooldown = isQuotaOrAuthError(error) ? QUOTA_COOLDOWN_MS : ERROR_COOLDOWN_MS;
      skipUntil.set(provider.name, Date.now() + cooldown);
      const e = error as { status?: number; code?: string; message?: string };
      console.error(
        `[bot] ${provider.name} (${provider.model}) falló: status=${e?.status ?? "-"} code=${e?.code ?? "-"} ${e?.message ?? ""}`.slice(0, 300),
      );
    }
  }

  return FALLBACK_MESSAGE;
}
