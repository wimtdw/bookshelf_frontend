import React from 'react';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <h1>Название</h1>
      <nav>
        <a href="#">Главная</a>
        <a href="#">О нас</a>
        <a href="#">Контакты</a>
      </nav>
    </header>
  );
}

export default Header;
