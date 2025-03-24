import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styles from '../styles/Header.module.css'
import {
    ShoppingCartIcon,
    MoonIcon,
    SunIcon,
    MagnifyingGlassIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import {useTheme} from '../context/ThemeContext'
import {useCart} from '../context/CartContext'
import CartSidebar from './CartSidebar'
import {catalog} from "../mock-products.js"

export default function Header() {
    const {isDarkMode, toggleTheme} = useTheme()
    const {cartItemsCount, isCartOpen, setIsCartOpen} = useCart()
    const [searchQuery, setSearchQuery] = useState('')
    const [placeholder, setPlaceholder] = useState('Search products...')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setPlaceholder(mobile ? 'Search...' : 'Search products...')
            setIsMobile(mobile)

            // Close mobile menu when resizing larger than mobile breakpoint
            if (!mobile && isMobileMenuOpen) {
                setIsMobileMenuOpen(false)
            }
        };

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [isMobileMenuOpen])

    const handleSearch = (e) => {
        e.preventDefault()
        // Implement search functionality
        console.log('Search query:', searchQuery)
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <header className={`${styles.header} dark:bg-zinc-800`}>
            <nav className={styles.nav}>
                <Link to="/" className={`${styles.logo} dark:text-primary-dark dark:hover:text-terciary-dark`}>
                    Cyber Gadgets
                </Link>

                <div className={styles.search}>
                    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 pr-12 rounded-lg bg-gray-100 dark:bg-gray-700
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2
                         focus:ring-primary"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        <button
                            type="submit"
                            className="absolute right-2 top-2 px-2 py-1 text-sm font-medium
                       text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-terciary-dark"
                        >
                            Search
                        </button>
                    </form>
                </div>

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
                                <SunIcon className="h-6 w-6 text-yellow-400"/>
                            ) : (
                                <MoonIcon className="h-6 w-6 text-gray-600"/>
                            )}
                        </button>

                        <Link
                            to="/account"
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Account"
                        >
                            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                        </Link>

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
                                    <SunIcon className="h-6 w-6 text-yellow-400"/>
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
                            to="/account"
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
                {catalog.categories.map((category) => (
                    <div key={category}
                         className={`${styles.category} dark:text-secondary-dark dark:hover:text-primary-dark`}>{category}</div>
                ))}
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        </header>
    );
}
