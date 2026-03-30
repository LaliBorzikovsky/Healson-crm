import React from 'react';
// הוספתי את MapPin לרשימת האייקונים
import { X, ShieldCheck, Building2, Layers, CreditCard, UserRound, MapPin } from 'lucide-react';

const TreatmentModal = ({ row, idx, formatPrice, onClose }) => {
  if (!row) return null;

  const insuranceInfo = [
    { label: "מאוחדת עדיף ושיא", val: row[idx.meuhedetK] },
    { label: "כללית מושלם ופלטיניום", val: row[idx.clalit] },
    { label: "לאומית זהב", val: row[idx.leumit] },
    { label: "מכבי שלי", val: row[idx.maccabiSheli] },
    { label: "מכבי כסף", val: row[idx.maccabiKesef] },
    { label: "מכבי זהב", val: row[idx.maccabiZahav] }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#002147]/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-5 left-5 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* חלק כחול עליון */}
        <div className="bg-[#002147] p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">מידע מלא למרפאה</span>
              </div>
              <h2 className="text-2xl font-black leading-tight">{row[idx.name]}</h2>
              
              {row[idx.doctor] && row[idx.doctor] !== "" && row[idx.doctor] !== "0" && (
                <div className="flex items-center gap-2 mt-2 text-[#D4AF37]">
                  <UserRound size={14} />
                  <span className="text-sm font-bold">{row[idx.doctor]}</span>
                </div>
              )}
            </div>

            <div className="text-left bg-white/5 p-3 rounded-2xl border border-white/10 min-w-[100px]">
              <span className="block text-[9px] text-[#D4AF37] font-bold uppercase mb-1">מחיר פרטי</span>
              <span className="text-2xl font-black text-white">{formatPrice(row[idx.pricePrivate])}</span>
            </div>
          </div>

          {/* שורת תגים (Badges) */}
          <div className="flex flex-wrap gap-2">
            {/* הצגת הסניף - חדש */}
            {row[idx.branch] && row[idx.branch] !== "" && (
              <div className="flex items-center gap-2 bg-[#D4AF37] px-3 py-1.5 rounded-lg text-[#002147] shadow-sm">
                <MapPin size={14} className="font-bold" />
                <span className="text-xs font-black">סניף {row[idx.branch]}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Building2 size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-bold">מחלקה: {row[idx.group] || "---"}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Layers size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-bold">יחידה: {row[idx.category] || "---"}</span>
            </div>
          </div>
        </div>

        {/* תוכן המודאל - החזרים */}
        <div className="p-6 space-y-6">
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

          <div>
            <h4 className="text-[#002147] font-bold text-sm mb-3 flex items-center gap-2">
              <CreditCard size={14} /> החזרים לפי קופות:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {insuranceInfo.map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{item.label}</span>
                  <span className="text-sm font-bold text-[#002147]">{formatPrice(item.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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