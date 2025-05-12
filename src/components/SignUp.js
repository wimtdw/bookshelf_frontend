import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SignUp.module.css';
import { useAuth } from './AuthContext';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/auth/users/', formData);
            navigate('/');
            try {
                const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', {
                    username: formData.username,
                    password: formData.password
                });

                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                await login(); // Обновляем состояние аутентификации
                navigate('/');
            } catch (loginError) {
                console.error('Ошибка автоматического входа:', loginError);
                setError('Ошибка автоматического входа');
                navigate('/signin');
            }

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            
            setError('Ошибка регистрации. Проверьте введенные данные');
        }

    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Регистрация</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Зарегистрироваться</button>
            </form>
            <div className={styles.linkContainer}>
                Уже есть аккаунт? <Link to="/signin" className={styles.link}>Войти</Link>
            </div>
            <div className={styles.linkContainer}>
                <Link to="/" className={styles.link} >На главную</Link>
            </div>
        </div>
    );
};

export default SignUp;
