import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import styles from './Search.module.css'; // Импорт стилей

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const debouncedSearchRef = useRef();

  useEffect(() => {
    // Create the debounced function and store it in the ref
    debouncedSearchRef.current = debounce(async (term) => {
      if (!term) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/?search=${term}`);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error('Ошибка поиска:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup function to cancel any pending debounces
    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [API_BASE_URL]); // Recreate debounce when API_BASE_URL changes

  // Handler for search input changes
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearchRef.current?.(value);
  };

  // Handler for selecting a user
  const handleUserSelect = (username) => {
    navigate(`/${username}/`);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Handler for random user button click
  const handleRandomUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/?random=True`);

      // Assuming the API returns a single user in the 'results' array
      if (response.data.results && response.data.results.length > 0) {
        const randomUser = response.data.results[0];
        navigate(`/${randomUser.username}/`);
      } else {
        console.error('Случайный пользователь не найден');
        // Handle the case where no random user is returned (e.g., display an error message)
      }
    } catch (error) {
      console.error('Ошибка при получении случайного пользователя:', error);
      // Handle the error (e.g., display an error message)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.outerContainer}>
  
        <div className={styles.container}>
        <p>Найти книги пользователя: </p>
      <input
        type="text"
        placeholder="Введите username"
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.input} // Применяем стиль к инпуту
      />
      
      {isLoading && <p className={styles.loading}>Загрузка...</p>}
      {searchResults.length > 0 && (
        <ul className={styles.resultsList}>
          {searchResults.map((user) => (
            <li key={user.id} onClick={() => handleUserSelect(user.username)}>
              {user.username}
            </li>
          ))}
        </ul>
      )}
      </div>
      <p>Или: </p><button onClick={handleRandomUser} className={styles.randomButton}>Рандом</button>
      
    </div>
  );
};

export default Search;
