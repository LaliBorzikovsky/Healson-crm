import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <div className="relative group">
        {/* האייקון של הזכוכית מגדלת */}
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#007ea7] text-slate-400">
          <Search size={20} strokeWidth={2.5} />
        </div>

        {/* שדה הקלט - עיצוב נקי ויוקרתי */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="חיפוש לפי שם טיפול, רופא או קוד פריט..."
          className="w-full bg-white border-none py-4 pr-14 pl-12 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:shadow-[0_10px_30px_rgba(0,126,167,0.1)] outline-none transition-all duration-300 text-[#002147] font-medium placeholder:text-slate-300 text-lg"
          dir="rtl"
        />

        {/* כפתור ניקוי מהיר - מופיע רק כשיש טקסט */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 left-4 flex items-center text-slate-300 hover:text-[#002147] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* אינדיקטור קטן מתחת לסרגל (אופציונלי) */}
      <div className="mt-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-50">
        Healson Quick Search System
      </div>
    </div>
  );
};

export default SearchBar;