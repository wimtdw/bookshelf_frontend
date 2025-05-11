import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookDetail.module.css';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const getRandomColor = (id) => {
        const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFDFBA', '#D0BAFF'];
        return colors[id % colors.length];
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/books/${id}/`);
                setBook(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке книги:", error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/auth/users/me/');
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о пользователе:", error);
                setCurrentUser(null);
            }
        };

        fetchBook();
        fetchCurrentUser();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/books/${id}/`);
            navigate('/');
        } catch (error) {
            console.error("Ошибка при удалении книги:", error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            if (isEditing) {
                await axios.patch(`http://127.0.0.1:8000/api/v1/books/${id}/`, data);
            } else {
                await axios.post('http://127.0.0.1:8000/api/v1/books/', data);
            }
            navigate('/');
        } catch (error) {
            console.error("Ошибка при сохранении книги:", error);
        }
    };

    const canDelete = (book) => {
        if (!currentUser) return false;
        return currentUser.is_staff || book.entry_author === currentUser.username;
    };

    const canEdit = (book) => {
        if (!currentUser) return false;
        return currentUser.is_staff || book.entry_author === currentUser.username;
    };

    if (!book) return <div>Загрузка...</div>;

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.backButton}>
                &lt; Назад к списку
            </Link>
            {isEditing ? (
                <div className={styles.editing}>
                    <BookForm initialData={book} onSubmit={handleFormSubmit} />
                </div>
            ) : (
                <div className={styles.bookContent}>
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

                    <div className={styles.infoSection}>
                        <div className={styles.buttonContainer}>
                            {canEdit(book) && (
                                <button className={styles.button} onClick={handleEdit}>
                                    Изменить
                                </button>
                            )}
                            {canDelete(book) && (
                                <button className={styles.button} onClick={handleDelete}>
                                    Удалить
                                </button>
                            )}
                        </div>
                        <h2 className={styles.title}>{book.title}</h2>
                        <div className={styles.metaInfo}>
                            <p><b>Автор:</b> {book.author || 'отсутствует'}</p>
                            <p><b>Год публикации:</b> {book.publication_year || 'отсутствует'}</p>
                            <p><b>Жанры:</b> {book.genres?.length > 0 ? book.genres.join(', ') : 'отсутствует'}</p>
                            <p><b>Описание:</b> {book.description || 'отсутствует'}</p>
                            {/* <p><b>Добавлено пользователем:</b> {book.entry_author}</p> */}
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;