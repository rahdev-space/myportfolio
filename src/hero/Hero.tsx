"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CpuChipIcon } from "@heroicons/react/24/outline";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  angle: number;
  radius: number;
  orbiting: boolean;
}

export default function EternalCoreHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isIgnited, setIsIgnited] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const animationFrame = useRef<number | null>(null);

  /* Smooth page fade */
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  /* Core breathing */
  useEffect(() => {
    gsap.to(coreRef.current, {
      scale: 1.04,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  /* Mouse tracking */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  /* Particle + Meteor Engine */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    particles.current = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.4 + 0.2,
      hue: 210 + Math.random() * 20,
    }));

    let shockwaveRadius = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(6, 8, 20, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* Background particles */
      particles.current.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        p.vx += (dx / dist) * 0.008;
        p.vy += (dy / dist) * 0.008;

        p.vx += (cx() - p.x) * 0.0004;
        p.vy += (cy() - p.y) * 0.0004;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `hsla(${p.hue},40%,60%,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      /* Spawn meteors after ignition */
      if (isIgnited && Math.random() < 0.25) {
        const edge = Math.floor(Math.random() * 4);
        let x = 0;
        let y = 0;

        if (edge === 0) { x = Math.random() * canvas.width; y = 0; }
        else if (edge === 1) { x = canvas.width; y = Math.random() * canvas.height; }
        else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height; }
        else { x = 0; y = Math.random() * canvas.height; }

        const angle = Math.atan2(cy() - y, cx() - x);

        meteors.current.push({
          x,
          y,
          vx: Math.cos(angle) * 4,
          vy: Math.sin(angle) * 4,
          life: 1,
          angle: 0,
          radius: 0,
          orbiting: false,
        });
      }

      /* Meteor logic */
      meteors.current.forEach((m, i) => {
        const dx = cx() - m.x;
        const dy = cy() - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!m.orbiting) {
          m.vx += dx * 0.0008;
          m.vy += dy * 0.0008;

          m.x += m.vx;
          m.y += m.vy;

          if (dist < 150) {
            m.orbiting = true;
            m.radius = dist;
            m.angle = Math.atan2(dy, dx);
            shockwaveRadius = 10;
          }
        } else {
          m.angle += 0.05;
          m.radius *= 0.995;

          m.x = cx() + Math.cos(m.angle) * m.radius;
          m.y = cy() + Math.sin(m.angle) * m.radius;

          if (m.radius < 40) {
            meteors.current.splice(i, 1);
          }
        }

        ctx.save();
        ctx.globalAlpha = m.life;
        ctx.strokeStyle = "rgba(180,220,255,0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 2, m.y - m.vy * 2);
        ctx.stroke();
        ctx.restore();
      });

      /* Shockwave */
      if (shockwaveRadius > 0) {
        ctx.beginPath();
        ctx.arc(cx(), cy(), shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(150,200,255,${1 - shockwaveRadius / 200})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        shockwaveRadius += 6;
        if (shockwaveRadius > 200) shockwaveRadius = 0;
      }

      animationFrame.current = requestAnimationFrame(draw);
    };

    animationFrame.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      window.removeEventListener("resize", resize);
    };
  }, [isIgnited]);

  /* Ignition */
  const igniteCore = () => {
    if (isIgnited) return;
    setIsIgnited(true);

    audioRef.current?.play().catch(() => {});

    gsap.to(coreRef.current, {
      scale: 2.5,
      opacity: 0.3,
      duration: 1,
      ease: "power3.in",
    });

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 80, scale: 0.7 },
      { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "power4.out", delay: 0.5 }
    );

    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 1.1 }
    );

    gsap.to(coreRef.current, {
      scale: 1.2,
      opacity: 0.9,
      duration: 2,
      ease: "power2.out",
      delay: 1,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#050814] overflow-hidden flex items-center justify-center"
    >
      <audio ref={audioRef} src="starting.mp3" preload="auto" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      <div
        ref={coreRef}
        onClick={igniteCore}
        className="relative z-30 w-44 h-44 md:w-56 md:h-56 rounded-full cursor-pointer"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, #e2e8f0 0%, #1e293b 40%, #0f172a 75%, transparent 100%)",
          boxShadow:
            "0 0 50px 20px rgba(59,130,246,0.22), 0 0 120px 60px rgba(30,64,175,0.16), inset 0 0 40px rgba(255,255,255,0.2)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <CpuChipIcon className="w-16 h-16 md:w-20 md:h-20 text-slate-200 opacity-80" />
        </div>
      </div>

        <div
        ref={titleRef}
        className="absolute z-40 text-center opacity-0 pointer-events-none"
      >
        <h1 className="text-[13vw] md:text-[11vw] lg:text-[9vw] font-black tracking-[-0.04em] leading-none text-slate-200">
          Rahul DEv
          
        </h1>
        <p className="text-xl md:text-3xl font-light tracking-[0.4em] text-blue-300/70 mt-3">
          FULL STACK WEB ARCHITECT
        </p>
      </div>

      <div ref={navRef} className="absolute bottom-16 z-50 flex gap-8 opacity-0">
        {["PROJECTS", "STACK", "ABOUT", "CONTACT"].map((label, i) => (
          <a
            key={i}
            href={`#${label.toLowerCase()}`}
            className="px-6 py-2 text-sm tracking-widest text-blue-200/70 hover:text-white border border-blue-400/10 hover:border-blue-400/40 rounded-full"
          >
            {label}
          </a>
        ))}
      </div>

      {!isIgnited && (
        <div className="absolute bottom-12 z-50 text-blue-300/50 text-sm tracking-[3px]">
          CLICK TO ENTER
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
    </section>
  );
}