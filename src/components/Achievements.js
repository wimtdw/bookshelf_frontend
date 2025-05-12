import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Achievements.module.css';

const Achievements = ({ isOpen, onClose, username }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const fetchAchievements = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/v1/achievements/'
                );
                setAchievements(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Достижения {username}</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                <div className={styles.achievementsList}>
                    {loading ? (
                        <div>Загрузка достижений...</div>
                    ) : error ? (
                        <div>Ошибка: {error}</div>
                    ) : (
                        achievements.map((achievement) => {
                            const isAchieved = achievement.users.includes(username);

                            return (
                                <div
                                    key={achievement.name}
                                    className={styles.achievementItem}
                                >
                                    <div className={styles.achievementContent}>
                                        <span className={`${styles.emoji} ${isAchieved ? '' : styles.grayscale}`}>
                                            {achievement.emoji}
                                        </span>
                                        <div className={styles.achievementInfo}>
                                            <h3 className={isAchieved ? styles.title : styles.inactiveTitle}>
                                                {achievement.name}
                                            </h3>
                                            <p className={styles.description}>{achievement.description}</p>
                                            <p className={`${styles.status} ${isAchieved ? styles.achieved : styles.notAchieved}`}>
                                                {isAchieved ? '✓ Получено' : 'Не получено'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Achievements;