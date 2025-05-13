import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import styles from './SignUp.module.css';
import { useAuth } from './AuthContext';
import { useAchievements } from './useAchievements';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { unlockAchievement } = useAchievements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('auth/users/', formData);

            const response = await axiosInstance.post('auth/jwt/create/', {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            await login();

            try {
                await unlockAchievement(3);
            } catch (achievementError) {
                console.error('Ошибка разблокировки ачивки:', achievementError);
            }

            navigate('/');

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
            <label className={styles.label}>Можно использовать латинские буквы, без пробелов. Если username занят, зарегистрироваться тоже не получится</label>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={styles.input}
                />
                <label className={styles.label}>Например, "email@email.com"</label>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                />
                <label className={styles.label}>Минимум 8 символов</label>
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