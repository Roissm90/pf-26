"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export async function unlockGame(command: string) {
  if (typeof command !== "string" || command.trim().toLowerCase() !== "game") return null;
  const ticket = randomUUID();
  (await cookies()).set("game-entry", ticket, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/game",
    maxAge: 30,
  });
  return ticket;
}