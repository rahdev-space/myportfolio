"use client";

import { useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "PLEXJAR", url: "https://plexjar.com/" },
  { title: "WEBMIX", url: "https://webmixstudio.com/" },
  { title: "ARKIN", url: "https://arkinorganic.vercel.app/" }, // direct working link
  { title: "WEBSPAK", url: "https://webspak.vercel.app/" },
];

const techIcons = [Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database];

export default function ControlledTechChaos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const dropAudioRef = useRef<HTMLAudioElement>(null);
  const hasUnlockedAudio = useRef(false);

  // Audio unlock
  useEffect(() => {
    const unlockAudio = () => {
      hasUnlockedAudio.current = true;
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("scroll", unlockAudio, { once: true });
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const icons = iconRefs.current;
      const cards = cardRefs.current;
      const core = coreRef.current;

      if (!icons.length || !core) return;

      gsap.set([core, ...icons, ...cards], { willChange: "transform, opacity", force3D: true });

      // Clean initial states
      gsap.set(core, { scale: 0.2, opacity: 0 });

      icons.forEach((icon, i) => {
        if (!icon) return;
        const radius = 260 + Math.random() * 520;
        const angle = (i / icons.length) * Math.PI * 2 + (Math.random() - 0.5) * 1.5;

        gsap.set(icon, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 920,
          scale: 0.35 + Math.random() * 0.75,
          rotation: Math.random() * 80 - 40,
          opacity: 0,
        });
      });

      gsap.set(cards, { opacity: 0, y: 140, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4200",
          pin: true,
          scrub: 1.1,           // super smooth scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Smooth drop with space
      tl.to(icons, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        stagger: { each: 0.04, from: "random" },
        duration: 1.6,
        ease: "power3.out",
        onStart: () => {
          if (hasUnlockedAudio.current && dropAudioRef.current) {
            dropAudioRef.current.volume = 0.3;
            dropAudioRef.current.play().catch(() => {});
          }
        },
      })

      // 2. Soft vibration
      .to(icons, {
        x: "+=7",
        rotation: "+=6",
        repeat: 2,
        yoyo: true,
        duration: 0.14,
      }, "-=0.6")

      // 3. Clean suck into center (with gentle spin)
      .to(icons, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotation: "random(-680,680)",
        stagger: 0.018,
        duration: 1.3,
        ease: "expo.in",
      }, "-=0.5")

      // 4. Core appears softly
      .to(core, {
        scale: 1.35,
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.6)",
      }, "-=0.6")

      // 5. Smooth explosion
      .to(core, {
        scale: 88,
        opacity: 0,
        rotation: 2120,
        duration: 1.6,
        ease: "expo.in",
      }, "-=0.5")

      // 6. Gentle flash + deep background
      .to(sectionRef.current!, { backgroundColor: "#111111", duration: 0.12 }, "-=1.2")
      .to(sectionRef.current!, { backgroundColor: "#050505", duration: 0.9 }, "-=1")

      // 7. Cards reveal — buttery smooth
      .to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.18,
        duration: 1.8,
        ease: "power4.out",
      }, "-=1.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      <section
        ref={sectionRef}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <audio ref={dropAudioRef} src="stones-falling.mp3" preload="auto" />

        {/* Very soft backgrounds (no harsh glow) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.06),transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:68px_68px]" />

        {/* ICONS — clean single soft color, properly spaced */}
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(22)].map((_, i) => {
            const Icon = techIcons[i % techIcons.length];
            const size = 38 + (i % 7) * 7;

            return (
              <div
                key={i}
                ref={(el) => { if (el) iconRefs.current[i] = el; }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Icon
                  size={size}
                  className="text-cyan-400/90"
                  strokeWidth={1.5}
                />
              </div>
            );
          })}
        </div>

        {/* Soft clean core */}
        <div
          ref={coreRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full z-50 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ffffff 20%, #67e8f9 55%, transparent 92%)",
            boxShadow: "0 0 160px 80px rgba(103,232,249,0.45), inset 0 0 60px rgba(255,255,255,0.25)",
            filter: "blur(18px)",
          }}
        />

        {/* Projects */}
        <div className="relative z-10 w-full max-w-7xl px-6 md:px-10">
          <h2 className="text-[9vw] md:text-[7.2vw] font-black italic tracking-[-4px] mb-16 text-center md:text-left">
            WORKS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {projects.map((p, i) => (
              <div
                key={i}
                ref={(el) => { if (el) cardRefs.current[i] = el; }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl hover:border-cyan-400/30 transition-all duration-700 hover:-translate-y-4"
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-[16/9.4] relative"
                >
                  <img
                    src={`https://image.thum.io/get/width/1280/crop/720/noanimate/${p.url}`}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://picsum.photos/id/1015/1280/720";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-xs font-mono tracking-[3px] text-cyan-400">PROJECT_0{i + 1}</p>
                    <h3 className="text-4xl font-bold tracking-tight mt-1.5">{p.title}</h3>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="px-5 py-2 text-xs font-medium rounded-full border border-white/30 bg-black/70 backdrop-blur flex items-center gap-2">
                      LIVE <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[4px] text-white/30 flex flex-col items-center pointer-events-none">
          SCROLL TO ENTER SINGULARITY
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/40 to-transparent mt-3" />
        </div>
      </section>
    </div>
  );
}