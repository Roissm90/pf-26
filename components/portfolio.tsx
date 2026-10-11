import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { PointerTrail } from "@/components/pointer-trail";
import type { Language } from "@/lib/translations";

export function Portfolio({ language }: { language: Language }) {
  return (
    <>
      <AnalyticsTracker />
      <PointerTrail />
      <Navbar language={language} />
      <main lang={language} className="portfolio-content relative isolate flex-1">
        <Hero language={language} />
        <About language={language} />
        <Experience language={language} />
        <Skills language={language} />
        <Projects language={language} />
        <Contact language={language} />
      </main>
      <Footer language={language} />
    </>
  );
}