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

Subí tu CV en PDF como `public/cv.pdf` (la carpeta `public/` está vacía por ahora). El botón "Descargar CV" ya apunta a esa ruta.

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

1. Subí este proyecto a un repo de GitHub (o GitLab/Bitbucket).
2. Entrá a [vercel.com/new](https://vercel.com/new), importá el repo y hacé clic en Deploy (Next.js se detecta automáticamente, sin configuración extra).
3. Cada push a la rama principal despliega automáticamente.

Alternativa por CLI:

```bash
npx vercel
```
