import React, { useState } from 'react';
import FAQ from './faq';
import Auth from './Auth';
import Profile from './Profile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('faq');
  const [user, setUser] = useState(null); // Estado do usuário logado

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('faq'); // Redireciona para o FAQ após login
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('faq');
  };

  return (
    <div className="app-container">
      <nav className="main-nav">
        <button 
          className={currentPage === 'faq' ? 'active' : ''} 
          onClick={() => setCurrentPage('faq')}
        >
          FAQ
        </button>
        
        {user ? (
          <>
            <button 
              className={currentPage === 'profile' ? 'active' : ''} 
              onClick={() => setCurrentPage('profile')}
            >
              Perfil ({user.username})
            </button>
            <button className="logout-nav" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <button 
            className={currentPage === 'auth' ? 'active' : ''} 
            onClick={() => setCurrentPage('auth')}
          >
            Login / Cadastro
          </button>
        )}
      </nav>

      <main>
        {currentPage === 'faq' && <FAQ />}
        {currentPage === 'auth' && !user && <Auth onAuthSuccess={handleAuthSuccess} />}
        {currentPage === 'profile' && user && (
          <Profile 
            user={user} 
            onUpdate={handleUpdateUser} 
            onLogout={handleLogout} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
