import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './ShelfForm.module.css';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Загрузка книг
        const params = {};
        params.username = username;
        const booksResponse = await axios.get('http://127.0.0.1:8000/api/v1/books/', { params });
        setAvailableBooks(booksResponse?.data || []);

        // Загрузка фонов
        const backgroundsResponse = await axios.get('http://127.0.0.1:8000/api/v1/backgrounds/');
        const backgrounds = backgroundsResponse?.data?.map(bg => ({
          id: bg.id,
          url: bg.url
        })) || [];
        setBackgroundOptions(backgrounds);

        // Если есть ID - загружаем данные полки
        if (id) {
          const shelfResponse = await axios.get(`http://127.0.0.1:8000/api/v1/shelves/${id}/`);
          const shelfData = shelfResponse?.data || {};

          setFormData({
            title: shelfData.title || '',
            description: shelfData.description || '',
            // Преобразуем ID книг в строки
            books: shelfData.books?.map(book => String(book.id)) || [],
            // Убедимся что URL фона корректный
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
        ? `http://127.0.0.1:8000/api/v1/shelves/${id}/`
        : 'http://127.0.0.1:8000/api/v1/shelves/';

      const method = id ? 'put' : 'post';
      const dataToSend = {
        ...formData,
        books: formData.books.map(Number),
        background_image: formData.background_image || null
      };

      await axios[method](url, dataToSend);
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