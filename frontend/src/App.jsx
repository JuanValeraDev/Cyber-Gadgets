import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import {useState} from "react";
import AccountPage from "./components/AccountPage.jsx";
/*TODO
    1. Save the chart in session
    3. Put an skeleton while the products are loading
    4. Change the catalog.products for feeding the chatbot for a collection of products retrieved by the database
    5. Save in the session the color scheme
    6. Fix the UI chatbot in mobile landscape

 */


function App() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Router>
            <ThemeProvider>
                <CartProvider>
                    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-black transition-colors duration-200">
                        <Header onCategoryChange={setSelectedCategory} onOpenChatbot={setIsOpen} onSearchQuery={setSearchQuery} />
                        <div className="flex-grow">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Catalog
                                            selectedCategory={selectedCategory}
                                            onOpenChatbot={setIsOpen}
                                            isOpen={isOpen}
                                            onSearchQuery={setSearchQuery}
                                            searchQuery={searchQuery}
                                        />
                                    }
                                />
                                <Route path="/account" element={<AccountPage />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </CartProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
