import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "LI", href: "https://www.linkedin.com/in/rahul-dev-516906225/", icon: <Linkedin size={18} /> },
    { name: "TW", href: "https://x.com/rdev01431", icon: <Twitter size={18} /> },
    { name: "GH", href: "https://github.com/rahdev-space", icon: <Github size={18} /> },
  ];

  const quickLinks = ["About", "Projects", "Tech Specs", "Contact"];

  return (
    <footer className="relative bg-[#020204] text-white pt-32 pb-10 overflow-hidden border-t border-white/5">
      {/* BACKGROUND WATERMARK - Huge, subtle text for massive scale */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <h2 className="text-[18vw] font-black text-white/[0.02] leading-none tracking-tighter uppercase italic whitespace-nowrap px-12">
          RAHUL DEV
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* LEFT: THE CALL TO ACTION */}
        <div className="lg:col-span-7 space-y-10">
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[0.92] md:leading-[0.9]">
              Got a <span className="font-serif italic text-indigo-400">vision</span>?<br />
              Let’s make it real.
            </h3>

            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <a
                href="mailto:rahul@example.com"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-indigo-950/30 hover:shadow-indigo-900/50 transition-all duration-400 hover:scale-[1.02] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  START PROJECT
                  <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" size={18} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              </a>

              <div className="inline-flex items-center gap-3 px-7 py-5.5 border border-white/8 rounded-full backdrop-blur-xl bg-white/2 text-sm font-mono tracking-wide text-zinc-400">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </div>
                AVAILABLE — Q2 2026
              </div>
            </div>
          </div>

          {/* RIGHT: NAVIGATION & SOCIAL */}
          <div className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Navigation</h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(" ", "")}`} className="text-sm font-medium text-zinc-400   transition-colors hover:underline underline-offset-8">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Social Signal</h4>
              <div className="flex flex-col gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="flex items-center gap-3 text-sm text-zinc-400 hover:text-indigo-400 transition-all group"
                  >
                    <span className="p-2 border border-white/5 rounded-lg group-hover:border-indigo-500/50 transition-colors">
                      {link.icon}
                    </span>
                    <span className="font-mono">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          <div className="flex items-center gap-8">
            <span>Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
            <span className="hidden sm:block">Status: Optimized for v4.0</span>
          </div>
          
          <div className="text-zinc-600">
            &copy; {new Date().getFullYear()} RAHUL_DEV / ALL_RIGHTS_RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}