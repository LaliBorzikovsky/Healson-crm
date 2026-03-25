import React from 'react';
import { Search, Building, UserSquare2, Filter } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="bg-[#002147] p-5 rounded-xl shadow-lg border-b-4 border-yellow-500 mx-5 my-6 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,33,71,0.3)]" dir="rtl">
      
      {/* שורת חיפוש חופשי */}
      <div className="relative flex-1 text-[#002147]">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
        <input 
          type="text" 
          placeholder="חפש לפי שם רופא, קוד, או שירות..." 
          className="w-full h-12 pr-10 pl-4 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>

      {/* דרופדאון - מחלקה */}
      <div className="w-48 relative">
        <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
        <select className="w-full h-12 pr-10 pl-3 bg-[#003366] text-white rounded-lg border border-white/20 focus:border-white focus:ring-0 cursor-pointer appearance-none">
          <option value="">כל המחלקות</option>
          <option value="ילדים">רפואת ילדים</option>
          <option value="נשים">רפואת נשים</option>
        </select>
      </div>

      {/* דרופדאון - קטגוריה */}
      <div className="w-48 relative">
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
        <select className="w-full h-12 pr-10 pl-3 bg-[#003366] text-white rounded-lg border border-white/20 focus:border-white focus:ring-0 cursor-pointer appearance-none">
          <option value="">כל הקטגוריות</option>
          <option value="פו">פו</option>
          <option value="פרטי">פרטי</option>
        </select>
      </div>

      {/* כפתור חיפוש כחול חי */}
      <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg">
        <Search className="h-5 w-5" />
        חפש
      </button>

    </div>
  );
};

export default SearchBar;