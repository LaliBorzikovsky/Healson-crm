import React from 'react';
// 1. ייבוא הלוגו מתיקיית ה-assets
import Logo from '../assets/healson-logo.png'; // ודאי ששם הקובץ והסיומת (png) תואמים!

const Header = () => {
  return (
    // 2. עדכון גובה ה-Header הכולל מ-p-3 ל-p-5 כדי לתת מקום ללוגו הגדול
    <header className="bg-white text-[#002147] p-5 flex justify-between items-center px-10 border-b-4 border-yellow-500" dir="rtl">
      <div className="flex items-center gap-5">
        {/* 3. הגדלת הלוגו: שינינו מ-h-16 ל-h-24. h-24 = 96px */}
        <img src={Logo} alt="HEALSON Logo" className="h-24 w-auto drop-shadow-sm" />
        
        {/* כותרת האפליקציה והסלוגן העברי */}
        <div className="flex flex-col border-r-2 border-[#002147]/20 pr-5">
          <h1 className="text-3xl font-extrabold tracking-tight">איתור שירותים ורופאים</h1>
          <p className="text-sm font-medium text-[#002147]/80">הילסון רפואה אישית בסטנדרט חדש</p>
        </div>
      </div>
      
      {/* פרטי קשר וסטטוס פנימי */}
      <div className="flex flex-col items-end gap-1 text-sm text-[#002147]/70">
        <div className="flex items-center gap-3 font-light">
          <span>office@healson.co.il</span>
          <span>|</span>
          <span>074-7747444</span>
        </div>
        <div className="bg-[#002147] text-white text-[10px] px-2 py-0.5 rounded font-mono">
          ממשק עובדים פנימי | תצוגה בלבד
        </div>
      </div>
    </header>
  );
};

export default Header;