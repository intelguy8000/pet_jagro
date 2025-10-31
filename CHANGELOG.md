# 📝 Registro de Cambios - Sistema J Agro

Todos los cambios notables del proyecto están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [1.3.0] - 2025-10-30

### ✨ Añadido
- **Vista de Facturación completa** (`components/FacturacionView.tsx`)
  - Estadísticas de facturación (pendientes, facturados, valor total)
  - Lista de pedidos listos para facturar
  - Historial de pedidos facturados
  - Modal de detalle de pedido
  - Acción de facturar con confirmación

- **Flujo completo Picking → Facturación**
  - Nuevos estados: `completed`, `ready_for_billing`, `billed`
  - Botón "Pasar a Facturación" en pedidos completados
  - Transición automática entre vistas

- **Sección "Pedidos Terminados" en Trazabilidad**
  - Muestra pedidos completados esperando facturación
  - Badge "PENDIENTE FACTURACIÓN"
  - Información de fecha de completado

- **Navegación mejorada**
  - Nueva pestaña "💰 Facturación" entre Picking y Trazabilidad
  - Orden: Picking | Facturación | Trazabilidad

### 🔧 Modificado
- **OrderDetail.tsx**
  - Pedidos completados ya NO desaparecen automáticamente
  - Agregado handler `handleSendToBilling()`
  - Removido timeout de auto-cierre después de completar

- **PickingView.tsx**
  - Ahora recibe `orders` y `onUpdateOrder` como props
  - Gestión de estado movida a componente padre
  - Mejor manejo de cierre al pasar a facturación

- **TrackingView.tsx**
  - Ahora recibe `orders` como prop
  - Nueva sección de pedidos completados
  - Mejora en visualización de estado

- **page.tsx**
  - Gestión centralizada del estado `orders`
  - Handler `handleUpdateOrder()` para sincronizar cambios
  - Rendering condicional para 3 vistas

- **types/index.ts**
  - Ampliado `OrderStatus` con nuevos estados
  - Actualizado `orderStatusNames` con traducciones

### 🎨 Estilo
- Modo oscuro implementado en FacturacionView
- Consistencia de colores entre todas las vistas
- Badges informativos para estados

---

## [1.2.1] - 2025-10-30

### 🐛 Corregido
- **Visibilidad del contador de items** en modo claro
  - Agregado `text-gray-700` para contraste
  - Antes era blanco sobre fondo gris claro (invisible)
  - Commit: `68bada2`

---

## [1.2.0] - 2025-10-30

### ✨ Añadido
- **Modo Oscuro/Claro completo**
  - Nuevo contexto `ThemeContext.tsx`
  - Toggle en header con iconos 🌙/☀️
  - Persistencia en localStorage
  - Detección automática de preferencia del sistema

### 🐛 Corregido
- **Error SSR en ThemeContext**
  - Hook `useTheme()` ahora retorna valores por defecto durante SSR
  - Evita error "useTheme debe usarse dentro de ThemeProvider"
  - Commit: `de7ff9a`

### 🎨 Estilo
- Modo oscuro aplicado en todas las vistas:
  - PickingView
  - OrderDetail
  - BarcodeScanner
  - TrackingView
- Mejora de visibilidad de nombres de productos
  - Cambiado de `text-lg` a `text-xl font-bold`
- Colores ajustados para mejor contraste en ambos modos

### 🔧 Modificado
- **tailwind.config.ts**
  - Agregado `darkMode: 'class'`
- **app/layout.tsx**
  - Wrapper con ThemeProvider

---

## [1.1.0] - 2025-10-30

### ✨ Añadido
- **Sistema de Picking completo**
  - Lista de pedidos pendientes con prioridades
  - Detalle de pedido con items
  - Asignación de pedidos a pickers
  - Estados en tiempo real

- **Scanner de Códigos de Barras**
  - Modal de escaneo (`BarcodeScanner.tsx`)
  - Modo demo para pruebas
  - Ingreso manual como respaldo
  - Validación de códigos

- **Vista de Trazabilidad**
  - Dashboard de inventario
  - Sugerencias de compra con urgencia
  - Filtros (Todos, Stock Bajo, Agotados)
  - Tabla completa de productos

- **Datos de Prueba**
  - 4 pedidos mock (3 pendientes, 1 en progreso)
  - 10 productos de ejemplo
  - 3 sugerencias de compra

### 🎨 Estilo
- Diseño con Tailwind CSS
- Branding J Agro (logo y colores)
- Color primario: `#106BA4`
- Responsive para móviles

---

## [1.0.0] - 2025-10-30

### 🎉 Lanzamiento Inicial
- **Configuración del proyecto**
  - Next.js 14.2.33 con App Router
  - TypeScript configurado
  - Tailwind CSS integrado
  - ESLint configurado

- **Estructura base**
  - Layout raíz (`app/layout.tsx`)
  - Página principal (`app/page.tsx`)
  - Carpetas de componentes y tipos

- **Branding**
  - Logo J Agro descargado
  - Metadata del sitio configurada
  - Título: "J Agro - Sistema de Picking"

- **Tipos TypeScript**
  - `Order`, `OrderItem`, `OrderStatus`
  - `Product`, `PurchaseSuggestion`
  - Interfaces completas

---

## Notas de Versión

### Formato de Versionado
El proyecto sigue [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles en API
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

### Categorías de Cambios
- **✨ Añadido**: Nuevas funcionalidades
- **🔧 Modificado**: Cambios en funcionalidad existente
- **🐛 Corregido**: Corrección de bugs
- **🎨 Estilo**: Cambios de UI/UX
- **📝 Documentación**: Cambios en docs
- **🚀 Rendimiento**: Mejoras de performance
- **🔒 Seguridad**: Correcciones de seguridad
- **⚠️ Deprecado**: Funcionalidad que se eliminará
- **🗑️ Eliminado**: Funcionalidad eliminada

---

## Enlaces
- [Repositorio GitHub](https://github.com/intelguy8000/pet_jagro)
- [Documentación Completa](./DOCUMENTACION.md)
- [Deployment en Vercel](https://pet-jagro.vercel.app)

---

**Mantenido por**: Equipo de Desarrollo J Agro
**Última actualización**: 30 de Octubre, 2025
