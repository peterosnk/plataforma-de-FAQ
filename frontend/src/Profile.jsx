import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onUpdate, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: user.password
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://10.0.0.161:8000/api/users/update/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: user.is_staff ? 'Administrador' : 'Visitante'
                })
            });

            if (response.ok) {
                onUpdate(formData);
                setIsEditing(false);
                setMessage('Informações atualizadas com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const data = await response.json();
                setMessage(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error('Erro ao atualizar perfil:', err);
            setMessage('Erro de conexão com o servidor');
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user.username,
            email: user.email,
            password: user.password
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <header className="profile-header">
                    <h2 className="title">Perfil do Usuário</h2>
                    <p className="subtitle">Gerencie suas informações pessoais</p>
                </header>

                <div className="profile-form">
                    <div className="form-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type={isEditing ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button 
                                className="profile-button edit" 
                                onClick={() => setIsEditing(true)}
                            >
                                Editar Perfil
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="profile-button save" 
                                    onClick={handleSave}
                                >
                                    Salvar Alterações
                                </button>
                                <button 
                                    className="profile-button cancel" 
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>

                    {message && <p className="success-message">{message}</p>}

                    <button 
                        className="profile-button logout" 
                        onClick={onLogout}
                    >
                        Sair da Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
