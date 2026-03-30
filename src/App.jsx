import React, { useState } from 'react';
import Header from './layouts/Header';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/table/ResultsTable';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') || [];

  // --- הפונקציה החדשה לרישום באקסל ---
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
    } catch (error) {
      console.error("Failed to log action:", error);
    }
  };
  // ----------------------------------

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userEmail = decoded.email;

    if (allowedEmails.includes(userEmail)) {
      setUser(decoded);
      setIsAuthenticated(true);
      
      // כאן אנחנו קוראים לפונקציה מיד אחרי הלוגין המוצלח
      logAction(decoded, "התחברות", "נכנס למערכת המחירון");
      
    } else {
      alert("מצטערים, אין לך הרשאה.");
      googleLogout();
    }
  };

  const handleLogout = () => {
    // אופציונלי: אפשר לתעד גם התנתקות
    if (user) logAction(user, "התנתקות", "יצא מהמערכת");
    
    googleLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header user={user} onLogout={handleLogout} />

      <main className="p-2 flex flex-col items-center">
        {!isAuthenticated ? (
          <div className="mt-20 p-10 bg-white rounded-2xl shadow-xl border border-slate-200 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">כניסה למערכת Healson</h2>
            <p className="text-slate-500 mb-8">הגישה למורשים בלבד</p>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ResultsTable searchTerm={searchTerm} isAuthenticated={isAuthenticated} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;