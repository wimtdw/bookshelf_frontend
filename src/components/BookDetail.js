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
        console.log(currentUser)
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
                <div className={styles.bookDetails}>
                    <h2 className={styles.title}>{book.title}</h2>
                    <p className={styles.author}><b>Автор:</b> {book.author}</p>
                    <p className={styles.description}><b>Описание:</b> {book.description}</p>
                    <p className={styles.publicationDate}><b>Дата публикации:</b> {book.publication_date}</p>
                    <p className={styles.isbn}><b>ISBN:</b> {book.isbn}</p>
                    <p className={styles.genre}><b>Жанр:</b> {book.genre}</p>

                    <div className={styles.buttonContainer}>
                        {canEdit(book) && (
                            <button className={styles.button} onClick={handleEdit}>Изменить</button>
                        )}
                        {canDelete(book) && (
                            <button className={styles.button} onClick={handleDelete}>Удалить</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
