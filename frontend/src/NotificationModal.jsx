import React from 'react';
import './Dashboard.css';
/*Mensagem que foi Adicionado com Sucesso*/
const NotificationModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-card notification-modal">
        <header className="profile-header">
          <div className={`notification-icon-container ${type}-bg`}>
            {isSuccess ? (
              <i className="fas fa-check-circle success-icon"></i>
            ) : (
              <i className="fas fa-times-circle error-icon"></i>
            )}
          </div>
          <h2 className="title">{title || (isSuccess ? 'Sucesso!' : 'Erro')}</h2>
          <p className="subtitle">{message}</p>
        </header>

        <div className="profile-actions notification-actions">
          <button 
            type="button" 
            className={`profile-button ${isSuccess ? 'save' : 'delete-confirm'}`} 
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
