import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import styles from './SignUp.module.css'; 
import { useAuth } from './AuthContext';

const SignIn = () => {
    
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            await login();
            navigate('/');
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Вход</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Войти</button>
            </form>
            <div className={styles.linkContainer}>
                Еще не зарегистрированы? <Link to="/signup" className={styles.link}>Зарегистрироваться</Link>
            </div>
            <div className={styles.linkContainer}>
            <Link to="/" className={styles.link} >На главную</Link>
            </div>
        </div>
    );
};

export default SignIn;

