# Huellitas Pet Shop — E-commerce Mockup

Demo de plataforma de e-commerce para un pet shop argentino (una tienda hoy,
multi-sucursal en el futuro). Arquitectura **monolito modular** con un núcleo
reutilizable para el producto final: presentación delgada, API delgada, lógica
de negocio independiente de Next.js, acceso a datos por repositorios e
integraciones externas encapsuladas (stubs).

> Este proyecto es el **mockup presentable al cliente**: catálogo demo con datos
> realistas en pesos argentinos, carrito, checkout y panel de administración.
> Consistente con la guía de arquitectura en `D:\ecommerce\proto\guia-del-proyecto.md`.

---

## Stack

| Capa       | Tecnología                                   |
|------------|----------------------------------------------|
| Frontend   | Next.js 15 (App Router) + React 19 + Tailwind 3 |
| Lenguaje   | TypeScript (strict)                          |
| ORM        | Prisma 6                                     |
| Base local | **SQLite** (`prisma/dev.db`)                 |
| Validación | Zod                                          |
| Scripts    | tsx (seed)                                   |

## Requisitos

- Node.js >= 20 (probado con v24)
- npm

> En PowerShell de Windows hay que usar `npm.cmd` / `npx.cmd` (la policy de
> ejecución bloquea los wrappers `.ps1`).

## Puesta en marcha

```powershell
# 1. Instalar dependencias (postinstall corre: prisma generate)
npm.cmd install

# 2. Crear la base local y cargar el catálogo demo
npx.cmd prisma db push
npm.cmd run db:seed

# 3. Correr el demo
npm.cmd run dev        # http://localhost:3000
```

Scripts útiles:

| Script             | Uso                                  |
|--------------------|--------------------------------------|
| `npm.cmd run dev`  | Servidor de desarrollo               |
| `npm.cmd run build`| Build de producción                  |
| `npm.cmd run lint` | ESLint                               |
| `npm.cmd run db:seed` | Carga/re-carga los datos demo (idempotente) |
| `npm.cmd run db:push` | Sincroniza el esquema con la base  |

La UI **degrada elegantemente**: si la base no está inicializada, catálogo,
destacados y admin usan los mismos datos demo (mock) que el seed escribe — la
demo nunca se ve vacía.

## Rutas de la demo

| Ruta                      | Qué muestra                                   |
|---------------------------|-----------------------------------------------|
| `/`                       | Landing: hero, categorías, destacados, suscripciones |
| `/productos`              | Catálogo con búsqueda y filtro por categoría  |
| `/productos/[slug]`       | Detalle: galería, variantes, cantidad, carrito |
| `/carrito`                | Carrito con cupones demo y resumen de totales |
| `/checkout`               | Checkout demo (simula un pedido, crea orden en DB si está activa) |
| `/admin`                  | Dashboard: ventas, pedidos, alertas de stock  |
| `/admin/productos`        | Tabla de stock por ubicación                  |
| `/admin/pedidos`          | Listado de pedidos con estados                |

API demo (patrón delgado → lógica → datos):

| Endpoint                  | Descripción                          |
|---------------------------|--------------------------------------|
| `GET /api/products`       | Listado con filtros `categoria`, `q`, `destacados`, `limite` |
| `GET /api/products/[slug]`| Detalle de producto                  |
| `GET /api/categories`     | Árbol de categorías                  |
| `POST /api/orders`        | Ejemplo de escritura (crea pedido)   |

## Arquitectura de carpetas

```
src/
  app/          # Presentación (App Router) — páginas + route handlers API
  components/   # UI: Header, ProductCard, CartContext, paneles…
  server/       # LÓGICA DE NEGOCIO — sin imports de Next.js (reutilizable)
    catalog.ts  #   catálogo con fallback a mock
    cart.ts     #   matemática de precios (pura, compartida con el cliente)
    stock.ts    #   disponibilidad y alertas
    orders.ts   #   creación de pedidos (valida, calcula, persiste, integra)
  data/         # REPOSITORIOS — único punto que toca Prisma
    products.ts categories.ts stock.ts orders.ts customers.ts
  services/     # INTEGRACIONES — encapsuladas detrás de interfaces (stubs)
    mercadopago.ts  # pagos (createPreference / verifyPayment)
    afip.ts         # facturación electrónica (CAE)
    email.ts        # email transaccional (Resend)
  lib/          # Helpers: prisma singleton, constantes, schemas zod, mock-data
  types/        # Tipos compartidos (DTOs de vista, demo data, carrito)
```

Reglas de capas (las mismas que el producto final):

1. **Presentación/API** son delgadas: validan entrada (zod) y delegan.
2. **`server/*`** concentra las reglas de negocio y NO importa `next/*` — por eso
   es testable y reutilizable por una futura app móvil o workers.
3. **`data/*`** es el único lugar que habla con Prisma.
4. **`services/*`** son stubs con el contrato real (MercadoPago, AFIP/ARCA,
   Resend): activar una integración es implementar su interfaz, no reescribir
   el negocio.

## Decisiones clave y gotchas

### SQLite para el demo, PostgreSQL en producción (decisión tomada)

El mockup corre con **SQLite** porque el cliente debe poder correr la demo en
cualquier máquina sin Docker ni Postgres. El esquema se escribió evitando tipos
específicos de SQLite para que el salto a PostgreSQL sea configuración:

| En el mockup                     | En producción (PostgreSQL)            |
|----------------------------------|---------------------------------------|
| `provider = "sqlite"`            | `provider = "postgresql"`             |
| Precios como `Float`             | `Decimal(10, 2)`                      |
| `tags` / `attributes` como String JSON | `Json`                          |
| `DateTime` sin anotación         | `@db.Timestamptz`                     |
| Enums nativos de Prisma          | Idem (en PostgreSQL son nativos)      |

El switch se hace en `prisma/schema.prisma` (comentarios incluidos) más
`DATABASE_URL` apuntando a Postgres. **Verificado:** con Prisma 6.19 los `Enum`
y `@default(uuid())` funcionan en SQLite, y en PostgreSQL son nativos — los
enums no requieren cambio al migrar (los `autoincrement()` de campos no-id sí
son Postgres-only: ver nota en `Order.orderNumber`).

### Datos demo idénticos en seed y en UI

`src/lib/mock-data.ts` es la fuente única del catálogo demo: el seed
(`prisma/seed.ts`) la upserta en la base y la UI la usa como fallback. Así el
demo se ve igual con o sin base inicializada, y seed y UI nunca se desalinean.

### Otras notas

- `next/image` con `placehold.co` (PNG) para imágenes placeholder; en producción
  se reemplaza por Cloudflare R2.
- `Order.orderNumber` es secuencial pero lo asigna el repositorio (max+1):
  SQLite no permite `autoincrement()` en campos no-id. En PostgreSQL se cambia
  a `@default(autoincrement())` sin tocar el código del negocio.
- Los cupones `BIENVENIDA10` / `ENVIOGRATIS3` son demo (client-side por
  `src/lib/constants.ts`); en producción se resuelven desde la tabla `Coupon`.
- El checkout hace `POST /api/orders` real; si la base no está activa la API
  responde 503 y la demo simula el éxito (avisando en pantalla).
- Sin autenticación en el admin (fuera de alcance del mockup); el panel solo
  demuestra la superficie.
- Fuentes del sistema (sin descarga de Google Fonts) para que el build funcione
  sin red de imágenes/fuentes.
- `next-env.d.ts` queda trackeado (estándar de Next.js).

## Variables de entorno

Ver `.env.example`. El único valor necesario para correr es `DATABASE_URL`
(presente en `.env`). Los tokens de MercadoPago/AFIP/Resend son placeholders —
las integraciones están stubbed.

## Siguientes pasos hacia el producto real

1. PostgreSQL en Railway + `prisma migrate` versionado.
2. Autenticación (clientes/admin/staff) con roles.
3. MercadoPago real: preferencias, webhooks verificados, idempotencia.
4. Facturación AFIP/ARCA (CAE) integrada al flujo de pedido pagado.
5. Suscripciones con preaprobación de MercadoPago (el modelo ya existe).
6. WhatsApp Business como canal de notificaciones/consultas.