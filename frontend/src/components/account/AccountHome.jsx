import {createClient} from "@supabase/supabase-js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AccountMainArea} from "./AccountMainArea.jsx";
import AccountInsert from "./AccountInsert.jsx";
import AccountUpdate from "./AccountUpdate.jsx";
import AccountDelete from "./AccountDelete.jsx";
import {HomeIcon, PlusIcon,PencilIcon, TrashIcon} from "@heroicons/react/16/solid/index.js";

// Inicializa el cliente Supabase con las credenciales de tu proyecto
const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

// Componente principal del panel de administración
const AccountHome = ({userData}) => {
    const navigate = useNavigate();
    // Estado para controlar la sección activa del panel (main, create, update, delete)
    const [activeSection, setActiveSection] = useState('main');
    // Estado para controlar la visibilidad del menú móvil
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // Obtiene el nombre de usuario a partir del email o usa 'Admin' por defecto
    const displayName = userData?.user?.email?.split('@')[0] || 'Admin';

    // Función para cerrar la sesión del usuario
    async function signOutWithEmail() {
        const {error} = await supabase.auth.signOut();
        if (!error) {
            navigate("/login"); // Redirige a la página de login tras cerrar sesión
        } else {
            console.error("Error al cerrar sesión:", error.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Barra de navegación superior para dispositivos móviles */}
            <div className="lg:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="text-gray-500 dark:text-gray-300 focus:outline-none"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showMobileMenu ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        )}
                    </svg>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Menú de navegación lateral */}
                <aside
                    className={`fixed inset-y-0 left-0 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out
                                bg-white dark:bg-gray-800 w-64 p-5 shadow-lg lg:shadow-none z-20`}>
                    <div className="flex items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
                    </div>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        setActiveSection('main');
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark ${activeSection === 'main' ? 'text-primary dark:text-primary-dark font-semibold' : ''} w-full text-left`}
                                >
                                    <HomeIcon className="h-5 w-5 mr-3"/>
                                    Inicio
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        setActiveSection('create');
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark ${activeSection === 'create' ? 'text-primary dark:text-primary-dark font-semibold' : ''} w-full text-left`}
                                >
                                    <PlusIcon className="h-5 w-5 mr-3"/>
                                    Insertar
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        setActiveSection('update');
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark ${activeSection === 'update' ? 'text-primary dark:text-primary-dark font-semibold' : ''} w-full text-left`}
                                >
                                    <PencilIcon className="h-5 w-5 mr-3"/>
                                    Actualizar
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => {
                                        setActiveSection('delete');
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark ${activeSection === 'delete' ? 'text-primary dark:text-primary-dark font-semibold' : ''} w-full text-left`}
                                >
                                    <TrashIcon className="h-5 w-5 mr-3"/>
                                    Eliminar
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Contenido principal del panel */}
                <div className="flex-1 p-5 lg:p-8 overflow-auto">
                    {/* Sección de perfil de usuario en el encabezado */}
                    <div
                        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Bienvenido, {displayName}!
                        </h1>
                        <div className="flex items-center">
                            <div className="hidden md:flex items-center">
                                {/* Inicial del nombre de usuario como avatar */}
                                <div
                                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium text-lg">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                                    <button
                                        onClick={signOutWithEmail}
                                        className="text-xs font-medium text-primary hover:underline dark:text-primary-dark"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Renderizado condicional de las secciones del panel */}
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
        </div>
    )
        ;
};

export default AccountHome;
