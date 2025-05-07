import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SignUp.module.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/auth/users/', formData);
            navigate('/');
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    };

    return (
        <div className={styles.container}> 
            <h2 className={styles.heading}>Регистрация</h2> 
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
