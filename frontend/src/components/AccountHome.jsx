const AccountHome = ({ userData }) => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Account</h1>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Info</h2>
                    <p>Email: {userData?.user?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default AccountHome;
