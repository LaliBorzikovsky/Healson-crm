import React, { useState, useMemo, useCallback } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Search, MapPin } from 'lucide-react';

// קומפוננטות פנימיות
import Header from './layouts/Header';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/table/ResultsTable';

/**
 * קומפוננטת האב של המערכת.
 * מנהלת את מצב האימות, הפילטרים הגלובליים ותקשורת מול גוגל (Login & Sheets).
 */
function App() {
  // --- סטייטים לחיפוש וסינון ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("all");

  // --- ניהול מחלקות (Dropdown חכם) ---
  const [selectedDept, setSelectedDept] = useState("all");
  const [availableDepts, setAvailableDepts] = useState([]);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");

  // --- ניהול סניפים (Dropdown חכם) ---
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [availableBranches, setAvailableBranches] = useState([]);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  // --- ניהול אימות משתמש והמשכיות נתונים (Authentication & Persistence) ---

  /** * אתחול מצב המשתמש מה-LocalStorage.
   * מאפשר למשתמש להישאר מחובר גם לאחר רענון הדף (Session Persistence).
   */
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('healson_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /** * הגדרת מצב האימות בהתבסס על קיום אובייקט המשתמש.
   * שימוש באופרטור !! (Double NOT) להמרת ערך המשתמש לערך בוליאני (Boolean).
   */
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // רשימת אימיילים מורשים מתוך משתני הסביבה - כולל ניקוי רווחים
  const allowedEmails = useMemo(() => {
    const envEmails = import.meta.env.VITE_ALLOWED_EMAILS;
    return envEmails ? envEmails.split(',').map(email => email.trim().toLowerCase()) : [];
  }, []);

  /**
   * פונקציות עדכון יציבות למניעת לולאות אינסופיות מול ResultsTable
   */
  const handleDeptsLoaded = useCallback((depts) => {
    setAvailableDepts(depts);
  }, []);

  const handleBranchesLoaded = useCallback((branches) => {
    setAvailableBranches(branches);
  }, []);

  /**
   * שליחת לוג לפעולות משתמש
   */
  const logAction = useCallback(async (userData, action, details = "") => {
    const url = import.meta.env.VITE_LOG_SCRIPT_URL;
    if (!url || !userData) return;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          action,
          details
        })
      });
    } catch (error) {
      console.error("Logging failed:", error);
    }
  }, []);

  /**
   * טיפול בהתחברות מוצלחת דרך Google
   */
  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userEmail = decoded.email.toLowerCase().trim();

      if (allowedEmails.includes(userEmail)) {
        setUser(decoded);
        setIsAuthenticated(true);
        // שומר את פרטי המשתמש בזיכרון של המכשיר
        localStorage.setItem('healson_user', JSON.stringify(decoded));
        logAction(decoded, "התחברות", "נכנס למערכת");
      } else {
        alert(`אין לך הרשאת גישה למערכת. המייל ${userEmail} אינו מורשה.`);
        googleLogout();
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  /**
   * התנתקות מהמערכת
   */
  const handleLogout = () => {
    if (user) logAction(user, "התנתקות");
    googleLogout();
    // מוחק את פרטי המשתמש מהזיכרון של המכשיר
    localStorage.removeItem('healson_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const selectStyle = "h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-[#002147] font-bold focus:outline-none focus:ring-2 shadow-sm appearance-none cursor-pointer w-full transition-all";

  // פילטור רשימות הדרופ-דאון
  const filteredDepts = useMemo(() =>
    availableDepts.filter(d => d.toLowerCase().includes(deptSearch.toLowerCase())),
    [availableDepts, deptSearch]
  );

  const filteredBranches = useMemo(() =>
    availableBranches.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase())),
    [availableBranches, branchSearch]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header user={user} onLogout={handleLogout} />

      <main className="p-2 flex flex-col items-center">
        {!isAuthenticated ? (
          <div className="mt-20 p-10 bg-white rounded-2xl shadow-xl border border-slate-200 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">כניסה למערכת Healson</h2>
            <p className="text-slate-500 mb-6 text-sm">אנא התחבר עם אימייל מורשה כדי להמשיך</p>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl px-4">

            {/* שורת פילטרים */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 mb-6 w-full">

              {/* חיפוש חופשי */}
              <div className="lg:col-span-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>

              {/* קופת חולים */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className={`${selectStyle} pr-3 pl-9 text-[13px] lg:text-sm`}
                >
                  <option value="all">כל הקופות / פרטי</option>
                  <option value="clalit">כללית מושלם ופלטיניום</option>
                  <option value="meuhedetAdif">מאוחדת עדיף</option>
                  <option value="meuhedetSia">מאוחדת שיא</option>
                  <option value="leumit">לאומית זהב</option>
                  <option value="maccabiSheli">מכבי שלי</option>
                  <option value="maccabiZahav">מכבי זהב</option>
                  <option value="maccabiKesef">מכבי כסף</option>
                </select>
              </div>

              {/* פילטר מחלקה */}
              <div className="lg:col-span-3 relative">
                <div className="relative group">
                  <input
                    type="text"
                    className={`${selectStyle} focus:ring-[#007ea7] pr-10`}
                    placeholder={selectedDept === "all" ? "חפש מחלקה..." : selectedDept}
                    value={isDeptOpen ? deptSearch : (selectedDept === "all" ? "" : selectedDept)}
                    onFocus={() => { setIsDeptOpen(true); setDeptSearch(""); }}
                    onChange={(e) => setDeptSearch(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                {isDeptOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDeptOpen(false)}></div>
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto py-2 text-right">
                      <li className="px-4 py-2 cursor-pointer font-bold border-b border-slate-50 hover:bg-slate-50 text-[#007ea7]" onClick={() => { setSelectedDept("all"); setIsDeptOpen(false); }}>כל המחלקות</li>
                      {filteredDepts.map(dept => (
                        <li key={dept} className="px-4 py-2 cursor-pointer text-sm hover:bg-[#007ea7]/5" onClick={() => { setSelectedDept(dept); setIsDeptOpen(false); }}>{dept}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* פילטר סניף */}
              <div className="lg:col-span-3 relative">
                <div className="relative group">
                  <input
                    type="text"
                    className={`${selectStyle} focus:ring-[#D4AF37] pr-10`}
                    placeholder={selectedBranch === "all" ? "חפש סניף..." : selectedBranch}
                    value={isBranchOpen ? branchSearch : (selectedBranch === "all" ? "" : selectedBranch)}
                    onFocus={() => { setIsBranchOpen(true); setBranchSearch(""); }}
                    onChange={(e) => setBranchSearch(e.target.value)}
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                {isBranchOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsBranchOpen(false)}></div>
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto py-2 text-right">
                      <li className="px-4 py-2 cursor-pointer font-bold border-b border-slate-50 hover:bg-slate-50 text-[#D4AF37]" onClick={() => { setSelectedBranch("all"); setIsBranchOpen(false); }}>כל הסניפים</li>
                      {filteredBranches.map(branch => (
                        <li key={branch} className="px-4 py-2 cursor-pointer text-sm hover:bg-[#D4AF37]/5" onClick={() => { setSelectedBranch(branch); setIsBranchOpen(false); }}>{branch}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <ResultsTable
              searchTerm={searchTerm}
              selectedInsurance={selectedInsurance}
              selectedDept={selectedDept}
              selectedBranch={selectedBranch}
              onDeptsLoaded={handleDeptsLoaded}
              onBranchesLoaded={handleBranchesLoaded}
              isAuthenticated={isAuthenticated}
              user={user}
              logAction={logAction}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;