import React, { useState } from 'react';
import './Dashboard.css';

const AddFaqModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        pergunta: '',
        descricao: '',
        solucao: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content profile-card">
                <header className="profile-header">
                    <h2 className="title">Nova Pergunta</h2>
                    <p className="subtitle">Cadastre uma nova dúvida no FAQ</p>
                </header>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="pergunta">Pergunta</label>
                        <input
                            type="text"
                            id="pergunta"
                            name="pergunta"
                            value={formData.pergunta}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Como resetar minha senha?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descricao">Descrição (Opcional)</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Breve descrição sobre a dúvida"
                            rows="3"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0d4a8333', outline: 'none' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="solucao">Solução / Resposta</label>
                        <textarea
                            id="solucao"
                            name="solucao"
                            value={formData.solucao}
                            onChange={handleChange}
                            required
                            placeholder="Passo a passo da solução"
                            rows="5"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0d4a8333', outline: 'none' }}
                        />
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="profile-button save">
                            Salvar FAQ
                        </button>
                        <button type="button" className="profile-button cancel" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFaqModal;
