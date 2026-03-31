import React from 'react';
import { ChevronLeft, UserRound, MapPin } from 'lucide-react';

/**
 * קומפוננטת שורה ברשימת הטיפולים.
 * מציגה תקציר של הטיפול: קוד, תגיות (סניף, מחלקה, רופא), שם ומחיר דינמי.
 * * @param {Object} row - נתוני הטיפול מהגליון
 * @param {Object} idx - מיפוי אינדקסים לעמודות
 * @param {Function} formatPrice - פונקציה לעיצוב המחיר (₪)
 * @param {Function} onSelect - פתיחת מודאל
 * @param {string} selectedInsurance - הקופה שנבחרה בסינון ("all", "clalit", etc.)
 */
const TreatmentRow = ({ row, idx, formatPrice, onSelect, selectedInsurance = "all" }) => {
  
  // בדיקות קיום נתונים לתצוגת תגיות
  const hasBranch = row[idx.branch] && row[idx.branch].trim() !== "" && row[idx.branch] !== "0";
  const hasDoctor = row[idx.doctor] && row[idx.doctor] !== "0" && row[idx.doctor].trim() !== "";
  const hasDept = row[idx.group] && row[idx.group] !== "0" && row[idx.group].trim() !== "";

  // לוגיקת מחיר דינמית:
  // אם נבחרה קופה ספציפית, נציג את המחיר שלה. אם לא, נציג מחיר פרטי.
  const isPrivate = selectedInsurance === "all";
  const displayPrice = isPrivate ? row[idx.pricePrivate] : row[idx[selectedInsurance]];
  const priceLabel = isPrivate ? "מחיר פרטי" : "השתתפות עצמית";

  return (
    <div
      onClick={() => onSelect(row)}
      className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer"
    >
      {/* צד ימין: קוד ומידע טקסטואלי */}
      <div className="flex items-center gap-4">
        
        {/* קוד פריט - עיצוב הילסון ב-Hover */}
        <div className="flex items-center justify-center w-10 h-10 text-xs font-bold transition-colors rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#002147] group-hover:text-[#D4AF37]">
          {row[idx.code] || '---'}
        </div>

        <div>
          {/* שורת תגיות (Badge Row) */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            
            {/* תגית סניף */}
            {hasBranch && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-[#475569] bg-slate-100 rounded">
                <MapPin size={10} />
                {row[idx.branch]}
              </span>
            )}

            {/* תגית מחלקה/קבוצה */}
            {hasDept && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-[#007ea7] bg-[#007ea7]/5 rounded">
                {row[idx.group]}
              </span>
            )}
            
            {/* תגית רופא מטפל */}
            {hasDoctor && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/10 rounded">
                <UserRound size={10} />
                {row[idx.doctor]}
              </span>
            )}
          </div>
          
          {/* שם הטיפול */}
          <h3 className="text-lg font-bold leading-tight text-[#002147]">
            {row[idx.name]}
          </h3>
        </div>
      </div>

      {/* צד שמאל: מחיר וכפתור כניסה */}
      <div className="flex items-center gap-3">
        <div className="ml-2 text-left">
          {/* תווית המחיר משתנה לפי סוג המחיר המוצג */}
          <span className={`block text-[9px] font-bold uppercase ${isPrivate ? 'text-slate-400' : 'text-[#007ea7]'}`}>
            {priceLabel}
          </span>
          <span className="text-xl font-black text-[#002147]">
            {formatPrice(displayPrice)}
          </span>
        </div>
        
        {/* אייקון חץ - אנימציה עדינה ב-Hover */}
        <ChevronLeft 
          size={18} 
          className="transition-all transform text-slate-300 group-hover:text-[#D4AF37] group-hover:-translate-x-1" 
        />
      </div>
    </div>
  );
};

export default TreatmentRow;