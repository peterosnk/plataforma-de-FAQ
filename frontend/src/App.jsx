import React, { useState, useEffect } from 'react';
import FAQ from './faq';
import Auth from './Auth';
import Profile from './Profile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('faq');
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          onClick={() => {
            if (user) {
              setCurrentPage('faq');
            }
            else {
              alert("Faça login para acessar o FAQ.");
            }
          }}
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
        {currentPage === 'faq' && user && <FAQ />}
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