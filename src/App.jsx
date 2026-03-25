import React from 'react';
import Header from './layouts/Header';
import SearchBar from './components/SearchBar'; // ייבוא רכיב החיפוש החדש

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />
      
      {/* הוספת שורת החיפוש הכחולה והדרמטית */}
      <SearchBar />
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* אזור תוצאות החיפוש (שיוחלף בטבלה) */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-[#002147] mb-3">ברוכים הבאים למערכת הילסון</h2>
          <p className="text-gray-500 italic">המבנה והמותג מוכנים. השלב הבא: בניית הטבלה המרכזית.</p>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-400 text-xs border-t">
        © 2026 HEALSON Medical Center | ממשק עובדים פנימי | תצוגה בלבד
      </footer>
    </div>
  );
}

export default App;