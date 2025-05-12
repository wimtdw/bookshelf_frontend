import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AchievementButton.module.css';

const AchievementButton = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const handleClick = () => {
    if (username) {
      navigate(`/${username}/achievements`);
    }
  };

  if (!username) return null;

  return (
    <button 
      onClick={handleClick}
      className={styles.button}
      aria-label="Перейти к достижениям"
    >
      <span className={styles.content}>
        <span role="img" aria-hidden="true" className={styles.emoji}>📚</span>
        <span className={styles.text}>Достижения {username}</span>
      </span>
    </button>
  );
};

export default AchievementButton;