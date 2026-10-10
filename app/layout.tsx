import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { personalInfo } from "@/content/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
