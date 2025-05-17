//import {useEffect, useState} from 'react';
//import {useNavigate} from 'react-router-dom';


const AccountHome = () => {
    /*
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const {data, error} = await supabase
                .from('users')
                .select('*')
                .eq('uid', user.id)
                .single();

            if (!error) setProfile(data);
        };

        if (user) fetchProfile();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;
*/
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Account</h1>
                    {/*}
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">
                        Logout
                    </button>
*/}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Info</h2>
                    {/*

                    <p>Email: {user.email}</p>
                    {profile?.display_name && <p>Display Name: {profile.display_name}</p>}
                    <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                    */}
                </div>
            </div>
        </div>
    );
};

export default AccountHome;
