import React from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  LayoutGrid, 
  History, 
  Settings, 
  User, 
  Command, 
  Users, 
  Share2,
  ChevronDown
} from 'lucide-react';

const MainLayout = ({ children, onNewAnalysis, onViewHistory }) => {
  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-slate-300 overflow-hidden font-sans">
      
      {/* 💎 1. ENHANCED ENTERPRISE NAVBAR */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        
        {/* Left Section: Logo & Global Search */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Command className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none tracking-tight">CreditCopilot</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">System Ready</span>
              </div>
            </div>
          </div>

          {/* Command Palette Style Search */}
          <div className="relative hidden lg:block group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search reports or press ⌘K" 
              className="bg-slate-800/40 border border-slate-700/50 rounded-xl py-2 pl-10 pr-12 text-xs w-80 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 shadow-inner" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900 text-[9px] font-bold text-slate-500">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Section: Collaboration & Profile */}
        <div className="flex items-center gap-6">
          
          {/* Collaboration Presence */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 ring-1 ring-indigo-500/20">JD</div>
              <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/20">AS</div>
              <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-lg">+2</div>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-white transition-colors bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700">
              <Share2 size={12} /> Share
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-lg">3</span>
            </button>
            
            <button 
              onClick={onNewAnalysis}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 border border-indigo-400/20"
            >
              <Plus size={16} /> <span className="hidden sm:inline">New Analysis</span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 pl-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-700 to-indigo-900 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                JD
              </div>
              <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠 2. SIDE NAVIGATION (Refined) */}
        <aside className="w-16 border-r border-slate-800/60 bg-slate-900/40 flex flex-col items-center py-8 gap-10 shrink-0 shadow-2xl">
          <nav className="flex flex-col gap-8">
            <button className="p-2.5 text-indigo-400 bg-indigo-500/10 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.15)] border border-indigo-500/20 ring-1 ring-indigo-400/10">
              <LayoutGrid size={22} />
            </button>
            <button 
              onClick={onViewHistory}
              className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all group relative"
            >
              <History size={22} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-[10px] font-bold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                History
              </span>
            </button>
            <button className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all group relative">
              <Users size={22} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-[10px] font-bold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                Teams
              </span>
            </button>
          </nav>

          <nav className="mt-auto flex flex-col gap-6">
            <button className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
              <Settings size={22} />
            </button>
            <div className="w-8 h-px bg-slate-800 mx-auto mb-2" />
          </nav>
        </aside>

        {/* 📄 3. MAIN CONTENT STAGE */}
        <main className="flex-1 bg-slate-950 relative overflow-hidden flex shadow-[inset_10px_0_40px_rgba(0,0,0,0.3)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;