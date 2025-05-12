import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './AuthButtons.module.css';

const AuthButtons = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className={styles.authButtons}>
      {isAuthenticated ? (
        <div>
          {user && (
            <div className={styles.username}>User: {user.username}</div>
          )}
          <Link to="/" className={styles.authButton}>
            Мои книги
          </Link>
          <button onClick={logout} className={styles.authButtonLink}>
            Выйти
          </button>

        </div>
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