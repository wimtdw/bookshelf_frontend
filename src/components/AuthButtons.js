// components/AuthButtons.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './AuthButtons.module.css';

const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={styles.authButtons}>
      {isAuthenticated ? (
        <button onClick={logout} className={styles.authButton}>
          Выйти
        </button>
      ) : (
        <>
          <Link to="/signup" className={styles.authButton}>
            Зарегистрироваться
          </Link>
          <Link to="/signin" className={styles.authButton}>
            Войти
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;