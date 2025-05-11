import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookList.module.css';
import { useAuth } from './AuthContext';


const getRandomColor = (id) => {
  const colors = ['#E68A94', '#84E69F', '#84B8E6', '#E6B08A', '#A784E6'];
  return colors[id % colors.length];
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  // const [isAuthenticated, setIsAuthenticated] = useState(
  //   !!localStorage.getItem('access_token')
  // );
  const [searchParams] = useSearchParams();
  const shelfId = searchParams.get('shelf_id');
  const [currentShelf, setCurrentShelf] = useState(null);

  // Мемоизируем fetchBooks с useCallback
  const fetchBooks = useCallback(async () => {
    try {
      const params = {};
      if (shelfId) {
        params.shelf_id = shelfId;
      }
      const response = await axios.get('http://127.0.0.1:8000/api/v1/books/', { params });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [shelfId]); // Добавляем shelfId в зависимости

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const fetchShelf = async () => {
      if (shelfId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/shelves/${shelfId}/`);
          setCurrentShelf(response.data);
        } catch (error) {
          console.error("Error fetching shelf:", error);
        }
      } else {
        setCurrentShelf(null);
      }
    };

    fetchShelf();
  }, [shelfId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
    }
  }, [isAuthenticated]);

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
  const handleMove = async (bookId, direction) => {
    const currentIndex = books.findIndex(book => book.id === bookId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= books.length) return;

    const currentBook = books[currentIndex];
    const targetBook = books[targetIndex];

    try {
      // Сохраняем исходный порядок на случай отката
      const originalOrderCurrent = currentBook.order;
      const originalOrderTarget = targetBook.order;

      // Меняем порядок местами
      await axios.patch(`http://127.0.0.1:8000/api/v1/books/${currentBook.id}/`, {
        order: originalOrderTarget
      });
      await axios.patch(`http://127.0.0.1:8000/api/v1/books/${targetBook.id}/`, {
        order: originalOrderCurrent
      });

      // Обновляем список книг
      await fetchBooks();
    } catch (error) {
      console.error("Error moving book:", error);
    }
  };
  return (
    <div className={styles.container}>
      

      <h1 className={styles.heading}>
        {currentShelf?.title || "Книги"}
      </h1>
      {isAuthenticated && (
        <div className={styles.buttonsContainer}>
          <Link to={`/shelves`} className={styles.editButton}>
            Мои полки
          </Link>

          {!currentShelf && (
            <button className={styles.createButton} onClick={toggleFormVisibility}>
              Добавить книгу
            </button>)}

          {currentShelf && (
            <Link
              to={`/shelves/edit/${currentShelf.id}`}
              className={styles.editButton}
            >
              Редактировать полку
            </Link>
          )}
        </div>
      )}
      {isFormVisible && <BookForm onSubmit={handleFormSubmit} />}
      {!isFormVisible && (
        <>
      {currentShelf?.description && (
        <div className={styles.shelfDescription}>
          {currentShelf.description}
        </div>
      )}
      <div
        className={styles.bookShelf}
        style={{
          backgroundImage: currentShelf?.background_image
            ? `url(${currentShelf.background_image})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {books.map((book, index) => (
          <div key={book.id} className={styles.bookWrapper}>
            {/* Кнопки перемещения */}
            <button
              className={`${styles.arrowButton} ${styles.arrowLeft}`}
              onClick={() => handleMove(book.id, 'left')}
              disabled={index === 0}
              aria-label="Move left"
            >
              ←
            </button>

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
            <button
              className={`${styles.arrowButton} ${styles.arrowRight}`}
              onClick={() => handleMove(book.id, 'right')}
              disabled={index === books.length - 1}
              aria-label="Move right"
            >
              →
            </button>
          </div>
          
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default BookList;