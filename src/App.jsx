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

      <main className="p-2">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <ResultsTable searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;