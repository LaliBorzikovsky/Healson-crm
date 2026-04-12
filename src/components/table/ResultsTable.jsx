import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import TreatmentRow from './TreatmentRow';
import TreatmentModal from './TreatmentModal';
import Fuse from 'fuse.js';

/**
 * קומפוננטת טבלת התוצאות הראשית.
 * מנהלת את משיכת הנתונים מ-Google Sheets, סינון התוצאות ותצוגת השורות.
 */
const ResultsTable = ({
  searchTerm = "",
  selectedInsurance = "all",
  selectedDept = "all",
  selectedBranch = "all",
  user,
  logAction,
  onDeptsLoaded,
  onBranchesLoaded
}) => {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // פונקציית עזר לאיתור אינדקס עמודה לפי שם
  const getCol = (name) => data.headers ? data.headers.findIndex(h => h && h.trim() === name) : -1;

  // מיפוי אינדקסים של עמודות הנתונים
  const idx = useMemo(() => ({
    code: getCol("קוד פריט"),
    name: getCol("שם פריט"),
    doctor: getCol("צוות"),
    category: getCol("קטגורית פריט"),
    group: getCol("קבוצת יומן"),
    pricePrivate: getCol("מחיר (פרטי)"),
    combinedRefund: getCol("מקדמה הילסון החזר ופרטי"),
    prepaidSelf: getCol("מקדמה השתתפות עצמית"),
    meuhedetAdif: getCol("מאוחדת עדיף"),
    meuhedetSia: getCol("מאוחדת שיא"),
    clalit: getCol("כללית מושלם ופלטיניום"),
    leumit: getCol("לאומית זהב"),
    maccabiSheli: getCol("מכבי שלי"),
    maccabiKesef: getCol("מכבי כסף"),
    maccabiZahav: getCol("מכבי זהב"),
    branch: getCol("סניף")
  }), [data.headers]);

  // משיכת נתונים מ-Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const sheetId = import.meta.env.VITE_SHEET_ID;

      if (!apiKey || !sheetId) {
        setError("חסרים משתני סביבה (API Key או Sheet ID)");
        setLoading(false);
        return;
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/data!A1:AZ2000?key=${apiKey}`;

      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("נכשל בחיבור לשרת הנתונים (ודא שה-API Key וה-Sheet ID תקינים)");

        const result = await response.json();

        if (result.values) {
          const headers = result.values[0];
          const rows = result.values.slice(1);
          setData({ headers, rows });

          // שליחת רשימת המחלקות הייחודיות ל-App
          if (onDeptsLoaded) {
            const groupIdx = headers.findIndex(h => h && h.trim() === "קבוצת יומן");
            if (groupIdx !== -1) {
              const uniqueDepts = [...new Set(rows.map(r => r[groupIdx]?.toString().trim()))]
                .filter(d => d && d !== "" && d !== "0")
                .sort();
              onDeptsLoaded(uniqueDepts);
            }
          }

          // שליחת רשימת הסניפים הייחודיים ל-App
          if (onBranchesLoaded) {
            const branchIdx = headers.findIndex(h => h && h.trim() === "סניף");
            if (branchIdx !== -1) {
              const uniqueBranches = [...new Set(rows.map(r => r[branchIdx]?.toString().trim()))]
                .filter(b => b && b !== "" && b !== "0")
                .sort();
              onBranchesLoaded(uniqueBranches);
            }
          }
        }
      } catch (e) {
        setError(e.message);
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onDeptsLoaded, onBranchesLoaded]);

  // פונקציית עזר לעיצוב מחיר
  const formatPrice = (val) => {
    if (!val || ["0", "", "---"].includes(val.toString().trim())) return "---";
    const cleanVal = val.toString().replace('₪', '').trim();
    return `₪${cleanVal}`;
  };

  // לוגיקת סינון הנתונים
  /**
   * מערכת סינון ודירוג נתונים מתקדמת
   * --------------------------------
   * הלוגיקה פועלת בשני שלבים:
   * שלב 1 (סינון קשיח): סינון אבסולוטי לפי בחירות המשתמש (קופה, מחלקה, סניף).
   * שלב 2 (סינון גמיש): חיפוש טקסטואלי חכם המאפשר טעויות כתיב ומדרג תוצאות לפי רלוונטיות.
   */
  const filteredRows = useMemo(() => {

    // --- שלב א': סינון מוקדם (Pre-filtering) ---
    // סינון זה מתבצע על כל שורות הנתונים ומחזיר רק את אלו שעומדים בתנאי הסף
    let results = data.rows.filter(row => {

      // 1. בדיקת התאמה לקופת חולים:
      // מוודא שיש ערך תקין (מחיר/הסדר) בעמודה של הקופה שנבחרה
      let matchesInsurance = true;
      if (selectedInsurance !== "all") {
        const val = row[idx[selectedInsurance]];
        matchesInsurance = val && !["", "0", "---"].includes(val.toString().trim());
      }

      // 2. בדיקת התאמה למחלקה (קבוצת יומן):
      const matchesDept = selectedDept === "all" ||
        row[idx.group]?.toString().trim() === selectedDept;

      // 3. בדיקת התאמה לסניף:
      const matchesBranch = selectedBranch === "all" ||
        row[idx.branch]?.toString().trim() === selectedBranch;

      // רק שורה שעומדת בכל שלושת התנאים עוברת לשלב החיפוש
      return matchesInsurance && matchesDept && matchesBranch;
    });

    // --- שלב ב': מנוע חיפוש חכם (Fuzzy Search Engine) ---
    const s = searchTerm.toLowerCase().trim();

    if (s) {
      // הגדרות מנוע החיפוש Fuse.js
      const fuseOptions = {
        // מפתחות החיפוש עם משקלים (Weight): ככל שהמשקל גבוה יותר, השדה משפיע יותר על הדירוג
        keys: [
          { name: 'doctor', weight: 2.0 },   // שם הרופא/צוות - עדיפות עליונה
          { name: 'name', weight: 0.8 },     // שם הטיפול/פריט
          { name: 'code', weight: 0.4 },     // קוד פריט
          { name: 'group', weight: 1.2 },    // קבוצת יומן
          { name: 'branch', weight: 0.2 }    // סניף
        ],
        // threshold (סף רגישות): 0.35 מאפשר גמישות לטעויות כתיב קלות (כמו י' חסרה/מיותרת)
        // מבלי להציג תוצאות לא רלוונטיות לחלוטין.
        threshold: 0.35,

        // distance: טווח הסטייה המקסימלי מהמילה המקורית
        distance: 100,

        // shouldSort: מבטיח שהתוצאה המדויקת ביותר תופיע תמיד בראש הרשימה
        shouldSort: true,

        // getFn: מחלץ את המידע מהמבנה הנתונים (מערך) לפי האינדקסים הדינמיים (idx)
        getFn: (row, key) => row[idx[key]]
      };

      // אתחול המנוע על התוצאות שסוננו בשלב א'
      const fuse = new Fuse(results, fuseOptions);
      const fuseResults = fuse.search(s);

      // החזרת האובייקטים (השורות) בלבד מתוך תוצאות החיפוש
      return fuseResults.map(res => res.item);
    }

    // במידה ולא הוזן טקסט לחיפוש, מוצגות כל התוצאות שעברו את שלב א' בסדר המקורי שלהן
    return results;

  }, [data.rows, searchTerm, selectedInsurance, selectedDept, selectedBranch, idx]);

  /**
 * מטפל בבחירת שורה בטבלה ושליחת לוג לשרת.
 * @param {Array|Object} row - נתוני השורה שנבחרה מהטבלה.
 */
  console.log("DEBUG User:", user);
  /**
 * handleSelectRow - מטפל בלחיצה על שורה ושליחת הנתונים לתיעוד.
 * @param {Array} row - מערך נתוני השורה מהגיליון.
 */
const handleSelectRow = (row) => {
  setSelectedRow(row); 

  if (logAction && user) {
    logAction(user, "צפייה בטיפול", {
      itemCode: row[0], 
      itemName: row[1],
      doctorName: row[2]
    });
  }
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-[#007ea7]" size={40} />
      <p className="text-slate-500 font-medium">טוען נתונים מהמערכת...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-20 text-red-500 gap-2 text-center">
      <AlertCircle size={40} />
      <p className="font-bold">שגיאה בטעינת הנתונים</p>
      <p className="text-sm max-w-md">{error}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      <div className="flex flex-col gap-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((row, index) => (
            <TreatmentRow
              key={`${row[idx.code]}-${index}`}
              row={row}
              idx={idx}
              formatPrice={formatPrice}
              onSelect={handleSelectRow}
              selectedInsurance={selectedInsurance} // שים לב: ה-Prop הזה נוסף עכשיו!
            />
          ))
        ) : (
          <div className="text-center p-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-medium italic">לא נמצאו תוצאות התואמות את החיפוש והסינון שלך.</p>
          </div>
        )}
      </div>

      <TreatmentModal
        row={selectedRow}
        idx={idx}
        formatPrice={formatPrice}
        onClose={() => setSelectedRow(null)}
        selectedInsurance={selectedInsurance}
      />
    </div>
  );
};

export default ResultsTable;