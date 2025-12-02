import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { orders, products, deliveries } from '@/lib/mockData';

const openai = createOpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `Eres el Asistente J Agro, experto en picking y distribución de productos veterinarios.

FECHA ACTUAL: ${new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

=== PEDIDOS ===
${JSON.stringify(orders, null, 2)}

=== INVENTARIO ===
${JSON.stringify(products, null, 2)}

=== LIQUIDACIONES ===
${JSON.stringify(deliveries, null, 2)}

REGLAS:
- IDs parciales: "2025-001" = "PED-2025-001"
- "en proceso"/"en curso" = estado "En proceso" o "En Curso"
- Interpreta "hoy", "ayer", fechas naturales
- Búsqueda flexible en nombres (cliente, producto, mensajero)
- Formato dinero colombiano: $1.230.000
- Respuestas concisas con emojis (📦 🚚 ✅ ⚠️ 💰)
- Si no encuentras algo, sugiere alternativas`;

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
