import React, { useState } from 'react';
import FAQ from './faq';
import Auth from './Auth';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('faq');

  return (
    <div className="app-container">
      <nav className="main-nav">
        <button 
          className={currentPage === 'faq' ? 'active' : ''} 
          onClick={() => setCurrentPage('faq')}
        >
          FAQ
        </button>
        <button 
          className={currentPage === 'auth' ? 'active' : ''} 
          onClick={() => setCurrentPage('auth')}
        >
          Login / Cadastro
        </button>
      </nav>

      <main>
        {currentPage === 'faq' ? <FAQ /> : <Auth />}
      </main>
    </div>
  );
}

export default App;
