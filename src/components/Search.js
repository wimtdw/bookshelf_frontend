import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import styles from './Search.module.css';
import { useAchievements } from './useAchievements';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { unlockAchievement } = useAchievements();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    const debouncedSearchRef = useRef();

    useEffect(() => {
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

        return () => {
            debouncedSearchRef.current?.cancel();
        };
    }, [API_BASE_URL]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearchRef.current?.(value);
    };

    const handleUnlockSearchAchievement = async () => {
        try {
            await unlockAchievement(5);
        } catch (error) {
            console.error('Ошибка разблокировки ачивки поиска:', error);
        }
    };

    const handleUserSelect = (username) => {
        handleUnlockSearchAchievement();
        navigate(`/${username}/`);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleRandomUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/users/?random=True`);

            if (response.data.results?.[0]) {
                const randomUser = response.data.results[0];
                navigate(`/${randomUser.username}/`);
            }
        } catch (error) {
            console.error('Ошибка при получении случайного пользователя:', error);
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
                    className={styles.input}
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
