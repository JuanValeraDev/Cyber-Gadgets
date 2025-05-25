/* Main content area */

import {ArrowBigUp, PlusIcon, EyeIcon, TrashIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";


const mainAreaCards = [
    {title: 'Insert new products', value: 'Create', icon: 'create'},
    {title: 'Back to store', value: 'Read', icon: 'read'},
    {title: 'Modify products', value: 'Update', icon: 'update'},
    {title: 'Suppress a product ', value: 'Delete', icon: 'delete'}
];


const lastLogin = new Date().toLocaleString();


const renderIcon = (iconName) => {
    switch (iconName) {
        case 'create':
            return (
                <PlusIcon/>
            );
        case 'read':
            return (
                <EyeIcon/>
            );
        case 'update':
            return (
                <ArrowBigUp/>
            );
        case 'delete':
            return (
                <TrashIcon/>
            );
        default:
            return null;
    }
};


export const AccountMainArea = ({userData, displayName, signOutWithEmail, setActiveSection}) => {
    const navigate = useNavigate()
    const handleMainCardsClick = (card) => {
        switch (card.value) {
            case "Create":
                setActiveSection("create")
                break
            case "Read": {
                navigate("/")
                break
            }
            case "Update":
                setActiveSection("update")
                break
            case "Delete":
                setActiveSection("delete")
                break
        }
    }

    return <main className="flex-1 relative overflow-y-auto focus:outline-none dark:bg-zinc-800">
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Admin Info Card */}
                <div
                    className="bg-white dark:bg-zinc-700 overflow-hidden shadow rounded-lg divide-y divide-gray-200 mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Administrator
                            Profile</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">Personal details and account
                            information.</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{userData?.user?.email}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">Display name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{displayName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">Last login</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{lastLogin}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">Administrator</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-4 sm:px-6">
                        <button
                            onClick={signOutWithEmail}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary dark:bg-primary-dark dark:hover:bg-terciary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="mt-8">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 dark:text-primary-dark">Dashboard
                        Overview</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {mainAreaCards.map((card) => (
                            <div key={card.title}
                                 className="bg-white overflow-hidden shadow rounded-lg dark:bg-terciary-dark ">
                                <div className="p-4">
                                    <div className="flex items-center">
                                        <div
                                            className="dark:bg-primary-dark flex-shrink-0 bg-primary/10 rounded-md p-3 dark:border-2 dark:border-gray-900">
                                            <div className="text-primary dark:text-white ">{renderIcon(card.icon)}</div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-900">{card.title}</dt>
                                                <dd>
                                                    <div
                                                        className="text-2xl font-medium text-gray-900 dark:text-white ">{card.value}</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 dark:bg-zinc-900 justify-center ">
                                    <div className="text-sm inline-block w-full text-end">
                                        <button onClick={() => handleMainCardsClick(card)}
                                                className=" font-medium text-secondary hover:text-primary dark:text-primary-dark dark:border-2 dark:border-primary-dark p-2 rounded-md">
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    </main>
}
