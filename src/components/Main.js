import React from 'react';
import Logo from './Logo';
import styles from './Main.module.css';

function Main() {
  return (
    <main className={styles.main}>
      <Logo src="https://www.mirea.ru/upload/medialibrary/281/IIT_co
lour.jpg" />
      <h2>Добро пожаловать!</h2>
      <p>Это главная страница.</p>
      <button>Кнопка</button>
    </main>
  );
}

export default Main;
