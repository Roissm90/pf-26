import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { personalInfo } from "@/content/data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const title = `${personalInfo.name} — ${personalInfo.role}`;

export const metadata: Metadata = {
  // EDITAR: reemplazá con tu dominio real una vez desplegado en Vercel.
  metadataBase: new URL("https://tu-dominio.vercel.app"),
  title,
  description: personalInfo.tagline,
  openGraph: {
    title,
    description: personalInfo.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: personalInfo.tagline,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
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
