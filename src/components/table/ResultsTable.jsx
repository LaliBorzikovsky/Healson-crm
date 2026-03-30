import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import TreatmentRow from './TreatmentRow';
import TreatmentModal from './TreatmentModal';

const ResultsTable = ({
  searchTerm = "",
  selectedInsurance = "all",
  selectedDept = "all",
  selectedBranch = "all",
  isAuthenticated,
  user,
  logAction,
  onDeptsLoaded,
  onBranchesLoaded
}) => {
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
          const headers = result.values[0];
          const rows = result.values.slice(1);
          setData({ headers, rows });

          // 1. חילוץ מחלקות
          if (onDeptsLoaded) {
            const groupIdx = headers.findIndex(h => h && h.trim() === "קבוצת יומן");
            if (groupIdx !== -1) {
              const uniqueDepts = [...new Set(rows.map(r => r[groupIdx]?.toString().trim()))]
                .filter(d => d && d !== "" && d !== "0")
                .sort();
              onDeptsLoaded(uniqueDepts);
            }
          }

          // 2. חילוץ סניפים
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
        console.error("Error fetching data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // הוספת הפונקציות ל-Dependencies כדי למנוע אזהרות
  }, [onDeptsLoaded, onBranchesLoaded]);

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
    meuhedetK: getCol("מאוחדת עדיף ושיא"),
    clalit: getCol("כללית מושלם ופלטיניום"),
    leumit: getCol("לאומית זהב"),
    maccabiSheli: getCol("מכבי שלי"),
    maccabiKesef: getCol("מכבי כסף"),
    maccabiZahav: getCol("מכבי זהב"),
    branch: getCol("סניף")
  };

  const formatPrice = (val) => {
    if (!val || val === "0" || val === "" || val === "---") return "---";
    return val.toString().includes('₪') ? val : `₪${val}`;
  };

  const filteredRows = data.rows.filter(row => {
    const s = searchTerm.toLowerCase().trim();
    const name = row[idx.name]?.toString().toLowerCase() || "";
    const doctor = row[idx.doctor]?.toString().toLowerCase() || "";
    const code = row[idx.code]?.toString().toLowerCase() || "";
    const dept = row[idx.group]?.toString().toLowerCase() || "";
    const branch = row[idx.branch]?.toString().toLowerCase() || "";

    // 1. סינון חיפוש חופשי - הוספתי גם את branch כאן
    const matchesSearch = !s || [name, doctor, code, dept, branch].some(field => field.includes(s));

    // 2. סינון קופת חולים
    let matchesInsurance = true;
    if (selectedInsurance !== "all") {
      const val = row[idx[selectedInsurance]];
      matchesInsurance = val && !["", "0", "---"].includes(val.toString().trim());
    }

    // 3. סינון מחלקה
    let matchesDept = true;
    if (selectedDept !== "all") {
      matchesDept = row[idx.group]?.toString().trim() === selectedDept;
    }

    // 4. סינון סניף
    let matchesBranch = true;
    if (selectedBranch !== "all") {
      matchesBranch = row[idx.branch]?.toString().trim() === selectedBranch;
    }

    return matchesSearch && matchesInsurance && matchesDept && matchesBranch;
  });

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    if (logAction && user) {
      logAction(user, "צפייה בטיפול", row[idx.name]);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-[#007ea7]" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      <div className="flex flex-col gap-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((row, index) => (
            <TreatmentRow
              key={index}
              row={row}
              idx={idx}
              formatPrice={formatPrice}
              onSelect={handleSelectRow}
            />
          ))
        ) : (
          <div className="text-center p-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-medium">לא נמצאו תוצאות התואמות את הסינון.</p>
          </div>
        )}
      </div>

      <TreatmentModal
        row={selectedRow}
        idx={idx}
        formatPrice={formatPrice}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
};

export default ResultsTable;