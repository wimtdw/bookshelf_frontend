import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookList.module.css';

const getRandomColor = (id) => {
    const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFDFBA', '#D0BAFF'];
    return colors[id % colors.length];
};

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('access_token')
    );

    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/books/');
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
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

    return (
      <div className={styles.container}>
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
                    Добавить книгу
                </button>
            )}
            {isFormVisible && <BookForm onSubmit={handleFormSubmit} />}
            <div className={styles.bookShelf}>
                {books.map(book => (
                    <div key={book.id} className={styles.bookWrapper}>
                        <Link to={`/books/${book.id}`} className={styles.bookLink}>
                            <div className={styles.coverSection}>
                                {book.cover ? (
                                    <img 
                                        src={book.cover} 
                                        alt="Обложка книги" 
                                        className={styles.coverImage} 
                                    />
                                ) : (
                                    <div 
                                        className={styles.coverPlaceholder}
                                        style={{ backgroundColor: getRandomColor(book.id) }}
                                    >
                                        <div className={styles.placeholderContent}>
                                            <h3>{book.title}</h3>
                                            <p>{book.author}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;