import React, { useState, useEffect } from 'react';
import FAQ from './faq';
import Auth from './Auth';
import Profile from './Profile';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('faq');
  const [user, setUser] = useState(null); // Estado do usuário logado
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Lógica para esconder a navbar ao descer e mostrar ao subir
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) { // Descendo
        setShowNav(false);
      } else { // Subindo
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <div className="app-container">
      <nav className={`main-nav ${!showNav ? 'nav-hidden' : ''}`}>
        <button 
          className={currentPage === 'faq' ? 'active' : ''} 
          onClick={() => setCurrentPage('faq')}
        >
          FAQ
        </button>
        
        <button 
          className={currentPage === 'dashboard' ? 'active' : ''} 
          onClick={() => setCurrentPage('dashboard')}
        >
          Dashboard
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
        {currentPage === 'dashboard' && <Dashboard />}
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
