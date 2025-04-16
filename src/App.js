import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

