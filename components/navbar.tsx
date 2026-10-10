"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigationLinks, personalInfo } from "@/content/data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function scrollPosition() {
      const root = document.scrollingElement;
      const maximum = root ? Math.max(0, root.scrollHeight - root.clientHeight) : 0;
      return Math.min(maximum, Math.max(0, window.scrollY));
    }
    const initialScrollY = scrollPosition();
    let previousScrollY = initialScrollY;
    let direction = 0;
    let distance = 0;
    function handleScroll() {
      const currentScrollY = scrollPosition();
      const delta = currentScrollY - previousScrollY;
      previousScrollY = currentScrollY;
      if (delta === 0) return;
      const nextDirection = Math.sign(delta);
      distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
      direction = nextDirection;

      const focusedElement = document.activeElement;
      const keyboardFocus = focusedElement instanceof Element &&
        headerRef.current?.contains(focusedElement) && focusedElement.matches(":focus-visible");

      if (open && Math.abs(currentScrollY - initialScrollY) <= 100) {
        setHidden(false);
        return;
      }
      if (open) setOpen(false);
      if (currentScrollY <= 96 || keyboardFocus) {
        setHidden(false);
      } else if (distance >= 12) {
        setHidden(direction > 0);
        distance = 0;
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1024px)");
    function handleDesktopChange() {
      if (desktop.matches) setOpen(false);
    }
    handleDesktopChange();
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleDesktopChange);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleDesktopChange);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      onFocusCapture={() => setHidden(false)}
      className={`sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden && !open ? "-translate-y-full pointer-events-none" : "translate-y-0"}`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="#top" data-analytics="navigation-top" className="text-sm font-semibold tracking-tight">
          {personalInfo.initials}
        </Link>

        <nav aria-label="Navegacion principal" className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex lg:gap-8 ml-[8%] mr-auto">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              data-analytics={link.analyticsId}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            data-analytics="resume-download"
            href={personalInfo.resumeUrl}
            download
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Descargar CV
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setHidden(false);
              setOpen((value) => !value);
            }}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors duration-200 hover:bg-muted/20 active:bg-muted/30"
          >
            <Menu aria-hidden="true" className={`absolute h-4 w-4 transition-[opacity,transform] duration-200 ${open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            <X aria-hidden="true" className={`absolute h-4 w-4 transition-[opacity,transform] duration-200 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`} />
          </button>
        </div>
      </div>

        <nav
          id="mobile-navigation"
          aria-label="Navegacion movil"
          aria-hidden={!open}
          inert={!open}
          style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
          className={`absolute inset-x-0 top-full flex h-[calc(100svh-64px)] flex-col gap-1 overscroll-contain overflow-y-auto border-b border-border/60 bg-background px-6 py-4 shadow-lg shadow-black/10 transition-[opacity,transform,clip-path,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"}`}
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              data-analytics={link.analyticsId}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/20 hover:text-foreground active:bg-muted/30"
            >
              {link.label}
            </Link>
          ))}
          <a
            data-analytics="resume-download"
            href={personalInfo.resumeUrl}
            download
            onClick={() => setOpen(false)}
            className="mt-auto rounded-full bg-foreground px-4 py-2 text-center text-sm font-medium text-background transition-opacity duration-200 hover:opacity-90"
          >
            Descargar CV
          </a>
        </nav>
    </header>
  );
}
