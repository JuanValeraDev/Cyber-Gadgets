import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import {useState} from "react";


/*TODO
    1. The min-h of the catalog should be 90%vh
    2. Poner lupa en la search bar en desktop
    3. Decidir qué hacer cuando se le da al logo: si llevarme los estados del chat y el buscador a App.jsx o si buscar la forma de que al navegar a "/" se reseteen los estados.
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
