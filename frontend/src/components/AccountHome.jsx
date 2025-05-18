import {createClient} from "@supabase/supabase-js";

const AccountHome = ({ userData }) => {

    const supabase = createClient(
        "https://plywzkndxxlnuivlqige.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
    );

    async function signOutWithEmail() {
        console.log("En signOutWithEmail")

        await supabase.auth.signOut().catch(() => console.log("Error en signOut"))
    }
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
                <div>
                    <button
                        onClick={() => signOutWithEmail()}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {'Sign out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountHome;
