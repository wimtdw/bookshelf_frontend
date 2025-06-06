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
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        general: ''
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    const { unlockAchievement } = useAchievements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', email: '', password: '', general: '' });
        
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
            
            if (error.response && error.response.status === 400) {
                const backendErrors = error.response.data;
                
                const newErrors = { 
                    username: '', 
                    email: '', 
                    password: '',
                    general: '' 
                };
                
                if (backendErrors.username) {
                    newErrors.username = backendErrors.username.join(' ');
                }
                if (backendErrors.email) {
                    newErrors.email = backendErrors.email.join(' ');
                }
                if (backendErrors.password) {
                    newErrors.password = backendErrors.password.join(' ');
                }
                
                if (backendErrors.non_field_errors) {
                    newErrors.general = backendErrors.non_field_errors.join(' ');
                }
                
                setErrors(newErrors);
            } else {
                setErrors({
                    ...errors,
                    general: 'Ошибка регистрации. Проверьте введенные данные'
                });
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Регистрация</h2>
            {errors.general && <div className={styles.error}>{errors.general}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Можно использовать буквы, цифры и @/./+/-/_ символы, без пробелов. Если username занят, зарегистрироваться тоже не получится
                </label>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={styles.input}
                />
                {errors.username && <div className={styles.fieldError}>{errors.username}</div>}
                
                <label className={styles.label}>
                    Например, "email@email.com"
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                />
                {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
                
                <label className={styles.label}>
                    Минимум 8 символов
                </label>
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.input}
                />
                {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
                
                <button type="submit" className={styles.button}>Зарегистрироваться</button>
            </form>
            
            <div className={styles.linkContainer}>
                Уже есть аккаунт? <Link to="/signin" className={styles.link}>Войти</Link>
            </div>
            <div className={styles.linkContainer}>
                <Link to="/" className={styles.link}>На главную</Link>
            </div>
        </div>
    );
};

export default SignUp;