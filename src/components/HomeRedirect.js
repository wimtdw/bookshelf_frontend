import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const HomeRedirect = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated && user) {
            navigate(`/${user.username}/`);
        } else {
            navigate('/search');
        }
    }, [isAuthenticated, user, isLoading, navigate]);

    return null; // Не показываем ничего во время редиректа
};

export default HomeRedirect;