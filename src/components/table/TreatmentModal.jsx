import React from 'react';
import { X, ShieldCheck, CreditCard, UserRound, MapPin } from 'lucide-react';

/**
 * קומפוננטת מודאל להצגת פרטי טיפול מלאים.
 * * @param {Object} row - אובייקט המכיל את נתוני השורה מהטבלה
 * @param {Object} idx - אובייקט המיפוי של אינדקסי העמודות (Column Mapping)
 * @param {Function} formatPrice - פונקציה לעיצוב מחיר (למשל הוספת ₪)
 * @param {Function} onClose - פונקציה לסגירת המודאל
 */
const TreatmentModal = ({ row, idx, formatPrice, onClose }) => {
  // הגנה למקרה שהמודאל נפתח ללא נתונים
  if (!row) return null;

  // ריכוז המידע על החזרי קופות החולים למבנה נתונים סרוק
  const insuranceInfo = [
    { label: "מאוחדת עדיף", val: row[idx.meuhedetAdif] },
    { label: "מאוחדת שיא", val: row[idx.meuhedetSia] },
    { label: "כללית מושלם ופלטיניום", val: row[idx.clalit] },
    { label: "לאומית זהב", val: row[idx.leumit] },
    { label: "מכבי שלי", val: row[idx.maccabiSheli] },
    { label: "מכבי כסף", val: row[idx.maccabiKesef] },
    { label: "מכבי זהב", val: row[idx.maccabiZahav] }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* רקע מעומעם (Overlay) */}
      <div
        className="absolute inset-0 bg-[#002147]/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* גוף המודאל */}
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* כפתור סגירה */}
        <button
          onClick={onClose}
          aria-label="סגור מודאל"
          className="absolute top-5 left-5 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* חלק עליון - כותרת ופרטי מחיר */}
        <div className="bg-[#002147] p-5 text-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] font-bold tracking-widest uppercase">מידע למרפאה</span>
              </div>
              <h2 className="text-xl font-black leading-tight">{row[idx.name]}</h2>
              
              {/* הצגת שם הרופא במידה וקיים */}
              {row[idx.doctor] && row[idx.doctor] !== "0" && (
                <div className="flex items-center gap-2 mt-1 text-[#D4AF37]">
                  <UserRound size={12} />
                  <span className="text-xs font-bold">{row[idx.doctor]}</span>
                </div>
              )}
            </div>

            {/* תיבת מחיר פרטי */}
            <div className="text-left bg-white/10 px-3 py-2 rounded-xl border border-white/10 shrink-0 mt-6 self-end">
              <span className="block text-[8px] text-[#D4AF37] font-bold uppercase">מחיר פרטי</span>
              <span className="text-lg font-black text-white">{formatPrice(row[idx.pricePrivate])}</span>
            </div>
          </div>

          {/* תגיות מידע (סניף, קטגוריה, קבוצה) */}
          <div className="flex flex-wrap gap-2 items-center">
            {row[idx.branch] && (
              <div className="flex items-center gap-1.5 bg-[#D4AF37] px-2 py-1 rounded-md text-[#002147]">
                <MapPin size={12} strokeWidth={3} />
                <span className="text-[11px] font-black">{row[idx.branch]}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/10 text-[10px] font-bold opacity-90">
              {row[idx.group] || "---"}
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-md border border-white/10 text-[10px] font-bold">
              {row[idx.category] || "---"}
            </div>
          </div>
        </div>

        {/* חלק מרכזי - נתוני החזרים ותשלומים */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* כרטיסיית סיכום החזר והשתתפות */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl p-5 flex justify-between items-center shadow-lg text-[#002147]">
            <div className="text-center flex-1">
              <span className="block text-[10px] font-bold uppercase opacity-80 mb-1">מקדמה הילסון / החזר</span>
              <span className="text-2xl font-black text-white">{formatPrice(row[idx.combinedRefund])}</span>
            </div>
            <div className="w-px h-10 bg-[#002147]/20"></div>
            <div className="text-center flex-1">
              <span className="block text-[10px] font-bold uppercase opacity-80 mb-1">השתתפות עצמית</span>
              <span className="text-2xl font-black text-white">{formatPrice(row[idx.prepaidSelf])}</span>
            </div>
          </div>

          {/* פירוט לפי קופות חולים */}
          <div>
            <h4 className="text-[#002147] font-bold text-sm mb-3 flex items-center gap-2">
              <CreditCard size={14} /> החזרים לפי קופות:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {insuranceInfo.map((item, i) => (
                <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{item.label}</span>
                  <span className="text-sm font-bold text-[#002147]">{formatPrice(item.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* חלק תחתון - קרדיט וקוד טיפול */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Healson Price List System • {row[idx.code]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentModal;