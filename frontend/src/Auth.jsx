import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleAuth = () => {
        setIsSignIn(!isSignIn);
        setError('');
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const url = isSignIn 
            ? 'http://localhost:8000/api/login/' 
            : 'http://localhost:8000/api/register/';

        if (!isSignIn && formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(isSignIn ? {
                    email: formData.email,
                    password: formData.password
                } : {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                onAuthSuccess(data);
            } else {
                setError(data.error || 'Ocorreu um erro na autenticação');
            }
        } catch (err) {
            console.error('Erro na autenticação:', err);
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className={`container ${!isSignIn ? 'sign-up-active' : ''}`}>
                <div className="content">
                    {/* Login (Sign In) */}
                    {isSignIn ? (
                        <div className="first-content">
                            <div className="first-collum">
                                <h2 className="title title-primary">Não tem uma conta?</h2>
                                <p className="description">Crie uma conta para acessar a plataforma</p>
                                <p className="description">e aproveitar todos os recursos</p>
                                <button className="button button-primary" onClick={toggleAuth}>Criar Conta</button>
                            </div>
                            <div className="second-collum">
                                <h2 className="title title-secondary">Fazer Login</h2>
                                {error && <p className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
                                <p className="description">Preencha os campos abaixo para fazer login</p>
                                <form className="form" onSubmit={handleSubmit}>
                                    <input 
                                        type="email" 
                                        name="email"
                                        placeholder="Email" 
                                        className="input" 
                                        required 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <input 
                                        type="password" 
                                        name="password"
                                        placeholder="Senha" 
                                        className="input" 
                                        required 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <a href="#" className="forgot-password">Esqueci minha senha</a>
                                    <button type="submit" className="button" disabled={loading}>
                                        {loading ? 'Carregando...' : 'Fazer Login'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* Cadastro (Sign Up) */
                        <div className="second-content">
                            <div className="second-collum">
                                <h2 className="title title-secondary">Criar Conta</h2>
                                {error && <p className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
                                <p className="description">Preencha os campos abaixo para criar sua conta</p>
                                <form className="form" onSubmit={handleSubmit}>
                                    <input 
                                        type="text" 
                                        name="username"
                                        placeholder="Usuário" 
                                        className="input" 
                                        required 
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    <input 
                                        type="email" 
                                        name="email"
                                        placeholder="Email" 
                                        className="input" 
                                        required 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <input 
                                        type="password" 
                                        name="password"
                                        placeholder="Senha" 
                                        className="input" 
                                        required 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        placeholder="Confirmar Senha" 
                                        className="input" 
                                        required 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button type="submit" className="button" disabled={loading}>
                                        {loading ? 'Carregando...' : 'Criar Conta'}
                                    </button>
                                </form>
                            </div>
                            <div className="first-collum">
                                <h2 className="title title-primary">Já tem uma conta?</h2>
                                <p className="description">Para prosseguir na plataforma</p>
                                <p className="description">por favor faça Login</p>
                                <button className="button button-primary" onClick={toggleAuth}>Fazer Login</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
