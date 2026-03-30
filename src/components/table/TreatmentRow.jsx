import React from 'react';
// הוספתי את MapPin לרשימת האייקונים
import { ChevronLeft, UserRound, MapPin } from 'lucide-react';

const TreatmentRow = ({ row, idx, formatPrice, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(row)}
      className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        {/* קוד פריט */}
        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs group-hover:bg-[#002147] group-hover:text-[#D4AF37] transition-colors">
          {row[idx.code] || '---'}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* תגית סניף (חדש - סגול/אפור כהה כדי להבדיל) */}
            {row[idx.branch] && row[idx.branch] !== "" && (
              <span className="text-[10px] font-bold text-[#475569] bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <MapPin size={10} />
                {row[idx.branch]}
              </span>
            )}

            {/* תגית מחלקה (כחול) */}
            <span className="text-[10px] font-bold text-[#007ea7] bg-[#007ea7]/5 px-1.5 py-0.5 rounded">
              {row[idx.group] || "כללי"}
            </span>
            
            {/* תגית רופא (זהב) */}
            {row[idx.doctor] && row[idx.doctor] !== "" && row[idx.doctor] !== "0" && (
              <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                <UserRound size={10} />
                {row[idx.doctor]}
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-[#002147] text-lg leading-tight">
            {row[idx.name]}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-left ml-2">
          <span className="block text-[9px] text-slate-400 font-bold uppercase">מחיר פרטי</span>
          <span className="text-xl font-black text-[#002147]">{formatPrice(row[idx.pricePrivate])}</span>
        </div>
        <ChevronLeft size={18} className="text-slate-300 group-hover:text-[#D4AF37] transform group-hover:-translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default TreatmentRow;