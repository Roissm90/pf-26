import generated from "@/content/translations.generated.json";

export type Language = "es" | "en";
export type LanguageProps = { language?: Language };

export function t(language: Language, text: string): string {
  if (language === "es") return text;
  return (generated.translations as Record<string, string>)[text] ?? text;
}