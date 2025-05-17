// src/components/AccountPage.jsx
//import { useAuth } from '../context/AuthContext';
import Login from './Login';
import AccountHome from './AccountHome';

const AccountPage = () => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user || !token) {
        return <Login />;
    }

    return <AccountHome />;
};

export default AccountPage;
