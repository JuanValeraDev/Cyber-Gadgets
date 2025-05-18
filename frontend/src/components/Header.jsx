import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styles from '../styles/Header.module.css'
import {
    ShoppingCartIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import {useTheme} from '../context/ThemeContext'
import {useCart} from '../context/CartContext'
import CartSidebar from './CartSidebar'
import {categories} from "../mock-products.js"
import {useNavigate} from 'react-router-dom';

export default function Header({onCategoryChange, onOpenChatbot, onSearchQuery, session}) {
    const {isDarkMode, toggleTheme} = useTheme()
    const {cartItemsCount, isCartOpen, setIsCartOpen} = useCart()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)


    // Handle button click
    const handleAccountButtonClick = () => {
        if (session) {
            navigate("/account"); // Redirect to account page if logged in
        } else {
            navigate("/login"); // Redirect to login page if not logged in
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)


            if (!mobile && isMobileMenuOpen) {
                setIsMobileMenuOpen(false)
            }
        };

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [isMobileMenuOpen])


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const navigate = useNavigate();
    return (
        <header className={`${styles.header} dark:bg-black`}>
            <nav className={styles.nav}>
                <button onClick={() => {
                    setIsCartOpen(false)
                    onCategoryChange("All")
                    setIsMobileMenuOpen(false)
                    onOpenChatbot(false)
                    onSearchQuery("")
                    navigate("/")
                }
                }>
                    <img src="/images/logo-2.png" alt="logo" className="logo w-44"/>
                </button>


                {isMobile ? (
                    <div className="flex items-center">
                        {/* Show hamburger toggle button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                            ) : (
                                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                            )}
                        </button>

                        {/* Display cart count indicator on mobile */}
                        {cartItemsCount > 0 && (
                            <span
                                className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1 -mt-6">
                                {cartItemsCount}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className={styles.menu}>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <SunIcon className="h-6 w-6 text-gray-300"/>
                            ) : (
                                <MoonIcon className="h-6 w-6 text-gray-600"/>
                            )}
                        </button>

                        <button
                            onClick={() => handleAccountButtonClick()}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Account"
                        >
                            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                                rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
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

                        <Link
                            to="/login"
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                            <span className="text-gray-700 dark:text-gray-200">Account</span>
                        </Link>

                        <button
                            onClick={() => {
                                setIsCartOpen(true)
                                setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                            <span className="text-gray-700 dark:text-gray-200">Cart ({cartItemsCount})</span>
                        </button>
                    </div>
                </div>
            )}

            <div className={`${styles.categories} dark:border-gray-700`}>
                <button key={"All"} onClick={() => {
                    onCategoryChange("All")
                }}
                        className={`${styles.category} dark:text-secondary-dark dark:hover:text-primary-dark bg-gray-100 dark:bg-zinc-800 px-4 rounded-md`}>All
                </button>

                {categories.categories.map((category) => (
                    <button key={category} onClick={() => {
                        onCategoryChange(category)
                    }}
                            className={`${styles.category} dark:text-secondary-dark dark:hover:text-primary-dark`}>{category}</button>
                ))}
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        </header>
    );
}
