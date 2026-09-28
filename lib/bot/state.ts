// Estado en memoria compartido por los canales de Meta.
// Vive mientras la instancia serverless esté caliente (mismo criterio que el
// webhook de WhatsApp): suficiente para dedupe, rate-limit y contexto corto.

import type OpenAI from "openai";

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export const MAX_HISTORY_MESSAGES = 20;
export const RATE_LIMIT_MS = 2_000;
export const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1_000;
export const HUMAN_TAKEOVER_MS = 12 * 60 * 60 * 1_000;
const MAX_PROCESSED_IDS = 1_000;

const processedMessageIds = new Set<string>();
const lastMessageAt = new Map<string, number>();
const pausedUntil = new Map<string, number>();
const conversations = new Map<string, { messages: ChatMessage[]; lastActivity: number }>();

/** true si el id ya se procesó; si no, lo registra y devuelve false. */
export function alreadyProcessed(id: string): boolean {
  if (processedMessageIds.has(id)) return true;
  processedMessageIds.add(id);
  if (processedMessageIds.size > MAX_PROCESSED_IDS) {
    // Set itera en orden de inserción: borra los más antiguos
    for (const oldId of processedMessageIds) {
      processedMessageIds.delete(oldId);
      if (processedMessageIds.size <= MAX_PROCESSED_IDS / 2) break;
    }
  }
  return false;
}

/** true si el usuario escribió hace menos de RATE_LIMIT_MS. */
export function isRateLimited(key: string, now = Date.now()): boolean {
  const last = lastMessageAt.get(key);
  lastMessageAt.set(key, now);
  return last !== undefined && now - last < RATE_LIMIT_MS;
}

/** Pausa al bot en un hilo cuando una persona del gym responde desde el inbox. */
export function pauseForHuman(key: string, now = Date.now()) {
  pausedUntil.set(key, now + HUMAN_TAKEOVER_MS);
}

export function isPausedForHuman(key: string, now = Date.now()): boolean {
  const until = pausedUntil.get(key);
  if (until === undefined) return false;
  if (now >= until) {
    pausedUntil.delete(key);
    return false;
  }
  return true;
}

export function getConversation(key: string, now = Date.now()) {
  cleanupStale(now);
  const existing = conversations.get(key);
  if (existing) return existing;
  const created = { messages: [] as ChatMessage[], lastActivity: now };
  conversations.set(key, created);
  return created;
}

export function trimHistory(conversation: { messages: ChatMessage[] }) {
  if (conversation.messages.length > MAX_HISTORY_MESSAGES) {
    conversation.messages = conversation.messages.slice(-MAX_HISTORY_MESSAGES);
  }
}

function cleanupStale(now: number) {
  for (const [key, conversation] of conversations) {
    if (now - conversation.lastActivity > CONVERSATION_TTL_MS) {
      conversations.delete(key);
      lastMessageAt.delete(key);
    }
  }
}
