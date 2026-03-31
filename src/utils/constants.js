export const COLORS = {
  NAVY: '#002147',      // צבע לוגו הילסון
  GOLD: '#D4AF37',      // צבע זהב מיתוגי
  LIGHT_BLUE: '#007ea7', // כחול משני
  WHITE: '#FFFFFF',
  GRAY_BG: '#F8FAFC',
  SLATE_TEXT: '#475569'
};

export const COLUMNS = {
  ID: 'קוד פריט',
  NAME: 'שם פריט',
  TEAM: 'צוות',
  DEPT: 'קבוצת יומן', // שיניתי מ"מחלקה" ל"קבוצת יומן" כדי שיתאים לגליון
  CATEGORY: 'קטגורית פריט',
  BRANCH: 'סניף',
  PRIVATE_PRICE: 'מחיר (פרטי)',
  
  // מיפוי מדויק של קופות החולים כפי שהן מופיעות ב-Header ובגליון
  HMO: {
    clalit: 'כללית מושלם ופלטיניום',
    meuhedetAdif: 'מאוחדת עדיף',
    meuhedetSia: 'מאוחדת שיא',
    leumit: 'לאומית זהב',
    maccabiSheli: 'מכבי שלי',
    maccabiKesef: 'מכבי כסף',
    maccabiZahav: 'מכבי זהב'
  }
};

// אופציונלי: רשימת הקופות לתצוגה ב-Select
export const HMO_OPTIONS = [
  { id: 'all', label: 'כל הקופות / פרטי' },
  { id: 'clalit', label: 'כללית מושלם' },
  { id: 'maccabiSheli', label: 'מכבי שלי' },
  { id: 'maccabiZahav', label: 'מכבי זהב' },
  { id: 'maccabiKesef', label: 'מכבי כסף' },
  { id: 'meuhedetAdif', label: 'מאוחדת עדיף' },
  { id: 'meuhedetSia', label: 'מאוחדת שיא' },
  { id: 'leumit', label: 'לאומית זהב' },
];