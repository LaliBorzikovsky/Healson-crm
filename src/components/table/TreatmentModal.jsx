import React from 'react';
import { X, CreditCard, UserRound, MapPin, Award } from 'lucide-react';

const TreatmentModal = ({ row, idx, formatPrice, onClose }) => {
  if (!row) return null;

  const insuranceInfo = [
    { label: "מאוחדת עדיף", val: row[idx.meuhedetAdif] },
    { label: "מאוחדת שיא", val: row[idx.meuhedetSia] },
    { label: "כללית מושלם", val: row[idx.clalit] },
    { label: "לאומית זהב", val: row[idx.leumit] },
    { label: "מכבי שלי", val: row[idx.maccabiSheli] },
    { label: "מכבי כסף", val: row[idx.maccabiKesef] },
    { label: "מכבי זהב", val: row[idx.maccabiZahav] }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#000b1a]/80 backdrop-blur-sm" onClick={onClose} />

      {/* גוף המודאל - מהודק וקומפקטי (Compact Elite) */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#D4AF37]/20 transition-all duration-300">
        
        {/* Header - כחול עמוק מהודק */}
        <div className="bg-[#002147] p-6 pb-10 text-white relative">
          <button onClick={onClose} className="absolute top-5 left-5 text-white/30 hover:text-[#D4AF37] transition-colors">
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Award size={14} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em]">Healson Elite</span>
          </div>

          <h2 className="text-2xl font-black leading-tight tracking-tight mb-5">
            {row[idx.name]}
          </h2>

          <div className="flex gap-4 opacity-90">
            <div className="flex items-center gap-2">
              <UserRound size={14} className="text-[#D4AF37]" />
              <span className="text-[12px] font-bold">{row[idx.doctor] || "מרפאה כללית"}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              <MapPin size={14} className="text-[#D4AF37]" />
              <span className="text-[12px] font-bold">{row[idx.branch]}</span>
            </div>
          </div>
        </div>

        {/* באנר המידע המרכזי - זהב ברור במידות נכונות */}
        <div className="px-5 -mt-6 relative z-10">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-[1.8rem] p-5 shadow-lg flex justify-between items-center text-[#002147] border border-white/10">
            <div className="flex flex-col gap-0.5">
               <span className="text-[11px] font-black uppercase tracking-wider opacity-70">מחלקה • יחידה</span>
               <span className="text-[13px] font-black leading-tight">{row[idx.group]} | {row[idx.category]}</span>
            </div>
            <div className="text-left border-r border-[#002147]/10 pr-5">
              <span className="block text-[11px] font-black uppercase opacity-70 mb-0.5">מחיר פרטי</span>
              <span className="text-2xl font-black leading-none tracking-tighter">{formatPrice(row[idx.pricePrivate])}</span>
            </div>
          </div>
        </div>

        {/* קופות חולים - פריסה מהודקת וקריאה */}
        <div className="p-6 pt-8 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={15} className="text-[#002147] opacity-50" />
            <span className="text-[12px] font-black text-[#002147] uppercase tracking-widest">החזרים לפי קופות</span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            {insuranceInfo.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 border-b border-slate-50 pb-1.5 group">
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                  {item.label}
                </span>
                <span className="text-[14px] font-black text-[#002147]">
                  {formatPrice(item.val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - מאוזן וברור */}
        <div className="p-6 pt-0 flex justify-between items-center px-8 pb-8">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase">קוד פריט:</span>
             <span className="text-[11px] font-black text-[#002147]/60">{row[idx.code]}</span>
          </div>
          <span className="text-[9px] text-slate-200 font-bold uppercase tracking-[0.4em]">Healson Elite Care</span>
        </div>
      </div>
    </div>
  );
};

export default TreatmentModal;