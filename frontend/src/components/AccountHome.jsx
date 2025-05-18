import {createClient} from "@supabase/supabase-js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

const AccountHome = ({userData}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');

    // Mock data for display purposes
    const lastLogin = new Date().toLocaleString();
    const displayName = userData?.user?.email?.split('@')[0] || 'Admin';

    // Quick stats for dashboard
    const quickStats = [
        {title: 'Products', value: '248', icon: 'tag'},
        {title: 'Orders', value: '36', icon: 'shopping-cart'},
        {title: 'Customers', value: '1,204', icon: 'users'},
        {title: 'Revenue', value: '$8,492', icon: 'dollar-sign'}
    ];

    // Mock recent activity
    const recentActivity = [
        {action: 'Added new product', item: 'Premium White Sneakers', time: '5 minutes ago'},
        {action: 'Updated inventory', item: 'Summer Collection', time: '2 hours ago'},
        {action: 'Deleted product', item: 'Out of stock item', time: '1 day ago'},
        {action: 'Price adjustment', item: 'Winter Collection', time: '3 days ago'}
    ];

    async function signOutWithEmail() {
        const {error} = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    }

    // Render the appropriate icon based on name
    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'tag':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                );
            case 'shopping-cart':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                );
            case 'users':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                );
            case 'dollar-sign':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    // Navigation items
    const navItems = [
        {name: 'Dashboard', icon: 'home', id: 'dashboard'},
        {name: 'Insert', icon: 'box', id: 'products'},
        {name: 'Update', icon: 'shopping-bag', id: 'orders'},
        {name: 'Delete', icon: 'users', id: 'customers'},
        {name: 'Settings', icon: 'settings', id: 'settings'}
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
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-primary">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="text-xl font-semibold text-white">E-Commerce Admin</h1>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`${
                                            activeSection === item.id
                                                ? 'bg-secondary text-white'
                                                : 'text-white hover:bg-primary-light'
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
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top navigation */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex">
                            <h2 className="text-2xl font-semibold text-gray-800 self-center">
                                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
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

                {/* Main content area */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {/* Admin Info Card */}
                            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mb-8">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Administrator
                                        Profile</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account
                                        information.</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{userData?.user?.email}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Display name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{displayName}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Last login</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{lastLogin}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                                            <dd className="mt-1 text-sm text-gray-900">Administrator</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="px-4 py-4 sm:px-6">
                                    <button
                                        onClick={signOutWithEmail}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>

                            {/* Dashboard Stats */}
                            <div className="mt-8">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Dashboard Overview</h3>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {quickStats.map((stat) => (
                                        <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="p-5">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                                                        <div className="text-primary">{renderIcon(stat.icon)}</div>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                                                            <dd>
                                                                <div
                                                                    className="text-lg font-medium text-gray-900">{stat.value}</div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-5 py-3">
                                                <div className="text-sm">
                                                    <a href="#"
                                                       className="font-medium text-secondary hover:text-primary">
                                                        View all
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="mt-8">
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                                    </div>
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flow-root">
                                            <ul className="-mb-8">
                                                {recentActivity.map((activity, activityIdx) => (
                                                    <li key={activityIdx}>
                                                        <div className="relative pb-8">
                                                            {activityIdx !== recentActivity.length - 1 ? (
                                                                <span
                                                                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                                                    aria-hidden="true"></span>
                                                            ) : null}
                                                            <div className="relative flex items-start space-x-3">
                                                                <div className="relative">
                                                                    <div
                                                                        className="h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-8 ring-white">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             className="h-5 w-5 text-white" fill="none"
                                                                             viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round"
                                                                                  strokeLinejoin="round" strokeWidth={2}
                                                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div>
                                                                        <div
                                                                            className="text-sm font-medium text-gray-900">
                                                                            {activity.action}
                                                                        </div>
                                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                                            {activity.time}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-2 text-sm text-gray-700">
                                                                        <p>{activity.item}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountHome;
