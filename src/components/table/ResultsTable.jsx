import React, { useState, useEffect } from 'react';
import { Loader2, ChevronDown, UserRound, Sparkles, Receipt } from 'lucide-react';

const ResultsTable = ({ searchTerm = "" }) => {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

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

  const getCol = (name) => {
    if (!data.headers) return -1;
    return data.headers.findIndex(h => h && h.trim() === name);
  };

  // מיפוי עמודות מדויק לפי הקובץ "ניסיון אפליקציה חיפוש"
  const idx = {
    code: getCol("קוד פריט"), // עודכן מ"קוד" ל"קוד פריט" לפי האקסל
    name: getCol("שם פריט"),
    doctor: getCol("צוות"),
    pricePrivate: getCol("מחיר (פרטי)"),
    combinedRefund: getCol("מקדמה הילסון החזר ופרטי"), 
    prepaidSelf: getCol("מקדמה השתתפות עצמית"),
    // קופות - שאיבה מהשמות המדויקים באקסל
    meuhedetK: getCol("k מאוחדת עדיף ושיא"),
    clalit: getCol("כללית מושלם ופלטיניום"), // השם המדויק באקסל (בלי k)
    leumit: getCol("לאומית זהב"),
    maccabiSheli: getCol("מכבי שלי"),
    maccabiKesef: getCol("מכבי כסף"),
    maccabiZahav: getCol("מכבי זהב")
  };

  const filteredRows = data.rows.filter(row => {
    if (!row) return false;
    const s = searchTerm.toLowerCase();
    const name = row[idx.name]?.toString().toLowerCase() || "";
    const doctor = row[idx.doctor]?.toString().toLowerCase() || "";
    return !searchTerm || name.includes(s) || doctor.includes(s);
  });

  const formatPrice = (row, i) => {
    if (i === -1 || !row || !row[i] || row[i] === "0" || row[i] === "") return "---";
    // אם כבר יש סימן ₪ בנתונים, נציג כפי שהוא, אחרת נוסיף
    return row[i].toString().includes('₪') ? row[i] : `₪${row[i]}`;
  };

  if (loading) return <div className="flex justify-center p-32"><Loader2 className="animate-spin text-[#007ea7]" size={50} /></div>;

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-10" dir="rtl">
      <div className="flex flex-col gap-6">
        {filteredRows.map((row, index) => (
          <div key={index} className={`group rounded-[35px] transition-all border-2 overflow-hidden shadow-xl ${expandedRow === index ? 'bg-[#002147] border-[#D4AF37] scale-[1.01]' : 'bg-white border-slate-50'}`}>
            
            <div onClick={() => setExpandedRow(expandedRow === index ? null : index)} className="p-8 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${expandedRow === index ? 'bg-[#D4AF37] text-[#002147]' : 'bg-slate-100 text-slate-400'}`}>
                  {row[idx.code] || '---'}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <UserRound size={16} className={expandedRow === index ? "text-[#D4AF37]" : "text-[#007ea7]"} />
                    <span className={`font-bold ${expandedRow === index ? 'text-[#D4AF37]' : 'text-[#007ea7]'}`}>{row[idx.doctor] || "צוות מומחים"}</span>
                  </div>
                  <h3 className={`font-black text-2xl ${expandedRow === index ? 'text-white' : 'text-[#002147]'}`}>{row[idx.name]}</h3>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-left">
                  <span className="block text-[10px] font-black opacity-50 uppercase">מחיר פרטי</span>
                  <div className={`text-4xl font-black italic ${expandedRow === index ? 'text-white' : 'text-[#002147]'}`}>
                    {formatPrice(row, idx.pricePrivate)}
                  </div>
                </div>
                <ChevronDown className={`transition-all ${expandedRow === index ? 'rotate-180 text-[#D4AF37]' : 'text-slate-300'}`} size={24} />
              </div>
            </div>

            {expandedRow === index && (
              <div className="p-10 bg-white/5 border-t border-white/10 text-white animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  
                  {/* כרטיס מקדמה הילסון החזר ופרטי */}
                  <div className="md:col-span-2 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-8 rounded-[30px] shadow-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-[#002147]">
                      <Receipt size={24} />
                      <span className="text-[11px] font-black uppercase tracking-tighter">מקדמה הילסון החזר ופרטי</span>
                    </div>
                    <span className="text-5xl font-black drop-shadow-md">
                      {formatPrice(row, idx.combinedRefund)}
                    </span>
                  </div>

                  {/* השתתפות עצמית */}
                  <div className="bg-[#007ea7] p-6 rounded-[30px] flex flex-col justify-center border border-white/10">
                    <span className="text-[10px] font-black text-white/60 uppercase mb-2">השתתפות עצמית</span>
                    <span className="text-3xl font-black">{formatPrice(row, idx.prepaidSelf)}</span>
                  </div>

                  {/* קופות - עכשיו כולל את כללית מושלם ופלטיניום */}
                  {[
                    { label: "מאוחדת עדיף ושיא", col: idx.meuhedetK },
                    { label: "כללית מושלם ופלטיניום", col: idx.clalit },
                    { label: "לאומית זהב", col: idx.leumit },
                    { label: "מכבי שלי", col: idx.maccabiSheli },
                    { label: "מכבי כסף", col: idx.maccabiKesef },
                    { label: "מכבי זהב", col: idx.maccabiZahav }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 p-5 rounded-[25px] border border-white/10 hover:bg-white/20 transition-all flex flex-col justify-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 leading-tight">{item.label}</span>
                      <span className="text-xl font-bold italic">{formatPrice(row, item.col)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsTable;