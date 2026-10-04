# Messenger + Instagram DM (webhook unificado)

Endpoint: `POST/GET /api/meta/webhook` (`app/api/meta/webhook/route.ts`).
Reutiliza la misma app de Meta ("Rfm bot") que WhatsApp; el webhook de WhatsApp
(`/api/whatsapp/webhook`) no se modificó.

## Variables de entorno (Vercel → Project → Settings → Environment Variables)

| Variable | Para qué |
| --- | --- |
| `META_VERIFY_TOKEN` | Texto que tú eliges; se pega igual en el campo "Verify token" de Meta |
| `META_APP_SECRET` | App secret de la app (Configuración → Básica). Sin esto todos los POST se rechazan con 401 |
| `META_APP_ID` | ID de la app (2173494530100737). Permite detectar cuando una persona responde a mano y pausar el bot 12 h en ese hilo |
| `META_PAGE_ACCESS_TOKEN` | Token de la página "Real Fighters Mexico" (Messenger). Usar un token de larga duración |
| `INSTAGRAM_ACCESS_TOKEN` | Token de la cuenta de Instagram (API de Instagram con login de Instagram); se usa contra graph.instagram.com. Si no existe, Instagram usa `META_PAGE_ACCESS_TOKEN` |
| `INSTAGRAM_APP_SECRET` | Clave secreta de la app de Instagram (Casos de uso → API de Instagram). Meta firma los webhooks de Instagram con esta clave |
| `RECEPTION_WHATSAPP_URL` | Opcional. Enlace `https://wa.me/52...` al WhatsApp de recepción para el handoff |
| `OPENAI_API_KEY` | Ya existe por WhatsApp |
| `OPENAI_MODEL` | Opcional. Modelo de OpenAI (por defecto `gpt-4o-mini`) |
| `FALLBACK_API_KEY`, `FALLBACK_BASE_URL`, `FALLBACK_MODEL` | Opcionales. Proveedor de respaldo compatible con OpenAI que se usa cuando OpenAI falla (sin saldo, límite, caída). Deben venir las tres |
| `FALLBACK2_API_KEY`, `FALLBACK2_BASE_URL`, `FALLBACK2_MODEL` | Opcionales. Segundo respaldo, mismo formato |

Ejemplos de respaldo gratuito (todos con API compatible con OpenAI):

- Groq: `FALLBACK_BASE_URL=https://api.groq.com/openai/v1`, `FALLBACK_MODEL=llama-3.3-70b-versatile`
- OpenRouter: `FALLBACK_BASE_URL=https://openrouter.ai/api/v1`, `FALLBACK_MODEL=` un modelo con sufijo `:free`
- Gemini: `FALLBACK_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`, `FALLBACK_MODEL=gemini-2.0-flash`

Orden de intento: OpenAI, `FALLBACK`, `FALLBACK2`. Si un proveedor falla por saldo o llave inválida se salta 10 min; por otros errores, 1 min. Si todos fallan se envía el mensaje de "ahorita no te puedo responder". Los planes gratuitos tienen límites de uso y pueden usar los mensajes para mejorar sus modelos: no se envían datos personales más allá del texto de la conversación.

## Configuración en Meta for Developers

1. Webhooks → **Page**: callback `https://realfighters.com.mx/api/meta/webhook`, verify token = `META_VERIFY_TOKEN`. Suscribir `messages` y `message_echoes`.
2. Webhooks → **Instagram**: misma URL y token. Suscribir `messages`.
3. Messenger API → generar el token de la página y suscribir la página a la app.
4. Instagram: la cuenta profesional debe estar ligada a la página y con "Permitir acceso a mensajes" activo en la app de Instagram.
5. Permisos: `pages_messaging`, `pages_manage_metadata`, `instagram_manage_messages`, `instagram_basic`. En modo Desarrollo solo responde a usuarios con rol en la app; para público general la app debe pasar a Live (requiere URL de política de privacidad: `https://realfighters.com.mx/aviso-privacidad`) y App Review de los permisos avanzados.

## Comportamiento

- Verifica `X-Hub-Signature-256` con el cuerpo crudo; firma inválida → 401.
- Ignora ecos, lecturas, entregas, postbacks y reacciones; deduplica por `mid`; máximo 1 mensaje cada 2 s por persona.
- "Visto" + "escribiendo…" y delay proporcional a la respuesta, igual que en WhatsApp.
- Si piden hablar con alguien (asesor, recepción, humano…) responde con el enlace de recepción sin llamar a OpenAI.
- Mensajes sin texto (imagen, audio, sticker): pide que escriban su duda.
- Si una persona del gym responde desde el inbox, el bot se pausa 12 h en ese hilo (requiere `META_APP_ID` y la suscripción a `message_echoes`).

## Limitaciones conocidas

- El estado (dedupe, historial, pausa) vive en memoria de la instancia serverless: en un cold start se pierde. Igual que en WhatsApp; para producción pesada conviene moverlo a Supabase o Redis.
- El prompt vive en `lib/bot/prompt.ts` y es una copia del de WhatsApp: los precios y horarios de ambos difieren de `lib/classes-data.ts` (el sitio muestra $800/mes y clases kids; el bot dice $900–$1,600). Hay que unificarlos.
