import React, { useState } from 'react';
import styles from './BookForm.module.css'; // Импортируем CSS-модуль

const BookForm = ({ initialData = {}, onSubmit }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [author, setAuthor] = useState(initialData.author || '');
  const [publicationDate, setPublicationDate] = useState(initialData.publication_date || '');
  const [isbn, setIsbn] = useState(initialData.isbn || '');
  const [genre, setGenre] = useState(initialData.genre || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, author, publicationDate, isbn, genre });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}> {/* Используем стили из модуля */}
      <div>
        <label>Название:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Описание:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Автор:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Дата публикации:</label>
        <input
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
        />
      </div>
      <div>
        <label>ISBN:</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Жанр:</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default BookForm;
