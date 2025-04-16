import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookDetail.module.css'; // Импорт CSS Module

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/books/${id}/`);
                setBook(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке книги:", error);
                // Обработка ошибки, например, отображение сообщения пользователю
            }
        };

        fetchBook();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/books/${id}/`);
            navigate('/');
        } catch (error) {
            console.error("Ошибка при удалении книги:", error);
            // Обработка ошибки
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
            // Обработка ошибки
        }
    };

    if (!book) return <div>Загрузка...</div>;

    return (
        <div className={styles.container}> {/* Используем стили */}
            {isEditing ? (
                <div className={styles.editing}>
                    <BookForm initialData={book} onSubmit={handleFormSubmit} />
                </div>
            ) : (
                <div>
                    <h2 className={styles.title}>{book.title}</h2>
                    <p className={styles.description}>{book.description}</p>
                    <button className={styles.button} onClick={handleEdit}>Изменить</button>
                    <button className={styles.button} onClick={handleDelete}>Удалить</button>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
