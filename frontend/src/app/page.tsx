import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Automation from "@/components/sections/Automation";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Automation />
      <Experience />
      <Contact />
    </main>
  );
}
