import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Achievements.module.css';

const Achievements = () => {
  const { username } = useParams();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

  if (loading) return <div>Loading achievements...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      {achievements.map((achievement) => {
        const isAchieved = achievement.users.includes(username);
        
        return (
          <div 
            key={achievement.name}
            className={styles.achievement}
          >
            <div className={styles.content}>
              <span className={`${styles.emoji} ${isAchieved ? '' : styles.grayscale}`}>
                {achievement.emoji}
              </span>
              <div className={styles.info}>
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
      })}
    </div>
  );
};

export default Achievements;