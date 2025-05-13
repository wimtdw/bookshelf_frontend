import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookList.module.css';
import { useAuth } from './AuthContext';
import AchievementButton from './AchievementButton';
import Achievements from './Achievements';
import { useAchievements } from './useAchievements';


const getRandomColor = (id) => {
  const colors = ['#E68A94', '#84E69F', '#84B8E6', '#E6B08A', '#A784E6'];
  return colors[id % colors.length];
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const shelfId = searchParams.get('shelf_id');
  const [currentShelf, setCurrentShelf] = useState(null);
  const isOwner = user?.username === username;
  const [showAchievements, setShowAchievements] = useState(false);
  const { unlockAchievement } = useAchievements();

  const fetchBooks = useCallback(async () => {
    try {
      const params = { username };
      if (shelfId) params.shelf_id = shelfId;

      const response = await axiosInstance.get('api/v1/books/', { params });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [shelfId, username]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const fetchShelf = async () => {
      if (shelfId) {
        try {
          const response = await axiosInstance.get(`api/v1/shelves/${shelfId}/`, {
            params: { username }
          });
          setCurrentShelf(response.data);
        } catch (error) {
          console.error("Error fetching shelf:", error);
        }
      } else {
        setCurrentShelf(null);
      }
    };

    fetchShelf();
  }, [shelfId, username]);

  useEffect(() => {
    if (!isAuthenticated) {
      // setBooks([]);
    }
  }, [isAuthenticated]);

  const handleFormSubmit = async (bookData) => {
    try {
      await axiosInstance.post('api/v1/books/', bookData);
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
    if (!user || user.username !== username) return;
    const currentIndex = books.findIndex(book => book.id === bookId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= books.length) return;

    const currentBook = books[currentIndex];
    const targetBook = books[targetIndex];

    try {
      const originalOrderCurrent = currentBook.order;
      const originalOrderTarget = targetBook.order;

      await axiosInstance.patch(`api/v1/books/${currentBook.id}/`, {
        order: originalOrderTarget
      });
      await axiosInstance.patch(`api/v1/books/${targetBook.id}/`, {
        order: originalOrderCurrent
      });

      await fetchBooks();

      try {
        await unlockAchievement(4);
      } catch (achievementError) {
        console.error('Ошибка разблокировки ачивки:', achievementError);
      }
    } catch (error) {
      console.error("Error moving book:", error);
    }
  };
  return (
    <div className={styles.container}>
      <div>
        <AchievementButton
          username={username}
          onClick={() => setShowAchievements(true)}
        />

        <Achievements
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          username={username}
        />
      </div>

      <h1 className={styles.heading}>
        {currentShelf?.title || "Книги"} {username}
      </h1>

      <div className={styles.buttonsContainer}>
        <Link to="/search" className={styles.editButton}>
          Поиск
        </Link>
        <Link to={`/${username}/shelves`} className={styles.editButton}>
          Полки
        </Link>

        {isAuthenticated && !currentShelf && isOwner && (
          <button className={styles.createButton} onClick={toggleFormVisibility}>
            Добавить книгу
          </button>
        )}

        {isAuthenticated && currentShelf && isOwner && (
          <Link
            to={`/${username}/shelves/edit/${currentShelf.id}`}
            className={styles.editButton}
          >
            Редактировать полку
          </Link>
        )}
      </div>

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
                <button
                  className={`${styles.arrowButton} ${styles.arrowLeft}`}
                  onClick={() => handleMove(book.id, 'left')}
                  disabled={index === 0 || !isAuthenticated || user?.username !== username}
                  aria-label="Move left"
                >
                  ←
                </button>

                <Link to={`/${username}/books/${book.id}`} className={styles.bookLink}>
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
                  disabled={index === books.length - 1 || !isAuthenticated || user?.username !== username}
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