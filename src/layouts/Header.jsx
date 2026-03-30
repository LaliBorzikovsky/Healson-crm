import React from 'react';

const Header = () => {
  return (
    /* 1. רקע לבן עם פס תחתון עבה בתכלת העמוק המקצועי */
    <header className="bg-white border-b-[5px] border-[#007ea7] shadow-lg relative overflow-hidden" dir="rtl">
      
      {/* 2. פס זהב דק ויוקרתי שמפריד בין התכלת ללבן - נותן את הטאץ' של הילסון */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] opacity-80"></div>

      <div className="max-w-[1440px] mx-auto px-8 py-3 flex justify-between items-center relative z-10">
        
        {/* צד ימין: לוגו גדול בתוך סרגל דק (פרופורציונלי) */}
        <div className="flex items-center gap-6">
          <div className="transition-transform hover:scale-105">
            {/* לוגו בגובה h-20 - גדול וברור מאוד */}
            <img 
              src="/logo.png" 
              alt="Healson" 
              className="h-20 w-auto object-contain drop-shadow-sm" 
            />
          </div>
          
          {/* הפרדה דקה בתכלת */}
          <div className="flex flex-col border-r-2 border-[#007ea7]/20 pr-6 hidden md:flex">
            <h1 className="text-[#002147] font-black text-2xl leading-none tracking-tight">
              HEALSON <span className="text-[#007ea7]">CRM</span>
            </h1>
            <p className="text-[#C5A059] font-bold text-[12px] mt-1 uppercase tracking-[0.2em]">
              מחירון שירותים • 2026
            </p>
          </div>
        </div>

        {/* צד שמאל: פרטי המרכז עם נוכחות וניקיון */}
        <div className="flex items-center gap-6">
           <div className="text-left border-l-2 border-gray-100 pl-6 hidden sm:block">
              <span className="block text-[#002147] font-black text-xl leading-none">מרכז רפואי הילסון</span>
              <span className="block text-[#007ea7] text-[11px] font-bold mt-1 uppercase tracking-widest">Premium Care</span>
           </div>
           
           {/* אלמנט זהב יוקרתי - עיגול מעוצב ועדין */}
           <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F4DF4E] to-[#C5A059] shadow-md flex items-center justify-center border-2 border-white shadow-[#D4AF37]/20">
              <span className="text-white font-black text-xl drop-shadow-sm">H</span>
           </div>
        </div>

      </div>

      {/* עיטור רקע עדין מאוד בתכלת העמוק - נותן תחושת הייטק */}
      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-[#007ea7]/5 to-transparent skew-x-[-20deg] pointer-events-none"></div>
    </header>
  );
};

export default Header;