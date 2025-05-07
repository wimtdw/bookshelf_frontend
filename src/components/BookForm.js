import React, { useState, useEffect } from 'react';
import styles from './BookForm.module.css';

const BookForm = ({ initialData = {}, onSubmit }) => {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    author: initialData.author || '',
    publicationYear: initialData.publication_date || '',
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
      setFormData(prev => ({...prev, genres: initialData.genres}));
    }
    if (initialData.cover) {
      setFormData(prev => ({...prev, cover: initialData.cover}));
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/search?title=${encodeURIComponent(formData.title)}&search_description=${searchDescription}`
      );
      
      if (!response.ok) throw new Error('Ошибка при поиске книги');
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: searchDescription ? (data.description || '') : '',
        author: data.author || prev.author,
        publicationYear: data.publication_date || prev.publicationYear,
        genres: data.subjects || prev.genres,
        cover: data.cover // Убрано сохранение предыдущей обложки
      }));
      setUseCover(!!data.cover);
      
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
      setError(err.message || 'Не удалось найти информацию о книге');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      publication_date: formData.publicationYear,
      genres: formData.genres
    };
    
    if (!useCover || !submitData.cover) {
      delete submitData.cover;
    }
    
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
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