"use client";

import { useEffect, useRef, useState } from "react";
import { unlockGame } from "@/app/game/actions";
import type { Language } from "@/lib/translations";
import { trackEvent } from "@/lib/track-event";

export function SecretCommand({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [pending, setPending] = useState(false);
  const hovered = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const discovered = useRef(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const active = document.activeElement;
      if (event.key !== "Enter" || event.repeat || event.isComposing || !hovered.current ||
          (active instanceof HTMLElement && active !== trigger.current &&
           active.closest("a, button, input, textarea, select, [contenteditable]"))) return;
      event.preventDefault();
      setOpen(true);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    if (!discovered.current) {
      discovered.current = true;
      trackEvent("input-discovered");
    }
  }, [open]);

  function close() {
    setOpen(false);
    setCommand("");
    setInvalid(false);
    trigger.current?.focus();
  }

  return (
    <div className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center">
      <button
        ref={trigger}
        type="button"
        aria-label={language === "en" ? "Open command prompt" : "Abrir consola"}
        aria-expanded={open}
        aria-controls="secret-command"
        onPointerEnter={() => { hovered.current = true; }}
        onPointerLeave={() => { hovered.current = false; }}
        onClick={() => setOpen(true)}
        className="group flex h-8 w-8 items-center justify-center text-accent focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="h-4 w-1.5 bg-current opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      </button>
      {open && (
        <form
          id="secret-command"
          className="absolute left-full top-0 z-30 flex w-52 items-center gap-2 bg-background px-2 py-0 text-sm"
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            if (command.trim().toLowerCase() === "game") {
              setPending(true);
              try {
                const ticket = await unlockGame(command);
                if (!ticket) throw new Error("Game entry rejected");
                const query = new URLSearchParams({ entry: ticket });
                if (language === "en") query.set("from", "en");
                const destination = new URL("/game", window.location.origin);
                destination.search = query.toString();
                window.location.assign(destination.href);
              } catch {
                setPending(false);
                setInvalid(true);
                input.current?.focus();
              }
            } else {
              setInvalid(true);
              input.current?.select();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setOpen(false);
              setCommand("");
              setInvalid(false);
            }
          }}
        >
          <span aria-hidden="true">&gt;</span>
          <input
            ref={input}
            readOnly={pending}
            aria-busy={pending}
            value={command}
            onChange={(event) => { setCommand(event.target.value); setInvalid(false); }}
            aria-label={language === "en" ? "Command" : "Comando"}
            aria-invalid={invalid}
            title={invalid ? (language === "en" ? "Unable to enter. Try again." : "No se pudo entrar. Vuelve a intentarlo.") : undefined}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none aria-invalid:text-red-500 px-2 py-1"
          />
        </form>
      )}
    </div>
  );
}