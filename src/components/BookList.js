import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookList.module.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );
  const [currentUser, setCurrentUser] = useState(null);

  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    fetchBooks();
    fetchCurrentUser();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/books/');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/users/me/');
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/books/${id}/`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/books/', bookData);
      setIsFormVisible(false);
      fetchBooks();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(prev => !prev);
  };

  const canDelete = (book) => {
    if (!currentUser) return false;
    console.log(currentUser, book.entry_author)
    return currentUser.is_staff || book.entry_author === currentUser.username;
  };

  return (
    <div className={styles.container}>
      <Link to="/license-agreement" className={styles.agreementButton}>Go to License Agreement</Link>
      <div className={styles.authButtons}>
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.authButton}>Выйти</button>
        ) : (
          <>
            <Link to="/signup" className={styles.authButton}>Зарегистрироваться</Link>
            <Link to="/signin" className={styles.authButton}>Войти</Link>
          </>
        )}
      </div>
      
      <h1 className={styles.heading}>Книги</h1>
      {isAuthenticated && (
        <button className={styles.createButton} onClick={toggleFormVisibility}>
          Создать новую книгу
        </button>
      )}
      {isFormVisible && <BookForm onSubmit={handleFormSubmit} />}
      <ul className={styles.bookList}>
        {books.map(book => (
          <li key={book.id} className={styles.bookItem}>
            <Link to={`/books/${book.id}`} className={styles.bookLink}>{book.title}</Link>
            {isAuthenticated && canDelete(book) && (
              <button className={styles.deleteButton} onClick={() => handleDelete(book.id)}>
                Удалить
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;