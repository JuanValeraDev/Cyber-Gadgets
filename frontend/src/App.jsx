import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";


function App() {
    return (
        <Router>
            <ThemeProvider>
                <CartProvider>
                    <div className="min-h-screen bg-gray-100 dark:bg-black transition-colors duration-200">
                        <Header/>
                        <Catalog/>
                        <Footer/>
                    </div>
                </CartProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
