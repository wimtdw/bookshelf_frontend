// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookParent from './components/BookParent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/" element={<BookParent />} />
      </Routes>
    </Router>
  );
};

export default App;

