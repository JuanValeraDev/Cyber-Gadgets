// Updated src/components/AccountHome.jsx to use AuthContext
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountHome = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState({
        fullName: '',
        username: '',
        avatar_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const data = await UserService.getProfile();

            setProfile({
                fullName: data.full_name || '',
                username: data.username || '',
                avatar_url: data.avatar_url || '',
            });
        } catch (err) {
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/account');
        } catch (err) {
            setError('Logout failed. Please try again.');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await UserService.updateProfile({
                fullName: profile.fullName,
                username: profile.username,
                avatar_url: profile.avatar_url
            });
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Account</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Information</h2>
                    <p><strong>Email:</strong> {user?.email}</p>
                </div>

                {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                onChange={(e) => setProfile({...profile, username: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                type="text"
                                value={profile.avatar_url}
                                onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Profile</h2>
                            {profile.fullName && <p><strong>Name:</strong> {profile.fullName}</p>}
                            {profile.username && <p><strong>Username:</strong> {profile.username}</p>}
                            {profile.avatar_url && (
                                <div className="mt-2">
                                    <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountHome;
