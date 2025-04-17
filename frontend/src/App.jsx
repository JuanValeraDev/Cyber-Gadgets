import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import {useState} from "react";


/*TODO
    1. The min-h of the catalog should be 90%vh
    3. Cambiar el logo a un diseño más personalizado
 */
function App() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    return (
        <Router>
            <ThemeProvider>
                <CartProvider>
                    <div className="min-h-screen bg-gray-100 dark:bg-black transition-colors duration-200">
                        <Header onCategoryChange={setSelectedCategory} onOpenChatbot={setIsOpen} onSearchQuery={setSearchQuery}/>
                        <Catalog selectedCategory={selectedCategory} onOpenChatbot={setIsOpen} isOpen={isOpen}
                                 onSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
                        <Footer/>
                    </div>
                </CartProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
