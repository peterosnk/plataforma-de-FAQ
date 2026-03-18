import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleAuth = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div className="auth-container">
            <div className={`container ${!isSignIn ? 'sign-up-active' : ''}`}>
                <div className="content">
                    {/* Login (Sign In) - Aparece primeiro */}
                    <div className="first-content">
                        <div className="first-collum">
                            <h2 className="title title-primary">Não tem uma conta?</h2>
                            <p className="description">Crie uma conta para acessar a plataforma</p>
                            <p className="description">e aproveitar todos os recursos</p>
                            <button className="button button-primary" onClick={toggleAuth}>Criar Conta</button>
                        </div>
                        <div className="second-collum">
                            <h2 className="title title-secondary">Fazer Login</h2>
                            <p className="description">Preencha os campos abaixo para fazer login</p>
                            <form className="form">
                                <input type="email" placeholder="Email" className="input" />
                                <input type="password" placeholder="Senha" className="input" />
                                <a href="#" className="forgot-password">Esqueci minha senha</a>
                                <button type="button" className="button">Fazer Login</button>
                            </form>
                        </div>
                    </div>

                    {/* Cadastro (Sign Up) - Aparece ao alternar */}
                    <div className="second-content">
                        <div className="second-collum">
                            <h2 className="title title-secondary">Criar Conta</h2>
                            <p className="description">Preencha os campos abaixo para criar sua conta</p>
                            <form className="form">
                                <input type="text" placeholder="Nome Completo" className="input" />
                                <input type="email" placeholder="Email" className="input" />
                                <input type="password" placeholder="Senha" className="input" />
                                <button type="button" className="button">Criar Conta</button>
                            </form>
                        </div>
                        <div className="first-collum">
                            <h2 className="title title-primary">Já tem uma conta?</h2>
                            <p className="description">Para prosseguir na plataforma</p>
                            <p className="description">por favor faça Login</p>
                            <button className="button button-primary" onClick={toggleAuth}>Fazer Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
