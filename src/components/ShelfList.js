import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ShelfList.module.css';
import { useAuth } from './AuthContext';

const ShelfList = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [shelves, setShelves] = useState([]);
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

    useEffect(() => {
        // Эффект для очистки данных при выходе
        if (!isAuthenticated) {
            setShelves([]);
            setCurrentUser(null);
        }
    }, [isAuthenticated]);

    const handleDeleteShelf = async (shelfId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/shelves/${shelfId}/`);
            fetchShelves();
        } catch (error) {
            console.error("Ошибка при удалении полки:", error);
        }
    };

    const allBooksShelf = {
        id: 0,
        title: "Все книги",
        background_image: null
    };

    const combinedShelves = [allBooksShelf, ...shelves];
    const shouldCenter = combinedShelves.length === 1 && combinedShelves[0].id === 0;
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Мои полки</h1>

            {isAuthenticated && (
                <div className={styles.createShelfContainer}>
                    <button
                        className={styles.createButton}
                        onClick={() => navigate('/shelves/create')}
                    >
                        Создать полку
                    </button>
                </div>
            )}

            <div className={`${styles.shelvesGrid} ${shouldCenter ? styles.centered : ''}`}>
                {combinedShelves.map((shelf) => (
                    <div key={shelf.id} className={styles.shelfContainer}>
                        <Link
                            className={styles.link}
                            to={shelf.id === 0 ? "/" : `/?shelf_id=${shelf.id}`}
                        >
                            <div className={styles.shelfCard}>
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
                            (currentUser.is_staff || shelf.owner === currentUser.username) && (
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
        </div>
    );
};

export default ShelfList;