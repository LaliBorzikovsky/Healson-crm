import React from 'react';
import { Search, Zap, Activity } from 'lucide-react'; // החלפתי את command ב-Activity

const SearchBar = ({ onSearch }) => {
  return (
    <div className="max-w-[1500px] mx-auto mt-20 mb-16 px-8" dir="rtl">
      <div className="relative group">
        
        {/* הילה אחורית (Glow) */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#007ea7] via-[#D4AF37] to-[#002147] rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-1000"></div>

        <div className="relative">
          {/* אייקון חיפוש */}
          <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none z-20">
            <div className="p-3 bg-slate-50 rounded-2xl group-focus-within:bg-[#D4AF37] transition-colors duration-500 shadow-inner">
              <Search 
                className="text-[#002147] group-focus-within:text-white transition-all" 
                size={28} 
                strokeWidth={3}
              />
            </div>
          </div>

          {/* שדה הקלט הרחב */}
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="מה את רוצה למצוא היום בהילסון?..."
            className="w-full h-28 pr-28 pl-16 bg-white/80 backdrop-blur-2xl border-2 border-white/50 rounded-[40px] 
                       text-[#002147] font-black text-2xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.15)] 
                       outline-none transition-all duration-500
                       placeholder:text-slate-300 placeholder:font-black placeholder:italic
                       focus:bg-white focus:border-[#007ea7] focus:ring-[12px] focus:ring-[#007ea7]/5"
          />

          {/* אלמנט הסטטוס בצד שמאל */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4">
            <div className="flex flex-col items-start leading-none border-l-2 border-slate-100 pl-6">
              <span className="text-[9px] font-black text-[#007ea7] tracking-[0.3em] uppercase mb-1">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Database</span>
              </div>
            </div>
            
            <div className="bg-[#002147] text-[#D4AF37] px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20 transform hover:rotate-2 transition-transform cursor-default">
              <Zap size={18} fill="currentColor" />
              <span className="font-black text-xs uppercase tracking-tighter">Quick Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* עיטורים בתחתית הסרגל */}
      <div className="mt-8 flex justify-center gap-12 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        <div className="h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-[#007ea7] to-transparent"></div>
        <div className="h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
      </div>
    </div>
  );
};

export default SearchBar;