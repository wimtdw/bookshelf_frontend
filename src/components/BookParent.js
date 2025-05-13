import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import BookList from './BookList';

const ParentComponent = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axiosInstance.get('api/books/');
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <BookList books={books} />
    </div>
  );
};

export default ParentComponent;
