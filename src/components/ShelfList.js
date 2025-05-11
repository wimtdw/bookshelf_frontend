import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import styles from './ShelfList.module.css';

const ShelfList = () => {
    const navigate = useNavigate(); // Хук для навигации
    const [shelves, setShelves] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('access_token')
    );

    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });


    const [currentUser, setCurrentUser] = useState(null);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/auth/users/me/');
            setCurrentUser(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных о пользователе:", error);
            setCurrentUser(null);
        }
    };

    const fetchShelves = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/shelves/');
            setShelves(response.data);
        } catch (error) {
            console.error("Error fetching shelves:", error);
        }
    };
    useEffect(() => {
        fetchShelves();
        fetchCurrentUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setShelves([]);
    };

    const handleDeleteShelf = async (shelfId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/shelves/${shelfId}/`);
            fetchShelves(); // Обновляем список после удаления
        } catch (error) {
            console.error("Ошибка при удалении полки:", error);
        }
    };

    // Статичная первая полка "Все книги"
    const allBooksShelf = {
        id: 0,
        title: "Все книги",
        background_image: null
    };

    const combinedShelves = [allBooksShelf, ...shelves];

    return (
        <div className={styles.container}>
            <div className={styles.authButtons}>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className={styles.authButton}>Выйти</button>
                ) : (
                    <>
                        <Link to="/signup" className={styles.authButton}>Зарегистрироваться</Link>
                        <Link to="/signin" className={styles.authButton}>Войти</Link>
                    </>
                )}
            </div>

            <h1 className={styles.heading}>Мои полки</h1>

            {isAuthenticated && (
                <div className={styles.createShelfContainer}>
                    <button
                        className={styles.createButton}
                        onClick={() => navigate('/shelves/create')} // Добавляем обработчик перехода
                    >
                        Создать полку
                    </button>
                </div>
            )}

            <div className={styles.shelvesGrid}>
                    {combinedShelves.map((shelf) => (
                        <div key={shelf.id} className={styles.shelfContainer}>
                        {/* <div key={shelf.id} className={styles.shelfCard}> */}
                            <Link className={styles.link}
                                to={shelf.id === 0 ? "/" : `/?shelf_id=${shelf.id}`}
                                
                            >
                                <div key={shelf.id} className={styles.shelfCard}>
                                <div className={styles.shelfContent}>
                                    <h3 className={styles.shelfTitle}>{shelf.title}</h3>
                                </div>
                                {shelf.background_image && (
                                    <img
                                        src={shelf.background_image}
                                        alt="Обложка полки"
                                        className={styles.shelfImage}
                                    />
                                )}
                                </div>
                            </Link>
                            {currentUser && shelf.id !== 0 && (
                                (currentUser.is_staff || shelf.owner === currentUser.id) && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteShelf(shelf.id)}
                                    >
                                        Удалить
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
                {/* {combinedShelves.map((shelf) => (
                    <Link
                        key={shelf.id}
                        to={shelf.id === 0 ? "/" : `/?shelf_id=${shelf.id}`}
                        className={styles.shelfCard}
                    >
                        <div className={styles.shelfContent}>
                            <h3 className={styles.shelfTitle}>{shelf.title}</h3>

                        </div>

                        {shelf.background_image && (
                            <img
                                src={shelf.background_image}
                                alt="Обложка полки"
                                className={styles.shelfImage}
                            />
                        )}

                    </Link>
                ))} */}
        </div>
    );
};

export default ShelfList;