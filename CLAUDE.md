# Pet Jagro - Sistema de Picking

## Resumen
Sistema de gestión de picking y distribución para productos veterinarios. Demo funcional para presentación comercial.

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK v5 + OpenAI GPT-4o
- Deploy: Vercel

## Archivos Clave
- `app/api/chat/route.ts` → API del chat AI con OpenAI
- `components/ChatWidget.tsx` → Widget de chat con useChat hook
- `lib/mockData.ts` → Datos simulados (orders, products, deliveries)
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

## Variables de Entorno
```
OPEN_AI_KEY=sk-proj-...
```
**Nota:** La variable se llama `OPEN_AI_KEY` (con guión bajo), no `OPENAI_API_KEY`

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
- Datos son mock (no hay BD real)
- Para más datos editar `lib/mockData.ts`
- System prompt está en `app/api/chat/route.ts`
- AI SDK v5 requiere `@ai-sdk/react` separado para hooks de React

## Pendientes Futuro
- Base de datos real (Supabase)
- Autenticación usuarios
- Socket.io tiempo real
- CRUD desde chat
- App móvil mensajeros
