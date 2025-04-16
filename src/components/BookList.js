import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookForm from './BookForm';
import styles from './BookList.module.css'; // Импорт CSS Modules

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);


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


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Книги</h1>
      <button className={styles.createButton} onClick={toggleFormVisibility}>Создать новую книгу</button>
      {isFormVisible && <BookForm onSubmit={handleFormSubmit} />}
      <ul className={styles.bookList}>
        {books.map(book => (
          <li key={book.id} className={styles.bookItem}>
            <Link to={`/books/${book.id}`} className={styles.bookLink}>{book.title}</Link>
            <button className={styles.deleteButton} onClick={() => handleDelete(book.id)}>Удалить</button>
          </li>
        ))}
      </ul>


    </div>
  );
};

export default BookList;
