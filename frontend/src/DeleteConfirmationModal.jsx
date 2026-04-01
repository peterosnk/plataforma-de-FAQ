import React from 'react';
import './Dashboard.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-card delete-modal">
        <header className="profile-header">
          <div className="delete-icon-container">
            <i className="fas fa-exclamation-triangle warning-icon"></i>
          </div>
          <h2 className="title">{title || 'Confirmar Exclusão'}</h2>
          <p className="subtitle">{message || 'Tem certeza que deseja excluir este item?'}</p>
        </header>

        <div className="profile-actions delete-actions">
          <button 
            type="button" 
            className="profile-button cancel" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="profile-button delete-confirm" 
            onClick={onConfirm}
          >
            Excluir permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
