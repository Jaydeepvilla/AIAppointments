import { SignUp } from "@clerk/nextjs";
import { Bot, Shield, Cpu, Layers, PhoneCall, Calendar, Users, Award } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row bg-[#080710] text-white overflow-hidden font-sans">
      
      {/* ── GPU-Accelerated CSS Animations ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes driftAurora {
          0% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(15%, 15%) scale(1.1); }
          100% { transform: translate(-10%, -10%) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); filter: blur(3px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .aurora-blur {
          filter: blur(130px);
          will-change: transform;
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          animation: floatGrid 25s linear infinite;
        }
        .glow-border {
          box-shadow: inset 0 0 20px rgba(139,92,246,0.05), 0 0 40px rgba(139,92,246,0.02);
        }
        .animate-card-1 { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-card-2 { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s; }
        .animate-card-3 { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s; }
      `}} />

      {/* ── Left Column: System Preview ── */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between p-20 overflow-hidden border-r border-white/5 bg-[#0b0a15]">
        
        {/* Ambient Lights */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 pointer-events-none aurora-blur" style={{ animation: "driftAurora 25s infinite ease-in-out" }} />
        <div className="absolute bottom-[-15%] right-[-15%] w-[65%] h-[65%] rounded-full bg-emerald-600/5 pointer-events-none aurora-blur" style={{ animation: "driftAurora 30s infinite ease-in-out 3s" }} />

        {/* Perspective Grid */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Brand Header */}
        <div className="z-10 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 transition-transform group-hover:scale-105">
              <Bot className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-wider text-white">OPERATOR</span>
              <span className="block text-[9px] font-black text-violet-400 tracking-widest mt-0.5 uppercase">AI OS</span>
            </div>
          </Link>
        </div>

        {/* Product Information & Live Activity Feed Stack */}
        <div className="z-10 max-w-lg space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Cpu className="h-3 w-3" /> Receptionist Online
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
              Centralized Front-Desk Automation for SaaS.
            </h2>
            <p className="text-xs text-white/40 leading-relaxed">
              Your autonomous AI receptionist answers patient calls, synchronizes calendar slots, updates CRM segments, and books payments globally.
            </p>
          </div>

          {/* Staggered vertical event log stack */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-white/35">Call & Event Stream</label>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Active Connection
              </div>
            </div>

            {/* Log 1 */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md glow-border flex items-start gap-3.5 animate-card-1 opacity-0">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20"><PhoneCall className="h-4 w-4" /></div>
              <div>
                <span className="text-xs font-bold text-white">Call Answered</span> from <strong>+1 (415) 555-0192</strong>
                <p className="text-[10px] text-white/44 mt-1">Duration: 2m 14s • Autocomplete invoice sent</p>
              </div>
            </div>

            {/* Log 2 */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md glow-border flex items-start gap-3.5 animate-card-2 opacity-0">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Calendar className="h-4 w-4" /></div>
              <div>
                <span className="text-xs font-bold text-white">Google Calendar Sync</span> updated successfully
                <p className="text-[10px] text-white/44 mt-1">Slot: Tomorrow, 2:30 PM • Dental Hygiene</p>
              </div>
            </div>

            {/* Log 3 */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md glow-border flex items-start gap-3.5 animate-card-3 opacity-0">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"><Users className="h-4 w-4" /></div>
              <div>
                <span className="text-xs font-bold text-white">CRM Segment updated</span> for client **Sarah Smith**
                <p className="text-[10px] text-white/44 mt-1">Matched preference tags: "Prefers morning slots"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Compliance Tags */}
        <div className="z-10 flex flex-wrap items-center gap-6 border-t border-white/5 pt-6 text-[9px] font-bold text-white/30 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-violet-400" /> SOC-2 Compliant</span>
          <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-violet-400" /> SSL 256-Bit Encrypted</span>
          <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-violet-400" /> 99.99% Node Uptime</span>
        </div>
      </div>

      {/* ── Right Column: Clerk Login Container (Using standard rendering values) ── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 relative overflow-hidden bg-[#080710] min-h-screen">
        
        {/* Ambient mobile glows */}
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/5 pointer-events-none aurora-blur lg:hidden" />

        <div className="z-10 flex w-full max-w-[430px] flex-col space-y-6">
          
          {/* Mobile Header Logo */}
          <div className="flex flex-col items-center space-y-2 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Bot className="h-5.5 w-5.5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Operator</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-white">Create your account</h1>
            <p className="text-xs text-white/45">Get started with your free 14-day trial</p>
          </div>

          {/* Simple container to let Clerk load natively with zero style conflicts */}
          <div className="w-full flex items-center justify-center min-h-[500px]">
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
}
