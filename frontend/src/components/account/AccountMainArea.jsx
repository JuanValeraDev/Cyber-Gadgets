/* Main content area */

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
const lastLogin = new Date().toLocaleString();


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

export const AccountMainArea = ({userData, displayName, signOutWithEmail}) => {
    return <main className="flex-1 relative overflow-y-auto focus:outline-none">
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
}
