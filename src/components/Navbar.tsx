import React from 'react';
import { Dumbbell, ShieldCheck, FileText, Sparkles, PlusCircle } from 'lucide-react';
import { ActivePage } from '../types/fitness.ts';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenReadme: () => void;
  hasActivePlan: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenReadme,
  hasActivePlan,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with icon */}
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-zinc-950 font-bold" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              FitBuddy
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/50 px-1.5 py-0.2 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal">AI Fitness Plan Generator</p>
          </div>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActivePage('home')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activePage === 'home'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Plan</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            onClick={() => setActivePage('result')}
            disabled={!hasActivePlan}
            title={!hasActivePlan ? 'Generate or load a plan first' : 'View workout plan'}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activePage === 'result'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : hasActivePlan
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                : 'text-zinc-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Current Plan</span>
            <span className="sm:hidden">Plan</span>
          </button>

          <button
            onClick={() => setActivePage('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activePage === 'admin'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Trainer Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Project Guide */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReadme}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            title="Open College Project Documentation & Testing Guide"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Project Guide</span>
            <span className="md:hidden">Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
};
