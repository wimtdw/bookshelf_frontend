import React from 'react';
import styles from './AchievementButton.module.css';

const AchievementButton = ({ username, onClick }) => {
    if (!username) return null;

    return (
        <button
            onClick={onClick}
            className={styles.button}
            aria-label="Показать достижения"
        >
            <span className={styles.content}>
                <span role="img" aria-hidden="true" className={styles.emoji}>📚</span>
                <span className={styles.text}>Достижения {username}</span>
            </span>
        </button>
    );
};

export default AchievementButton;