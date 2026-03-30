import React, { useState } from 'react';
import Header from './layouts/Header';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/table/ResultsTable';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Search, ChevronDown, MapPin } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("all");

  // --- סטייטים למחלקה ---
  const [selectedDept, setSelectedDept] = useState("all");
  const [availableDepts, setAvailableDepts] = useState([]);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");

  // --- סטייטים חדשים לסניף ---
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [availableBranches, setAvailableBranches] = useState([]);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') || [];

  const logAction = async (userData, action, details = "") => {
    const url = import.meta.env.VITE_LOG_SCRIPT_URL;
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          action: action,
          details: details
        })
      });
    } catch (error) { console.error(error); }
  };

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    if (allowedEmails.includes(decoded.email)) {
      setUser(decoded);
      setIsAuthenticated(true);
      logAction(decoded, "התחברות", "נכנס למערכת");
    } else {
      alert("אין הרשאה");
      googleLogout();
    }
  };

  const handleLogout = () => {
    if (user) logAction(user, "התנתקות");
    googleLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const selectStyle = "h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-[#002147] font-bold focus:outline-none focus:ring-2 shadow-sm appearance-none cursor-pointer w-full transition-all";

  // סינון רשימות לפי הקלדה
  const filteredDepts = availableDepts.filter(d => d.toLowerCase().includes(deptSearch.toLowerCase()));
  const filteredBranches = availableBranches.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header user={user} onLogout={handleLogout} />

      <main className="p-2 flex flex-col items-center">
        {!isAuthenticated ? (
          <div className="mt-20 p-10 bg-white rounded-2xl shadow-xl border border-slate-200 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">כניסה למערכת Healson</h2>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleSuccess} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl px-4">
            {/* שורת הפילטרים - גריד שמתאים את עצמו למספר האלמנטים */}
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
                  /* pr-3: מרווח קטן מימין כדי שהטקסט לא ייחתך */
                  /* pl-9: מרווח משמאל כדי להשאיר מקום לחץ */
                  className={`${selectStyle} appearance-none bg-white pr-3 pl-9 w-full text-[13px] lg:text-sm`}
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="all">כל הקופות / פרטי</option>
                  <option value="clalit">כללית מושלם</option>
                  <option value="meuhedetK">מאוחדת עדיף/שיא</option>
                  <option value="leumit">לאומית זהב</option>
                  <option value="maccabiSheli">מכבי שלי</option>
                  <option value="maccabiZahav">מכבי זהב</option>
                  <option value="maccabiKesef">מכבי כסף</option>
                </select>
              </div>
              {/* פילטר מחלקה חכם */}
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
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto py-2">
                      <li className="px-4 py-2 cursor-pointer font-bold border-b border-slate-50 hover:bg-slate-50" onClick={() => { setSelectedDept("all"); setIsDeptOpen(false); }}>כל המחלקות</li>
                      {filteredDepts.map(dept => (
                        <li key={dept} className="px-4 py-2 cursor-pointer text-sm hover:bg-[#007ea7]/5" onClick={() => { setSelectedDept(dept); setIsDeptOpen(false); }}>{dept}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* פילטר סניף חכם - חדש! */}
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
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto py-2">
                      <li className="px-4 py-2 cursor-pointer font-bold border-b border-slate-50 hover:bg-slate-50" onClick={() => { setSelectedBranch("all"); setIsBranchOpen(false); }}>כל הסניפים</li>
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
              selectedBranch={selectedBranch} // מעביר את הסניף לטבלה
              onDeptsLoaded={setAvailableDepts}
              onBranchesLoaded={setAvailableBranches} // מקבל את רשימת הסניפים מהטבלה
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