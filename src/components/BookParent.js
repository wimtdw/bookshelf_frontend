import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookList from './BookList'; 

const ParentComponent = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://localhost:8000/api/books/');
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
