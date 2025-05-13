import { useRef } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

export const useAchievements = () => {
  const { isAuthenticated } = useAuth();
  const unlockedAchievements = useRef(new Set());

  const unlockAchievement = async (achievementId) => {
    if (!isAuthenticated && achievementId !== 3) return;

    try {
      const response = await axiosInstance.patch(
        `api/v1/achievements/${achievementId}/`
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