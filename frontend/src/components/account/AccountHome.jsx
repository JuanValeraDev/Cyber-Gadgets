import {createClient} from "@supabase/supabase-js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AccountMainArea} from "./AccountMainArea.jsx";
import AccountInsert from "./AccountInsert.jsx";
import AccountUpdate from "./AccountUpdate.jsx";
import AccountDelete from "./AccountDelete.jsx";

const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

const AccountHome = ({userData}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('main');

    // Mock data for display purposes
    const displayName = userData?.user?.email?.split('@')[0] || 'Admin';



    async function signOutWithEmail() {
        const {error} = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    }


    // Navigation items
    const navItems = [
        {name: 'Main', icon: 'home', id: 'main'},
        {name: 'Insert', icon: 'box', id: 'create'},
        {name: 'Update', icon: 'shopping-bag', id: 'update'},
        {name: 'Delete', icon: 'users', id: 'delete'},
    ];

    // Render navigation icon
    const renderNavIcon = (iconName) => {
        switch (iconName) {
            case 'home':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                );
            case 'box':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                              clipRule="evenodd"/>
                    </svg>
                );
            case 'shopping-bag':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                              clipRule="evenodd"/>
                    </svg>
                );
            case 'users':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                );
            case 'settings':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex  bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-primary dark:bg-zinc-950">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="text-xl font-semibold text-white dark:text-secondary-dark">E-Commerce Admin</h1>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`${
                                            activeSection === item.id
                                                ? 'bg-secondary text-white dark:bg-zinc-800 dark:text-primary-dark'
                                                : 'text-white hover:dark:text-primary-dark dark:text-secondary-dark'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                                    >
                                        <div className="mr-3 h-5 w-5">{renderNavIcon(item.icon)}</div>
                                        {item.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-primary-light p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div
                                        className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-white font-medium text-lg">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{displayName}</p>
                                        <button
                                            onClick={signOutWithEmail}
                                            className="text-xs font-medium text-gray-300 hover:text-white"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden dark:bg-zinc-800">
                {/* Top navigation */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-primary-dark shadow border-b">
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex">
                            <h2 className="text-2xl font-semibold text-gray-800 self-center dark:text-white">
                                {activeSection &&  activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                            </h2>
                        </div>
                        <div className="md:hidden ml-4 flex items-center">
                            {/* Mobile menu button */}
                            <button
                                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        <span className="sr-only">Open user menu</span>
                                        <div
                                            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {(activeSection === "main") &&
                    <AccountMainArea userData={userData} displayName={displayName}
                                     signOutWithEmail={signOutWithEmail} setActiveSection={setActiveSection}/>}

                {(activeSection === "create") &&
                    <AccountInsert/>
                }  {(activeSection === "update") &&
                    <AccountUpdate/>}

                {(activeSection === "delete") &&
                    <AccountDelete/>
                }


            </div>
        </div>
    )
        ;
};

export default AccountHome;
