import OpenAI from "openai";
import { FALLBACK_MESSAGE, buildSystemPrompt } from "@/lib/bot/prompt";
import type { ChatMessage } from "@/lib/bot/state";

// Lazy: instanciar en build time falla si OPENAI_API_KEY no está definida
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  openaiClient ??= new OpenAI();
  return openaiClient;
}

export async function generateReply(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    });
    const text = response.choices[0]?.message?.content?.trim() ?? "";
    return text !== "" ? text : FALLBACK_MESSAGE;
  } catch (error) {
    console.error("[bot] Error llamando a OpenAI:", error);
    return FALLBACK_MESSAGE;
  }
}
