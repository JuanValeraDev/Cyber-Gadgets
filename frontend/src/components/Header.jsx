import { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'
import styles from '../styles/Header.module.css'
import {
    ShoppingCartIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import {useTheme} from '../context/ThemeContext'
import {useCart} from '../context/CartContext'
import CartSidebar from './CartSidebar'
import {categories} from "../categoriesList.js"
import {useNavigate} from 'react-router-dom';
import {useFetchIsMobile} from "../hooks/Hooks.jsx";


export default function Header({selectedCategory, onCategoryChange, onOpenChatbot, onSearchQuery, session}) {
    const {isDarkMode, toggleTheme} = useTheme()
    const {cartItemsCount, isCartOpen, setIsCartOpen} = useCart()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileLandscape, setIsMobileLandscape] = useState(false)
    const location = useLocation()

    // Handle button click
    const handleAccountButtonClick = () => {
        setIsMobileMenuOpen(false)
        if (session) {
            navigate("/account", {state: {userData: session}});
        } else {
            navigate("/login");
        }
    };
    const handleStoreButtonClick=()=>{
        setIsMobileMenuOpen(false)
        navigate("/")
    }

    useFetchIsMobile(setIsMobile)

    // Check for mobile landscape orientation
    useEffect(() => {
        const checkMobileLandscape = () => {
            const width = window.innerWidth
            const height = window.innerHeight
            const isMobileDevice = width <= 1000 // Mobile breakpoint
            const isLandscape = width > height

            setIsMobileLandscape(isMobileDevice && isLandscape)
        }

        checkMobileLandscape()

        window.addEventListener('resize', checkMobileLandscape)
        window.addEventListener('orientationchange', checkMobileLandscape)

        return () => {
            window.removeEventListener('resize', checkMobileLandscape)
            window.removeEventListener('orientationchange', checkMobileLandscape)
        }
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const navigate = useNavigate();

    return (
        <header className={`${styles.header} dark:bg-black ${isMobileLandscape ? 'py-1' : ''}`}>
            <nav className={`${styles.nav} ${isMobileLandscape ? 'min-h-0 py-1' : ''}`}>
                <button onClick={() => {
                    setIsCartOpen(false)
                    onCategoryChange("All")
                    setIsMobileMenuOpen(false)
                    onOpenChatbot(false)
                    onSearchQuery("")
                    navigate("/")
                }
                }>
                    <img src="/images/logo-2.png" alt="logo" className={`logo   ${isMobileLandscape ? 'w-20 h-auto' : 'w-40'}`}/>
                </button>


                {isMobile ? (
                    <div className="flex items-center">
                        {/* Show hamburger toggle button */}
                        <button
                            onClick={toggleMobileMenu}
                            className={`${isMobileLandscape ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-2`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600 dark:text-gray-300`}/>
                            ) : (
                                <Bars3Icon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600 dark:text-gray-300`}/>
                            )}
                        </button>

                        {/* Display cart count indicator on mobile */}
                        {cartItemsCount > 0 && (
                            <span
                                className={`absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center ml-8 ${isMobileLandscape ? 'h-4 w-4 -mt-4 text-xs' : 'h-5 w-5 -mt-6'}`}>
                                {cartItemsCount}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className={styles.menu}>

                        <button hidden={location.pathname === "/account" || location.pathname === "/login"}
                                onClick={() => setIsCartOpen(true)}
                                className={`${isMobileLandscape ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative`}
                                aria-label="Shopping cart"
                        >
                            <ShoppingCartIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600 dark:text-gray-300`}/>
                            {cartItemsCount > 0 && (
                                <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'}`}>
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                        <button hidden={location.pathname === "/account" || location.pathname === "/login"}
                                onClick={() => handleAccountButtonClick()}
                                className={`${isMobileLandscape ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                                aria-label="Account"
                        >
                            <UserIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600 dark:text-gray-300`}/>
                        </button>
                        <button hidden={location.pathname === "/"}
                                onClick={() => handleStoreButtonClick()}
                                className={`${isMobileLandscape ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                                aria-label="Home"
                        >
                            <BuildingStorefrontIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600 dark:text-gray-300`}/>
                        </button>


                        <button
                            onClick={toggleTheme}
                            className={`${isMobileLandscape ? 'p-1' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <SunIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-300`}/>
                            ) : (
                                <MoonIcon className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'} text-gray-600`}/>
                            )}
                        </button>
                    </div>
                )}
            </nav>

            {/* Mobile menu dropdown */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="bg-white dark:bg-zinc-700 shadow-lg rounded-b-lg px-4 py-2 absolute top-full left-0 right-0 z-50">
                    <div className="flex flex-col space-y-2 py-2">
                        <button
                            onClick={() => {
                                toggleTheme()
                                setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            {isDarkMode ? (
                                <>
                                    <SunIcon className="h-6 w-6 text-gray-300"/>
                                    <span className="text-gray-700 dark:text-gray-200">Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                    <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
                                </>
                            )}
                        </button>
                        {location.pathname === "/" &&
                            <button
                                onClick={() => handleAccountButtonClick()}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label="Account"
                            >
                                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Account</span>

                            </button>
                        }
                        {location.pathname !== "/" && (
                            <button
                                onClick={() => handleStoreButtonClick()}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label="Home"
                            >
                                <BuildingStorefrontIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Store</span>
                            </button>
                        )}


                        {
                            location.pathname !== "/account" && location.pathname !== "/login" &&
                            <button
                                onClick={() => {setIsCartOpen(true); setIsMobileMenuOpen(false)}}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label="Shopping cart"
                            >
                                <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                <span className="text-gray-700 dark:text-gray-200">Shopping Cart</span>

                                {cartItemsCount > 0 && (
                                    <span className=" -top-1 -right-1 bg-red-500 text-white text-xs
                                rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                                )}
                            </button>
                        }
                    </div>
                </div>
            )}

            <div className={`${styles.categories} dark:border-gray-700`}
                 hidden={location.pathname === "/account" || location.pathname === "/login" || isMobileLandscape}>

                {
                    categories.categories.map((category) => (
                        <button key={category} onClick={() => {
                            onCategoryChange(category)
                        }}
                                className={`${styles.category} dark:text-secondary-dark dark:hover:text-primary-dark  px-2 ${selectedCategory === category ? " dark:bg-zinc-800 rounded-md bg-gray-200 text-primary dark:text-primary-dark" : ""}` }>{category}</button>
                    ))}
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        </header>
    );
}
