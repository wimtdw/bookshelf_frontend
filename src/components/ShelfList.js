import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ShelfList.module.css';
import { useAuth } from './AuthContext';
import AchievementButton from './AchievementButton';
import Achievements from './Achievements';


const ShelfList = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { username } = useParams();
    const [shelves, setShelves] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const isOwner = user?.username === username;
    const [showAchievements, setShowAchievements] = useState(false);

    const fetchCurrentUser = useCallback(async () => {
        if (!isAuthenticated) {
            setCurrentUser(null);
            return;
        }
        try {
            const response = await axiosInstance.get('auth/users/me/');
            setCurrentUser(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных о пользователе:", error);
            setCurrentUser(null);
        }
    }, [isAuthenticated]);



    const fetchShelves = useCallback(async () => {
        try {
            const params = {};
            params.username = username;
            const response = await axiosInstance.get('api/v1/shelves/', { params });
            setShelves(response.data);
        } catch (error) {
            console.error("Error fetching shelves:", error);
        }
    }, [username]);

    useEffect(() => {
        fetchShelves();
        if (isAuthenticated) fetchCurrentUser();
    }, [fetchShelves, fetchCurrentUser, isAuthenticated]);


    useEffect(() => {
        if (!isAuthenticated) {
            // setShelves([]);
            setCurrentUser(null);
        }
    }, [isAuthenticated]);

    const handleDeleteShelf = async (shelfId) => {
        try {
            const params = { username };
            params.username = username;
            await axiosInstance.delete(`api/v1/shelves/${shelfId}/`, { params });
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

    const getShelfLink = (shelfId) => {
        if (shelfId === 0) {
            return `/${username}/`;
        }
        return `/${username}/?shelf_id=${shelfId}`;
    };
    return (
        <div className={styles.container}>
            <div>
                <AchievementButton
                    username={username}
                    onClick={() => setShowAchievements(true)}
                />

                <Achievements
                    isOpen={showAchievements}
                    onClose={() => setShowAchievements(false)}
                    username={username}
                />
            </div>
            <h1 className={styles.heading}>Полки {username}</h1>

            <div className={styles.buttonsContainer}>
                <Link to="/search" className={styles.editButton}>
                    Поиск
                </Link>
                {isAuthenticated && isOwner && (
                    <button
                        className={styles.createButton}
                        onClick={() => navigate(`/${username}/shelves/create`)}
                    >
                        Создать полку
                    </button>
                )}
            </div>

            <div className={`${styles.shelvesGrid} ${shouldCenter ? styles.centered : ''}`}>
                {combinedShelves.map((shelf) => (
                    <div key={shelf.id} className={styles.shelfContainer}>
                        <Link
                            className={styles.link}
                            to={getShelfLink(shelf.id)}
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