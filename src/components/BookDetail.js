// src/components/BookDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './BookDetail.module.css';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`http://localhost:8000/api/books/${id}/`);
            setBook(response.data);
        };
        fetchBook();
    }, [id]);

    if (!book) return <div>Загрузка...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.description}>{book.description}</p>
            <Link to="/" className={styles.backLink}>К списку</Link>
        </div>
    );
};

export default BookDetail;
