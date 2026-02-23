"use client";

import { useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "PLEXJAR", url: "https://plexjar.com/" },
  { title: "WEBMIX", url: "https://webmixstudio.com/" },
  { title: "ARKIN", url: "https://arkinorganic.vercel.app/" },
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

  // Audio unlock (mobile + desktop)
  useEffect(() => {
    const unlockAudio = () => {
      hasUnlockedAudio.current = true;
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("scroll", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const icons = iconRefs.current.filter(Boolean);
      const cards = cardRefs.current.filter(Boolean);
      const core = coreRef.current;

      if (!icons.length || !core) return;

      gsap.set([core, ...icons, ...cards], { willChange: "transform, opacity", force3D: true });

      // === SUPER CLEAN INITIAL STATES ===
      gsap.set(core, { scale: 0.15, opacity: 0, rotation: 0 });

      icons.forEach((icon, i) => {
        if (!icon) return;
        const radius = 240 + Math.random() * 580;
        const angle = (i / icons.length) * Math.PI * 2 + (Math.random() - 0.5) * 1.8;

        gsap.set(icon, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 980,
          scale: 0.28 + Math.random() * 0.82,
          rotation: Math.random() * 90 - 45,
          opacity: 0,
        });
      });

      gsap.set(cards, { opacity: 0, y: 160, scale: 0.88, rotation: 0 });

      // === TIMELINE - NO SCRUB HERE (we control progress manually) ===
      const tl = gsap.timeline({ paused: true });

      // 1. Dramatic drop from above (super buttery)
      tl.to(icons, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        stagger: { each: 0.035, from: "random" },
        duration: 1.75,
        ease: "power4.out",
        onStart: () => {
          if (hasUnlockedAudio.current && dropAudioRef.current) {
            dropAudioRef.current.volume = 0.25;
            dropAudioRef.current.play().catch(() => {});
          }
        },
      })

      // 2. Gentle organic vibration (feels alive)
      .to(icons, {
        x: "+=6",
        y: "+=3",
        rotation: "+=8",
        repeat: 3,
        yoyo: true,
        duration: 0.13,
        ease: "power1.inOut",
      }, "-=0.65")

      // 3. Powerful suck into core with crazy spin
      .to(icons, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotation: () => gsap.utils.random(-920, 920),
        stagger: 0.016,
        duration: 1.25,
        ease: "expo.in",
      }, "-=0.55")

      // 4. Core birth (soft + bouncy)
      .to(core, {
        scale: 1.42,
        opacity: 1,
        duration: 0.75,
        ease: "back.out(1.8)",
      }, "-=0.65")

      // 5. Tiny pre-explosion pulse (adds premium feel)
      .to(core, {
        scale: 1.68,
        duration: 0.35,
        ease: "power2.out",
      }, "-=0.25")

      // 6. MASSIVE EXPLOSION
      .to(core, {
        scale: 92,
        opacity: 0,
        rotation: 2840,
        duration: 1.55,
        ease: "expo.in",
      }, "-=0.2")

      // 7. Deep cinematic background shift
      .to(sectionRef.current!, {
        backgroundColor: "#0a0a0a",
        duration: 0.15,
      }, "-=1.25")
      .to(sectionRef.current!, {
        backgroundColor: "#020202",
        duration: 1.1,
      }, "-=1.05")

      // 8. Cards reveal - ultra smooth & cinematic
      .to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        stagger: { each: 0.16, from: "start" },
        duration: 1.9,
        ease: "power4.out",
      }, "-=1.35");

      // === FORWARD-ONLY SCROLL CONTROL (animation runs ONCE when scrolling down) ===
      let maxProgress = 0;

      const scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=4600",           // longer pin = more breathing room after animation
        pin: true,
        pinSpacing: true,
        scrub: 1.05,              // ultra-smooth follow (tuned for butter)
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > maxProgress) {
            maxProgress = self.progress;
            tl.progress(maxProgress);
          }
          // when fully complete, force 100% (safety)
          if (self.progress >= 0.99) {
            tl.progress(1);
          }
        },
      });

      // Cleanup
      return () => {
        scrollTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
  <div className="bg-black text-white overflow-hidden">
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[100svh]
        w-full
        flex
        items-center
        justify-center
        overflow-hidden
        px-4
        sm:px-6
        md:px-10
      "
    >
      <audio ref={dropAudioRef} src="stones-falling.mp3" preload="auto" />

      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.055),transparent_80%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* ICONS */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {[...Array(24)].map((_, i) => {
          const Icon = techIcons[i % techIcons.length];
          const size =
            typeof window !== "undefined" && window.innerWidth < 640
              ? 28 + (i % 6) * 5
              : 36 + (i % 8) * 6.5;

          return (
            <div
              key={i}
              ref={(el) => {
                if (el) iconRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Icon
                size={size}
                className="text-cyan-400/85 drop-shadow-[0_0_12px_rgb(103,232,249)]"
                strokeWidth={1.45}
              />
            </div>
          );
        })}
      </div>

      {/* Core */}
      <div
        ref={coreRef}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-20 h-20
          sm:w-24 sm:h-24
          md:w-28 md:h-28
          rounded-full
          z-50
          pointer-events-none
        "
        style={{
          background:
            "radial-gradient(circle at 38% 32%, #ffffff 18%, #67e8f9 58%, transparent 90%)",
          boxShadow:
            "0 0 180px 95px rgba(103,232,249,0.52), inset 0 0 70px rgba(255,255,255,0.35)",
          filter: "blur(20px)",
        }}
      />

      {/* Projects */}
      <div className="relative z-10 w-full max-w-7xl  sm:mt-28 md:mt-32 sm:mb-20">
        <h2
          className="
            text-[12vw]
            sm:text-[10vw]
            md:text-[8vw]
            lg:text-[7vw]
            font-black
            italic
            tracking-[-3px]
            md:tracking-[-4.5px]
            mb-12
            sm:mb-16
            text-center
            md:text-left
            leading-none
          "
        >
          WORKS.
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-1
            md:grid-cols-2
            gap-8
            sm:gap-10
            md:gap-14
            lg:gap-16
          "
        >
          {projects.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                sm:rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-3xl
                hover:border-cyan-400/40
                transition-all duration-700
                hover:-translate-y-4
                active:scale-[0.98]
              "
            >
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[16/9.35] relative"
              >
                <img
                  src={`https://image.thum.io/get/width/1280/crop/720/noanimate/${p.url}`}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="
                    absolute inset-0 w-full h-full object-cover
                    opacity-75
                    transition-all duration-1000
                    group-hover:scale-110
                    group-hover:opacity-100
                  "
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://picsum.photos/id/1015/1280/720";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8">
                  <p className="text-[10px] sm:text-xs font-mono tracking-[2.5px] sm:tracking-[3.5px] text-cyan-400">
                    PROJECT_0{i + 1}
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-1">
                    {p.title}
                  </h3>
                </div>

                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-5 group-hover:translate-y-0">
                  <div className="px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium rounded-full border border-white/30 bg-black/80 backdrop-blur flex items-center gap-2">
                    LIVE
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:rotate-45"
                    />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
}