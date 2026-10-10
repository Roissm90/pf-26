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

Una vez que tengas la URL final de Vercel, reemplazá `https://tu-dominio.vercel.app` en:

- `app/layout.tsx` (`metadataBase`)
- `app/sitemap.ts`
- `app/robots.ts`

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
