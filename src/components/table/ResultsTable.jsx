import React, { useState, useEffect } from 'react';
import { Loader2, UserRound, X, ChevronLeft, CreditCard, ShieldCheck, Building2, Layers, Banknote } from 'lucide-react';

// 1. הוספנו את isAuthenticated כ-Prop
const ResultsTable = ({ searchTerm = "", isAuthenticated }) => {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 2. הגנה: אם המשתמש לא מחובר, אל תבצע קריאה לשרת
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const apiKey = import.meta.env.VITE_API_KEY;
      const sheetId = import.meta.env.VITE_SHEET_ID;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/data!A1:AZ2000?key=${apiKey}`;
      
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.values) {
          setData({ headers: result.values[0], rows: result.values.slice(1) });
        }
      } catch (e) { 
        console.error("Error fetching data"); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchData();
  }, [isAuthenticated]); // ה-useEffect ירוץ מחדש ברגע שהסטטוס ישתנה ל-true

  // אם לא מחובר - לא מציגים כלום (ליתר ביטחון)
  if (!isAuthenticated) return null;

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#007ea7]" size={40} /></div>;

  // ... שאר הקוד של הרינדור (ה-return עם הטבלה) נשאר בדיוק אותו דבר ...
  const getCol = (name) => data.headers ? data.headers.findIndex(h => h && h.trim() === name) : -1;

  const idx = {
    code: getCol("קוד פריט"),
    name: getCol("שם פריט"),
    doctor: getCol("צוות"),
    category: getCol("קטגורית פריט"),
    group: getCol("קבוצת יומן"),
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
    return name.includes(s) || doctor.includes(s) || code.includes(s);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
        {/* הקוד של הטבלה והמודל שהיה לך קודם... */}
        <div className="flex flex-col gap-3">
          {filteredRows.map((row, index) => (
             <div key={index} onClick={() => setSelectedRow(row)} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-[#D4AF37] cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs group-hover:bg-[#002147] group-hover:text-[#D4AF37]">
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
                   <ChevronLeft size={18} className="text-slate-300 group-hover:text-[#D4AF37]" />
                </div>
             </div>
          ))}
        </div>

        {/* מודל הפרטים (המדרגות, המחירים וכו') נשאר כפי שהיה */}
        {selectedRow && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#002147]/60 backdrop-blur-sm" onClick={() => setSelectedRow(null)}></div>
              <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">
                 {/* ... שאר תוכן המודל ... */}
                 <button onClick={() => setSelectedRow(null)} className="absolute top-5 left-5 p-2 bg-slate-100 rounded-full z-10"><X size={20} /></button>
                 <div className="bg-[#002147] p-8 text-white">
                    <h2 className="text-2xl font-black">{selectedRow[idx.name]}</h2>
                 </div>
                 <div className="p-6">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl p-5 flex justify-between items-center text-[#002147]">
                       <div className="text-center flex-1">
                          <span className="block text-[10px] font-bold">מקדמה הילסון</span>
                          <span className="text-2xl font-black text-white">{formatPrice(selectedRow[idx.combinedRefund])}</span>
                       </div>
                       <div className="text-center flex-1 border-r border-[#002147]/20">
                          <span className="block text-[10px] font-bold">השתתפות עצמית</span>
                          <span className="text-2xl font-black text-white">{formatPrice(selectedRow[idx.prepaidSelf])}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
    </div>
  );
};

export default ResultsTable;