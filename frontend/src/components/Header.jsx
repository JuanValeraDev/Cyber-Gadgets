import {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from '../styles/Header.module.css';
import {
    ShoppingCartIcon,
    MoonIcon,
    SunIcon,
    MagnifyingGlassIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import CartSidebar from './CartSidebar';
import {catalog} from "../mock-products.js";

export default function Header() {
    const {isDarkMode, toggleTheme} = useTheme();
    const {cartItemsCount, isCartOpen, setIsCartOpen} = useCart();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Search query:', searchQuery);
    };

    return (
        <header className={`${styles.header} dark:bg-zinc-800`}>
            <nav className={styles.nav}>
                <Link to="/" className={`${styles.logo} dark:text-white dark:hover:text-primary-light`}>
                    Cyber Gadgets
                </Link>

                <div className={styles.search}>
                    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Search products..."
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
                       text-primary hover:text-primary-dark"
                        >
                            Search
                        </button>
                    </form>
                </div>

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
            </nav>

            <div className={`${styles.categories} dark:border-gray-700`}>
            {catalog.categories.map((category) => (
               <div key={category} className={`${styles.category} dark:text-gray-300 dark:hover:text-primary-light`}>{category}</div>
            ))}
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        </header>
    );
}
