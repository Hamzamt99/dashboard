import { useContext, useState } from 'react';
import AuthContext from '../context/Auth.context';

export const useLogin = () => {
    const { apiClient, setState } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/login', credentials);
            setState(response);
            return response;
        } catch (err) {
            setError(err);
            console.error('Login failed:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error,
    };
};
