import { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'
import styles from '../../styles/Header.module.css'
import {
    ShoppingCartIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import {useTheme} from '../../context/ThemeContext.jsx'
import {useCart} from '../../context/CartContext.jsx'
import CartSidebar from './CartSidebar.jsx'
import {categories} from "../../categoriesList.js"
import {useNavigate} from 'react-router-dom';
import {useFetchIsMobile} from "../../hooks/Hooks.jsx";


export default function Header({selectedCategory, onCategoryChange, onOpenChatbot, onSearchQuery, session}) {
    // Uso del contexto del tema para alternar entre modo oscuro y claro
    const {isDarkMode, toggleTheme} = useTheme()
    // Uso del contexto del carrito para acceder al número de ítems y controlar la visibilidad
    const {cartItemsCount, isCartOpen, setIsCartOpen} = useCart()

    // Estados para controlar la visibilidad del menú móvil y la detección de dispositivos
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileLandscape, setIsMobileLandscape] = useState(false)
    const location = useLocation() // Hook para obtener la ubicación actual de la ruta

    const navigate = useNavigate(); // Hook para la navegación programática

    // Maneja el clic en el botón de la cuenta/administración
    const handleAccountButtonClick = () => {
        setIsMobileMenuOpen(false) // Cierra el menú móvil
        if (session) {
            navigate("/account", {state: {userData: session}}); // Redirige a la página de cuenta si hay sesión
        } else {
            navigate("/login"); // Redirige a la página de login si no hay sesión
        }
    };
    // Maneja el clic en el botón de la tienda
    const handleStoreButtonClick=()=>{
        setIsMobileMenuOpen(false) // Cierra el menú móvil
        navigate("/") // Redirige a la página principal de la tienda
    }

    // Hook para detectar si el dispositivo es móvil (usado en el Catalog)
    useFetchIsMobile(setIsMobile)

    // Efecto para detectar si el dispositivo móvil está en orientación horizontal
    useEffect(() => {
        const checkMobileLandscape = () => {
            setIsMobileLandscape(window.innerWidth < 768 && window.innerHeight < window.innerWidth);
        };
        checkMobileLandscape(); // Comprueba al montar
        window.addEventListener('resize', checkMobileLandscape); // Escucha cambios de tamaño
        return () => window.removeEventListener('resize', checkMobileLandscape); // Limpia el listener
    }, []);

    return (
        <header className={`${styles.header} dark:bg-zinc-800 dark:text-white`}>
            {/* Barra superior del encabezado */}
            <div className={`${styles.topBar} ${isMobileLandscape ? 'hidden' : ''}`}>
                <div className="container mx-auto flex justify-between items-center h-full">
                    {/* Botón de menú móvil (hamburguesa) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6"/>
                            ) : (
                                <Bars3Icon className="h-6 w-6"/>
                            )}
                        </button>
                    </div>

                    {/* Logo de la tienda */}
                    <div className={`${styles.logo} ${isMobile ? 'order-first' : ''} flex items-center`}>
                        <img src="/images/logo.png" alt="CyberGadgets Logo" className="h-8 mr-2"/>
                        <span className="font-bold text-xl">CyberGadgets</span>
                    </div>

                    {/* Campo de búsqueda (oculto en móvil horizontal) */}
                    <div className={`relative ${isMobile ? 'hidden' : 'flex-grow max-w-lg mx-4'}`}>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            onChange={(e) => onSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-700 dark:text-white"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Iconos de acción (cuenta, tema, carrito) */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleAccountButtonClick}
                            className="flex items-center text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary-dark"
                        >
                            <UserIcon className="h-6 w-6 mr-1"/>
                            <span className="hidden md:inline">Cuenta</span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary-dark"
                        >
                            {isDarkMode ? (
                                <SunIcon className="h-6 w-6"/>
                            ) : (
                                <MoonIcon className="h-6 w-6"/>
                            )}
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary-dark"
                        >
                            <ShoppingCartIcon className="h-6 w-6"/>
                            <span className="hidden md:inline ml-1">Carrito</span>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú de categorías (oculto en ciertas rutas y en móvil horizontal) */}
            <div className={`${styles.categories} dark:border-gray-700`}
                 hidden={location.pathname === "/account" || location.pathname === "/login" || isMobileLandscape}>

                {/* Mapea las categorías y crea botones para cada una */}
                {
                    categories.categories.map((category) => (
                        <button key={category} onClick={() => {
                            onCategoryChange(category) // Cambia la categoría seleccionada
                        }}
                                className={`${styles.category} dark:text-secondary-dark dark:hover:text-primary-dark  px-2 ${selectedCategory === category ? " dark:bg-zinc-800 rounded-md bg-gray-200 text-primary dark:text-primary-dark" : ""}` }>{category}</button>
                    ))}
            </div>

            {/* Menú de navegación móvil (se desliza desde la izquierda) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al hacer clic fuera
                >
                    <div
                        className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 transform transition-transform ease-in-out duration-300"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic en el menú cierre el overlay
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menú</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                                <XMarkIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <nav className="space-y-4">
                            <button
                                onClick={handleStoreButtonClick}
                                className="w-full text-left flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <BuildingStorefrontIcon className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Tienda</span>
                            </button>
                            <button
                                onClick={handleAccountButtonClick}
                                className="w-full text-left flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <UserIcon className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Cuenta</span>
                            </button>
                            <button
                                onClick={onOpenChatbot}
                                className="w-full text-left flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H16.5m2.25 6.75 2.25-2.25V10.5m0 0-3 3m.075-.075L9.75 9m6.75 0-3 3M9.75 9l-3 3M.075 16.5l2.25-2.25V10.5M16.5 19.5l2.25 2.25m0 0 3-3m-3 3L12 15m0 0-3 3m9-5.25v.75m-4.5-4.5v.75M12 18v.75m-2.25-4.5v.75m-.75 3.75h.75m11.25-11.25h.75M9 7.5h.75m-3 3h.75m-3 3h.75M12 12h.008v.008H12V12Zm4.5-1.5h.008v.008H16.5V10.5Zm-9 0h.008v.008H7.5V10.5Zm2.25 2.25h.008v.008H9.75V12.75Zm3-3h.008v.008h-.008V9.75Zm3 3h.008v.008H15.75V12.75ZM6 16.5h.008v.008H6V16.5Zm2.25 2.25h.008v.008H8.25V18.75Zm3-3h.008v.008H11.25V15.75Zm3-3h.008v.008h-.008V12.75Zm3-3h.008v.008H17.25V9.75ZM21 16.5h.008v.008H21V16.5ZM19.5 21h.008v.008H19.5V21ZM2.25 21h.008v.008H2.25V21Zm0-4.5h.008v.008H2.25V16.5Zm3-3h.008v.008H5.25V13.5Zm3-3h.008v.008H8.25V10.5Zm3-3h.008v.008H11.25V7.5Zm3-3h.008v.008H14.25V4.5Zm3-3h.008v.008H17.25V1.5Z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-200">Chatbot</span>
                            </button>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full text-left flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <ShoppingCartIcon className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Carrito de compras</span>

                                {cartItemsCount > 0 && (
                                    <span className=" -top-1 -right-1 bg-red-500 text-white text-xs
                                rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                                )}
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Renderiza el componente del carrito lateral */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        </header>
    );
}
