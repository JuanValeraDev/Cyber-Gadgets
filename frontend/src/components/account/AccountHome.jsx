import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AccountMainArea} from "./AccountMainArea.jsx";
import AccountInsert from "./AccountInsert.jsx";
import AccountUpdate from "./AccountUpdate.jsx";
import AccountDelete from "./AccountDelete.jsx";
import {HomeIcon, PlusIcon,PencilIcon, TrashIcon} from "@heroicons/react/16/solid/index.js";
import {supabase} from "../../hooks/Hooks.jsx";

// Componente principal de la página de cuenta, recibe los datos del usuario como prop
const AccountHome = ({userData}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('main');
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const displayName = userData?.user?.email?.split('@')[0] || 'Admin';


    // Función para cerrar sesión usando Supabase y redirigir al login
    async function signOutWithEmail() {
        const {error} = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    }


    // Elementos de navegación para las diferentes secciones del panel
    const navItems = [
        {name: 'Main', icon: 'home', id: 'main'},
        {name: 'Insert', icon: 'insert', id: 'create'},
        {name: 'Update', icon: 'update', id: 'update'},
        {name: 'Delete', icon: 'delete', id: 'delete'},
    ];

// Renderiza el ícono correspondiente según el nombre recibido
    const renderNavIcon = (iconName) => {
        switch (iconName) {
            case 'home':
                return (
                    <HomeIcon/>
                );
            case 'insert':
                return (
                   <PlusIcon/>
                );
            case 'update':
                return (
                  <PencilIcon/>
                );
            case 'delete':
                return (
                 <TrashIcon/>
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
// Render principal del layout: sidebar y contenido principal

    return (
        <div className="flex  bg-gray-100">
            {/* Sidebar de navegación */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-primary dark:bg-zinc-950">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="text-xl font-semibold text-white dark:text-secondary-dark">E-Commerce
                                Admin</h1>
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

            {/* Contenido principal */}
            <div className="flex flex-col flex-1 overflow-hidden dark:bg-zinc-800">
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-primary-dark shadow border-b">
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex">
                            <h2 className="text-2xl font-semibold text-gray-800 self-center dark:text-white">
                                {activeSection && activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                            </h2>
                        </div>
                        <div className="md:hidden ml-4 flex items-center">
                            <button
                                className="bg-white dark:bg-black p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                onClick={() => setShowMobileMenu?.(prev => !prev)}
                                aria-label="Open sidebar menu"
                            >
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
                                    <button onClick={() => setActiveSection('main')}
                                            className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        <span className="sr-only">Open user menu</span>
                                        <div
                                            className="h-8 w-8 rounded-full bg-secondary dark:bg-black flex items-center justify-center text-white">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               {showMobileMenu && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-40"
                            onClick={() => setShowMobileMenu(false)}
                        ></div>
                        {/* Menú lateral para dispositivos móviles */}
                        <div className="relative w-4/5 max-w-xs h-full bg-white dark:bg-zinc-950 shadow-lg flex flex-col animate-slide-in-left">
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-zinc-800">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-secondary-dark">E-Commerce Admin</h1>
                                <button
                                    className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                                    onClick={() => setShowMobileMenu(false)}
                                    aria-label="Close sidebar"
                                >
                                    <svg className="h-6 w-6 text-gray-700 dark:text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setShowMobileMenu(false);
                                        }}
                                        className={`${
                                            activeSection === item.id
                                                ? 'bg-primary text-white dark:bg-zinc-800 dark:text-primary-dark'
                                                : 'text-gray-800 dark:text-secondary-dark hover:bg-gray-100 dark:hover:bg-zinc-900'
                                        } flex items-center w-full px-3 py-3 rounded-lg text-base font-medium transition`}
                                    >
                                        <span className="mr-3">{renderNavIcon(item.icon)}</span>
                                        {item.name}
                                    </button>
                                ))}
                            </nav>
                            <div className="border-t border-gray-200 dark:border-zinc-800 px-4 py-3 flex items-center">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-white font-medium text-lg">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                                    <button
                                        onClick={signOutWithEmail}
                                        className="text-xs font-medium text-primary hover:underline dark:text-primary-dark"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeSection === "main") &&
                    <AccountMainArea userData={userData} displayName={displayName}
                                     signOutWithEmail={signOutWithEmail} setActiveSection={setActiveSection}/>}

                {(activeSection === "create") &&
                    <AccountInsert/>
                } {(activeSection === "update") &&
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
