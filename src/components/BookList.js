// src/components/BookList.js
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './BookList.module.css';

const BookList = ({ books }) => {
    //    const [books, setBooks] = useState([]);

    //    useEffect(() => {
    //        const fetchBooks = async () => {
    //            const response = await axios.get('http://localhost:8000/api/books/');
    //            setBooks(response.data);
    //        };
    //        fetchBooks();
    //    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Список книг</h1>
            <ul className={styles.list}>
                {books.map(book => (
                    <li key={book.id} className={styles.listItem}>
                        <Link to={`/books/${book.id}`} className={styles.listItemA}>{book.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;




