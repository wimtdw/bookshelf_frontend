import React, { useState, useEffect } from 'react';
import styles from './BookForm.module.css';
import { useAchievements } from './useAchievements';
import axiosInstance from '../api/axios';

const BookForm = ({ initialData = {}, onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const { unlockAchievement } = useAchievements();

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    author: initialData.author || '',
    publicationYear: initialData.publication_year || '',
    genres: initialData.genres || [],
    newGenre: '',
    cover: initialData.cover || ''
  });

  const [searchDescription, setSearchDescription] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCover, setUseCover] = useState(!!initialData.cover);

  useEffect(() => {
    if (initialData.genres) {
      setFormData(prev => ({ ...prev, genres: initialData.genres }));
    }
    if (initialData.cover) {
      setFormData(prev => ({ ...prev, cover: initialData.cover }));
      setUseCover(true);
    }
  }, [initialData.genres, initialData.cover]);

  const handleSearch = async () => {
    if (!formData.title.trim()) {
      setError('Введите название книги для поиска');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('api/v1/search', {
        params: {
          title: formData.title,
          search_description: searchDescription
        }
      });

      setFormData(prev => ({
        ...prev,
        title: response.data.title || prev.title,
        description: searchDescription ? (response.data.description || '') : '',
        author: response.data.author || prev.author,
        publicationYear: response.data.publication_date || prev.publicationYear,
        genres: response.data.subjects || prev.genres,
        cover: response.data.cover
      }));
      setUseCover(!!response.data.cover);

    } catch (err) {
      setFormData(prev => ({
        ...prev,
        description: '',
        author: '',
        publicationYear: '',
        genres: [],
        cover: ''
      }));
      setUseCover(false);
      setError(err.response?.data?.message || err.message || 'Не удалось найти информацию о книге');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { publicationYear, ...restFormData } = formData;
    const submitData = {
      ...restFormData,
      ...(publicationYear !== '' && { publication_year: publicationYear }),
    };
  
    if (!useCover) {
      submitData.cover = '';
    }
  
    try {
      await onSubmit(submitData);
  
      if (!initialData.id) {
        try {
          await unlockAchievement(2);
        } catch (achievementError) {
          console.error('Ошибка разблокировки ачивки:', achievementError);
        }
      }
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreKeyPress = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      const newGenre = formData.newGenre.trim();
      if (newGenre) {
        setFormData(prev => ({
          ...prev,
          genres: [...prev.genres, newGenre],
          newGenre: ''
        }));
      }
    }
  };

  const removeGenre = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchSection}>
        <div>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.searchControls}>
          <label>
            <input
              type="checkbox"
              checked={searchDescription}
              onChange={(e) => setSearchDescription(e.target.checked)}
            />
            Искать описание (машинный перевод)
          </label>
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Поиск...' : 'Найти книгу по названию'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div>
        <label>Описание:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className={styles.largeTextarea}
        />
      </div>

      <div>
        <label>Автор:</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Год публикации:</label>
        <input
          type="number"
          name="publicationYear"
          value={formData.publicationYear}
          onChange={handleChange}
          min="1000"
          max={currentYear}
          step="1"
        />
      </div>

      <div className={styles.genresContainer}>
        <label>Жанры:</label>
        <div className={styles.genresInput}>
          <div className={styles.genreTags}>
            {formData.genres.map((genre, index) => (
              <div key={index} className={styles.genreTag}>
                {genre}
                <button
                  type="button"
                  onClick={() => removeGenre(index)}
                  className={styles.removeGenre}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            name="newGenre"
            value={formData.newGenre}
            onChange={handleChange}
            onKeyDown={handleGenreKeyPress}
            placeholder="Введите жанр и нажмите Enter или запятую"
          />
        </div>
      </div>

      {formData.cover && (
        <div className={styles.coverSection}>
          <img
            src={formData.cover}
            alt="Обложка книги"
            className={styles.coverImage}
          />
          <label className={styles.coverCheckbox}>
            <input
              type="checkbox"
              checked={useCover}
              onChange={(e) => setUseCover(e.target.checked)}
            />
            Использовать обложку
          </label>
        </div>
      )}

      <button type="submit" disabled={loading}>
        Сохранить
      </button>
    </form>
  );
};

export default BookForm;