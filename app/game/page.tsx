import type { Metadata } from "next";
import { Breakout } from "@/components/breakout";

export const metadata: Metadata = {
  title: "Breakout | Santiago Martínez",
  robots: { index: false, follow: false },
};

export default async function GamePage({ searchParams }: {
  searchParams: Promise<{ from?: string }>;
}) {
  const english = (await searchParams).from === "en";

  return <Breakout english={english} />;
}