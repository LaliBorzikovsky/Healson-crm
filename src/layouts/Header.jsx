import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b-[5px] border-[#007ea7] shadow-lg relative overflow-hidden" dir="rtl">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] opacity-80"></div>

      <div className="max-w-[1440px] mx-auto px-8 py-3 flex justify-between items-center relative z-10">
        
        {/* צד ימין: לוגו */}
        <div className="flex items-center gap-6">
          <img src="/logo.png" alt="Healson" className="h-20 w-auto object-contain" />
          <div className="flex flex-col border-r-2 border-[#007ea7]/20 pr-6 hidden md:flex text-right">
            <h1 className="text-[#002147] font-black text-2xl leading-none">HEALSON <span className="text-[#007ea7]">CRM</span></h1>
            <p className="text-[#C5A059] font-bold text-[12px] mt-1 tracking-[0.2em]">מחירון שירותים • 2026</p>
          </div>
        </div>

        {/* צד שמאל: פרופיל */}
        <div className="flex items-center gap-6">
           {user ? (
             <div className="flex items-center gap-4 flex-row-reverse text-left">
                {/* תמונת פרופיל או H כגיבוי */}
                <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden shadow-md">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer" // חשוב מאוד כדי שגוגל יאשרו להציג את התמונה
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#D4AF37] to-[#C5A059] flex items-center justify-center text-white font-black text-xl">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="border-l-2 border-gray-100 pl-6 hidden sm:block">
                  <span className="block text-[#002147] font-black text-lg leading-none">{user.name}</span>
                  <button onClick={onLogout} className="text-[#007ea7] text-[11px] font-bold mt-1 hover:text-red-500 transition-colors uppercase">
                    Logout / התנתקות
                  </button>
                </div>
             </div>
           ) : (
             /* מצב לא מחובר */
             <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#C5A059] flex items-center justify-center border-2 border-white text-white font-black text-xl shadow-md">
               H
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;