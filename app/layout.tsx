import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { personalInfo } from "@/content/data";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const title = `${personalInfo.name} | ${personalInfo.role}`;
const description = "Desarrollador frontend en Madrid. React, Next.js y experiencias web rápidas y accesibles. Descubre mi experiencia y proyectos.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: getSiteUrl(),
    siteName: personalInfo.name,
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${personalInfo.name} - ${personalInfo.role}` }],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const language = (await headers()).get("x-portfolio-language") === "en" ? "en" : "es";
  return (
    <html
      lang={language}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
