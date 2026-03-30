import React, { useState, useEffect } from 'react';
import { Loader2, UserRound, X, ChevronLeft, CreditCard, ShieldCheck, Building2, Layers, Banknote } from 'lucide-react';

const ResultsTable = ({ searchTerm = "" }) => {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const sheetId = import.meta.env.VITE_SHEET_ID;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/data!A1:AZ2000?key=${apiKey}`;
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.values) {
          setData({ headers: result.values[0], rows: result.values.slice(1) });
        }
      } catch (e) { console.error("Error fetching data"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getCol = (name) => data.headers ? data.headers.findIndex(h => h && h.trim() === name) : -1;

  const idx = {
    code: getCol("קוד פריט"),
    name: getCol("שם פריט"),
    doctor: getCol("צוות"),
    category: getCol("קטגורית פריט"), // יוצג כ"יחידה"
    group: getCol("קבוצת יומן"),      // יוצג כ"מחלקה"
    pricePrivate: getCol("מחיר (פרטי)"),
    combinedRefund: getCol("מקדמה הילסון החזר ופרטי"),
    prepaidSelf: getCol("מקדמה השתתפות עצמית"),
    meuhedetK: getCol("k מאוחדת עדיף ושיא"),
    clalit: getCol("כללית מושלם ופלטיניום"),
    leumit: getCol("לאומית זהב"),
    maccabiSheli: getCol("מכבי שלי"),
    maccabiKesef: getCol("מכבי כסף"),
    maccabiZahav: getCol("מכבי זהב")
  };

  const formatPrice = (val) => {
    if (!val || val === "0" || val === "") return "---";
    return val.toString().includes('₪') ? val : `₪${val}`;
  };

  const filteredRows = data.rows.filter(row => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase().trim();
    
    const name = row[idx.name]?.toString().toLowerCase() || "";
    const doctor = row[idx.doctor]?.toString().toLowerCase() || "";
    const code = row[idx.code]?.toString().toLowerCase() || "";
    const unit = row[idx.category]?.toString().toLowerCase() || "";
    const dept = row[idx.group]?.toString().toLowerCase() || "";

    return name.includes(s) || doctor.includes(s) || code.includes(s) || unit.includes(s) || dept.includes(s);
  });

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#007ea7]" size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      {/* רשימת הטיפולים */}
      <div className="flex flex-col gap-3">
        {filteredRows.map((row, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedRow(row)}
            className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs group-hover:bg-[#002147] group-hover:text-[#D4AF37] transition-colors">
                {row[idx.code] || '---'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-[#007ea7] bg-[#007ea7]/5 px-1.5 py-0.5 rounded">{row[idx.group] || "כללי"}</span>
                  <span className="text-[10px] font-medium text-slate-400">| {row[idx.doctor] || "צוות מומחים"}</span>
                </div>
                <h3 className="font-bold text-[#002147] text-lg leading-tight">{row[idx.name]}</h3>
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
        ))}
      </div>

      {/* הדיאלוג (Modal) */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#002147]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedRow(null)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedRow(null)} className="absolute top-5 left-5 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10">
              <X size={20} />
            </button>

            {/* כותרת הדיאלוג עם מחיר פרטי בולט למעלה */}
            <div className="bg-[#002147] p-8 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">מידע מלא למרפאה</span>
                  </div>
                  <h2 className="text-2xl font-black leading-tight">{selectedRow[idx.name]}</h2>
                </div>
                
                {/* מחיר פרטי למעלה */}
                <div className="text-left bg-white/5 p-3 rounded-2xl border border-white/10 min-w-[100px]">
                  <span className="block text-[9px] text-[#D4AF37] font-bold uppercase mb-1">מחיר פרטי</span>
                  <span className="text-2xl font-black text-white">{formatPrice(selectedRow[idx.pricePrivate])}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Building2 size={14} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold">מחלקה: {selectedRow[idx.group] || "---"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Layers size={14} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold">יחידה: {selectedRow[idx.category] || "---"}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* סקציית המקדמות */}
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl p-5 flex justify-between items-center shadow-lg text-[#002147]">
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-bold uppercase opacity-80 mb-1">מקדמה הילסון / החזר</span>
                  <span className="text-2xl font-black text-white">{formatPrice(selectedRow[idx.combinedRefund])}</span>
                </div>
                <div className="w-px h-10 bg-[#002147]/20"></div>
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-bold uppercase opacity-80 mb-1">השתתפות עצמית</span>
                  <span className="text-2xl font-black text-white">{formatPrice(selectedRow[idx.prepaidSelf])}</span>
                </div>
              </div>

              {/* קופות חולים */}
              <div>
                <h4 className="text-[#002147] font-bold text-sm mb-3 flex items-center gap-2">
                  <CreditCard size={14} /> החזרים לפי קופות:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "מאוחדת עדיף ושיא", val: selectedRow[idx.meuhedetK] },
                    { label: "כללית מושלם ופלטיניום", val: selectedRow[idx.clalit] },
                    { label: "לאומית זהב", val: selectedRow[idx.leumit] },
                    { label: "מכבי שלי", val: selectedRow[idx.maccabiSheli] },
                    { label: "מכבי כסף", val: selectedRow[idx.maccabiKesef] },
                    { label: "מכבי זהב", val: selectedRow[idx.maccabiZahav] }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{item.label}</span>
                      <span className="text-md font-bold text-[#002147]">{formatPrice(item.val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Healson Price List System • {selectedRow[idx.code]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;