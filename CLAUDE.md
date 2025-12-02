# Pet Jagro - Sistema de Picking

## Resumen
Sistema de gestión de picking y distribución para productos veterinarios. Demo funcional para presentación comercial.

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK v5 + OpenAI GPT-4o
- Neon PostgreSQL (feedback)
- Deploy: Vercel

## Archivos Clave
- `app/api/chat/route.ts` → API del chat AI con OpenAI
- `app/api/feedback/route.ts` → API de feedback (GET/POST)
- `components/ChatWidget.tsx` → Widget de chat con useChat hook
- `lib/mockData.ts` → Datos simulados (orders, products, deliveries)
- `lib/db.ts` → Conexión lazy a Neon PostgreSQL
- `app/globals.css` → Tema azul pastel

## Módulos
1. **Picking** - Pedidos activos
2. **Facturación**
3. **Liquidaciones** - Entregas y pagos
4. **Trazabilidad** - Inventario
5. **Integraciones**
6. **Chat AI** - Asistente con GPT-4o

## Chat AI
- Hook `useChat` de `@ai-sdk/react`
- Transport: `DefaultChatTransport` con api `/api/chat`
- API en `/api/chat/route.ts`
- Modelo: `gpt-4o`
- Usa `convertToModelMessages` para convertir UIMessage[] a ModelMessage[]
- Respuesta: `toUIMessageStreamResponse()`
- Recibe contexto de mockData (orders, products, deliveries)
- Capacidades: búsqueda por ID parcial, cliente, zona, mensajero, stock bajo, liquidaciones

### Quick Chips (Sugerencias)
- Aparecen cuando el chat está vacío
- 5 sugerencias predefinidas con iconos
- Click envía la pregunta directamente
- Definidas en array `suggestions` en ChatWidget.tsx

### Feedback System
- Botones 👍👎 debajo de cada respuesta del asistente
- Se guarda en Neon PostgreSQL tabla `chat_feedback`
- API `/api/feedback`:
  - `POST`: guarda feedback (messageId, userMessage, assistantResponse, rating)
  - `GET`: lista últimos 50 feedbacks
  - `GET ?type=stats`: retorna {upvotes, downvotes, total}

### Widget de Stats
- Muestra "✨ X% útil" en el header del chat
- Solo visible si hay al menos 1 feedback
- Se actualiza al dar feedback
- Tooltip muestra total de valoraciones

## Base de Datos (Neon PostgreSQL)
```sql
CREATE TABLE chat_feedback (
  id SERIAL PRIMARY KEY,
  message_id TEXT NOT NULL,
  user_message TEXT,
  assistant_response TEXT,
  rating TEXT CHECK (rating IN ('up', 'down')),
  created_at TIMESTAMP DEFAULT NOW()
);
```
- Conexión lazy en `lib/db.ts` para evitar errores en build

## Variables de Entorno
```
OPEN_AI_KEY=sk-proj-...
DATABASE_URL=postgresql://...@...neon.tech/...
```
**Notas:**
- `OPEN_AI_KEY` usa guión bajo, no `OPENAI_API_KEY`
- `DATABASE_URL` es la connection string de Neon PostgreSQL

## Tema Visual
- Primary: `#7CB9E8` (azul pastel)
- Primary Dark: `#5B9BD5`
- Primary Light: `#B4D4E7`
- Background: `#FFFFFF`
- Surface: `#F8FAFC`
- Text Primary: `#1E293B`
- Text Secondary: `#64748B`
- Border: `#E2E8F0`

## URLs
- Producción: https://pet-jagro.vercel.app
- Repo: https://github.com/intelguy8000/pet_jagro

## Notas
- Datos de pedidos/productos/liquidaciones son mock (editar `lib/mockData.ts`)
- Feedback sí usa BD real (Neon PostgreSQL)
- System prompt está en `app/api/chat/route.ts`
- AI SDK v5 requiere `@ai-sdk/react` separado para hooks de React
- La tabla `chat_feedback` se crea automáticamente si no existe

## Pendientes Futuro
- Base de datos real para pedidos/productos (Supabase)
- Autenticación usuarios
- Socket.io tiempo real
- CRUD desde chat
- App móvil mensajeros
