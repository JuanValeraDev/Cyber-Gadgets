import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import {useState} from "react";
import Login from "./components/Login.jsx";
import AccountHome from "./components/AccountHome.jsx";
/*TODO
    3. Put an skeleton while the products are loading
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
                                <Route path="/account" element={<AccountHome />} />
                                <Route path="/login" element={<Login />} />
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
