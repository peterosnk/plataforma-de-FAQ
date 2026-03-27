import React, { useState } from 'react';
import './Dashboard.css';

const EditUserModal = ({ user, onClose, onSave }) => {
    // Se não houver 'user', estamos no modo de criação
    const isCreation = !user;

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '', // Sempre começa vazio
        role: user?.is_staff ? 'Administrador' : 'Visitante'
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
        // Na criação passamos null como ID
        onSave(user?.id || null, formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content profile-card">
                <header className="profile-header">
                    <h2 className="title">{isCreation ? 'Novo Usuário' : 'Editar Usuário'}</h2>
                    <p className="subtitle">
                        {isCreation ? 'Cadastre um novo membro no sistema' : 'Alterar informações e permissões'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Ex: joaosilva"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Ex: joao@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            {isCreation ? 'Senha' : 'Nova Senha (deixe em branco para manter)'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={isCreation}
                            placeholder={isCreation ? "Defina uma senha" : "Opcional"}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Cargo / Permissão</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="role-select"
                        >
                            <option value="Visitante">Visitante</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="profile-button save">
                            {isCreation ? 'Criar Usuário' : 'Salvar Alterações'}
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

export default EditUserModal;
