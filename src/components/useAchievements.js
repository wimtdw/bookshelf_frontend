import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

export const useAchievements = () => {
  const { isAuthenticated } = useAuth();
  const unlockedAchievements = useRef(new Set());

  const unlockAchievement = async (achievementId) => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/v1/achievements/${achievementId}/`
      );

      if (response.data.is_new) {
        unlockedAchievements.current.add(achievementId);
        toast.success('🎉 Ачивка получена!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Ошибка получения ачивки:', error);
      if (error.response?.status !== 400) { 
        toast.error('🚫 Не удалось получить ачивку', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return { unlockAchievement };
};