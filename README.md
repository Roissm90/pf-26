# Portfolio

Portfolio personal para frontend developer. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Motion, con modo claro/oscuro.

## Cómo editar el contenido

Todo el texto editable vive en **un solo archivo**: [`content/data.ts`](./content/data.ts). No hace falta tocar ningún componente.

Ahí vas a encontrar (marcado con comentarios `// EDITAR` donde no es obvio):

- `personalInfo` — nombre, rol, tagline, bio corta, ubicación, email y la ruta a tu CV.
- `socials` — links a GitHub, LinkedIn y email.
- `skills` — tu stack agrupado por categoría.
- `projects` — tus proyectos (título, descripción, stack, link a demo y a repo).
- `experience` — tu experiencia laboral. Dejá el array vacío (`[]`) si todavía no tenés.

### CV

El CV y los certificados ya están en `public/`. Sustituye los PDF cuando necesites actualizarlos; el botón "Descargar CV" apunta a `/cv.pdf`.

### Dominio para SEO

Configura `SITE_URL=https://tu-dominio-real.com` en las variables de entorno de Vercel y vuelve a desplegar. El dominio se comparte entre los metadatos, el canonical del portfolio, robots y sitemap mediante [`lib/site-url.ts`](./lib/site-url.ts).

Sin `SITE_URL`, se usa `VERCEL_PROJECT_PRODUCTION_URL`, luego `VERCEL_URL` y, en local, `http://localhost:3000`. Comprueba el canonical y el sitemap del despliegue. No se publica una fecha de modificación ficticia.

### Seguridad

El servidor limita los cuerpos de eventos a 1 KB durante su lectura. Las cabeceras comunes incluyen `nosniff`, protección contra embedding, política de referrer y una CSP básica que no bloquea los scripts de Next. Esta CSP no sustituye una política estricta de scripts contra XSS.

Antes de publicar, configura en Vercel Firewall una regla de límite de solicitudes para `POST /api/events`, con un umbral acorde al tráfico previsto, y verifica su respuesta 429. Si tu plan no ofrece esa opción, hace falta un limitador con almacenamiento compartido. El código no incluye un límite global de frecuencia: un contador en memoria no protege de forma fiable entre instancias serverless.

La auditoría actual no encuentra vulnerabilidades de producción. Los avisos de desarrollo provienen de `braces` en la cadena de ESLint; comprueba las actualizaciones compatibles antes de usar `npm audit fix --force`.

## Desarrollo local

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
npm run start
```

## Desplegar en Vercel

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new), o abre su proyecto existente. Usa `main` como Production Branch y la raíz del repositorio como Root Directory.
2. Selecciona el preset Next.js. Mantén la salida automática, `npm ci` para instalar y `npm run build` para compilar. No uses exportación estática: la analítica necesita funciones de servidor.
3. Antes de desplegar, configura las variables siguientes en Settings > Environment Variables. Introduce los valores directamente en Vercel, nunca en Git ni en mensajes de chat.
4. Despliega `main`. Si cambias variables, vuelve a desplegar: las variables `NEXT_PUBLIC_*` y los metadatos se incorporan durante el build.

### Variables de producción

La plantilla [.env.example](./.env.example) solo contiene valores ficticios. `.env.local` sigue ignorado por Git.

| Variable | Valor en Production |
| --- | --- |
| `SITE_URL` | URL HTTPS pública definitiva, sin ruta. Si se omite, se usa el dominio de producción de Vercel. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publicable de Supabase. |
| `SUPABASE_SECRET_KEY` | Clave secreta, solo de servidor. Nunca debe llevar prefijo `NEXT_PUBLIC_`. |
| `ANALYTICS_ADMIN_USER_ID` | UUID exacto de tu usuario propietario, coincidente con la política RLS. |
| `ANALYTICS_ALLOWED_ORIGIN` | El origen HTTPS desde el que enviarás eventos, sin barra final; normalmente igual a `SITE_URL`. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` para registrar clics reales en producción. |

Si todavía no conoces el dominio, puedes hacer el primer despliegue con la captura desactivada. Después configura el origen definitivo y activa la captura en un nuevo despliegue. Redirige los dominios alternativos al principal: la API solo admite un origen exacto.

### Previews y Supabase

- En Preview configura `NEXT_PUBLIC_ANALYTICS_ENABLED=false` para no mezclar pruebas con eventos reales.
- Si quieres probar el panel en Preview, usa preferentemente otro proyecto Supabase con sus propias claves, propietario y RLS. Si omites esas variables, las rutas privadas no estarán operativas.
- Una preview protegida por Vercel Authentication no es accesible para los rastreadores de WhatsApp. Comprueba la tarjeta social en el despliegue público de producción.
- En Supabase configura Site URL con el dominio público, desactiva registros de usuarios y confirma que RLS permite leer solo al propietario. Consulta [GUIA-ANALITICA.md](./GUIA-ANALITICA.md) para el SQL y la configuración completa.
- Activa el límite de solicitudes de `POST /api/events` en Vercel Firewall según las opciones disponibles en tu plan.

### Comprobaciones después del despliegue

- La página abre con HTTPS, los siete logos cargan y los PDF se descargan.
- El canonical, `/robots.txt` y `/sitemap.xml` apuntan al dominio definitivo.
- `/opengraph-image` devuelve una imagen PNG de 1200 x 630 con tus iniciales. Al compartir, el título y la descripción son los del portfolio; WhatsApp puede conservar una vista anterior en caché.
- Sin sesión, `/analytics` redirige al login y `/analytics/export` devuelve 401.
- Inicia sesión con tu cuenta propietaria y comprueba lectura, búsqueda y exportación. No borres registros reales para probar el despliegue.
- Cuando realices un clic real con captura activada, verifica que la solicitud devuelve 204 y aparece en el panel. Un 403 suele indicar que el origen no coincide.
- Comprueba las cabeceras de seguridad y el menú con Tab y Escape en el dominio público.

Alternativa por CLI:

```bash
npx vercel
```
