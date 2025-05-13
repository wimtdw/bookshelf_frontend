import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './ShelfForm.module.css';
import { useAuth } from './AuthContext';
import { useAchievements } from './useAchievements';

const ShelfForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    books: [],
    background_image: ''
  });

  const [availableBooks, setAvailableBooks] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const { user } = useAuth();
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const params = {};
        params.username = username;
        const booksResponse = await axiosInstance.get('api/v1/books/', { params });
        setAvailableBooks(booksResponse?.data || []);

        const backgroundsResponse = await axiosInstance.get('api/v1/backgrounds/');
        const backgrounds = backgroundsResponse?.data?.map(bg => ({
          id: bg.id,
          url: bg.url
        })) || [];
        setBackgroundOptions(backgrounds);

        if (id) {
          const shelfResponse = await axiosInstance.get(`api/v1/shelves/${id}/`);
          const shelfData = shelfResponse?.data || {};

          setFormData({
            title: shelfData.title || '',
            description: shelfData.description || '',
            books: shelfData.books?.map(book => String(book.id)) || [],
            background_image: shelfData.background_image?.url || ''
          });
        }
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных');
      }
    };

    loadInitialData();
  }, [id, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = id
        ? `api/v1/shelves/${id}/`
        : 'api/v1/shelves/';

      const method = id ? 'put' : 'post';
      const dataToSend = {
        ...formData,
        books: formData.books.map(Number),
        background_image: formData.background_image || null
      };

      await axiosInstance[method](url, dataToSend);

      if (!id) {
        try {
          await unlockAchievement(1);
        } catch (achievementError) {
          console.error('Ошибка разблокировки ачивки:', achievementError);
        }
      }

      navigate(`/${user?.username}/shelves`);
    } catch (err) {
      setError(err.response?.data || err.message || 'Ошибка сохранения полки');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooksChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, books: selectedValues }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <Link to={`/${user?.username}/shelves`} className={styles.backButton}>
          &lt; Назад к полкам
        </Link>
        <label>Название полки:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Описание:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div>
        <label>Книги в полке:</label>
        <select
          name="books"
          multiple
          value={formData.books}
          onChange={handleBooksChange}
          className={styles.booksSelect}
        >
          {availableBooks?.map(book => (
            <option key={book.id} value={String(book.id)}>
              {book.title} ({book.author})
            </option>
          ))}
        </select>
        <div className={styles.hint}>Используйте Ctrl/Cmd для выбора нескольких книг</div>
      </div>

      <div>
        <label>Фоновое изображение:</label>
        <div className={styles.backgroundGrid}>
          <label className={styles.backgroundOption}>
            <input
              type="radio"
              name="background_image"
              value=""
              checked={formData.background_image === ''}
              onChange={handleChange}
            />
            <div className={styles.backgroundPreview}>
              <div className={styles.noBackground}>Без фона</div>
            </div>
          </label>

          {backgroundOptions.map((bg) => (
            <label key={bg.id} className={styles.backgroundOption}>
              <input
                type="radio"
                name="background_image"
                value={bg.url}
                checked={formData.background_image === bg.url}
                onChange={handleChange}
              />
              <div className={styles.backgroundPreview}>
                <img
                  src={bg.url}
                  alt="Предпросмотр фона"
                  className={styles.backgroundThumbnail}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && <div className={styles.error}>
        {typeof error === 'object' ? JSON.stringify(error) : error}
      </div>}

      <button className={styles.createButton} type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : id ? 'Сохранить изменения' : 'Создать полку'}
      </button>
    </form>
  );
};

export default ShelfForm;