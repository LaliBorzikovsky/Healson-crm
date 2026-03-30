import React, { useState } from 'react';
import Header from './layouts/Header';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/table/ResultsTable';

function App() {
  // יצירת הסטייט שיחזיק את מה שהמשתמש מקליד
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />
      
      {/* מעבירים לחיפוש את הפונקציה שמעדכנת את הסטייט */}
      <SearchBar onSearch={setSearchTerm} />
      
      <main className="p-2">
        {/* מעבירים לטבלה את הערך הנוכחי לסינון */}
        <ResultsTable searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;