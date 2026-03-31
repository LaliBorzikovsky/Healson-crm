import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full relative group">
      {/* אייקון זכוכית מגדלת - מימין */}
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#007ea7] text-slate-400 z-10">
        <Search size={18} strokeWidth={2.5} />
      </div>

      {/* שדה הקלט */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="חיפוש חופשי..."
        className="w-full h-[52px] bg-white border border-slate-200 py-4 pr-11 pl-10 rounded-2xl shadow-sm focus:shadow-md focus:border-[#007ea7] outline-none transition-all duration-300 text-[#002147] font-bold placeholder:text-slate-300 text-sm lg:text-base"
        dir="rtl"
      />

      {/* כפתור ניקוי מהיר - מופיע רק כשיש טקסט */}
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute inset-y-0 left-3 flex items-center text-slate-300 hover:text-red-500 transition-colors z-10"
          title="נקה חיפוש"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;