export function getSiteUrl() {
  const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const url = new URL(process.env.SITE_URL || (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000"));
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error("SITE_URL debe ser una URL HTTP o HTTPS sin credenciales");
  }
  return new URL(url.origin);
}