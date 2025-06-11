import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/catalog/Catalog.jsx";
import Header from './components/catalog/Header.jsx';
import Footer from "./components/catalog/Footer.jsx";
import Login from "./components/account/Login.jsx";
import AccountPage from "./components/account/AccountPage.jsx";

import './index.css'
import { useState, useEffect } from 'react'
import {supabase} from "./hooks/Hooks.jsx";


function App() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [session, setSession] = useState(null)

    // Configuración de autenticación con Supabase
    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        // Escuchar cambios en el estado de autenticación
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <Router>
            <ThemeProvider>
                <CartProvider>
                    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-black transition-colors duration-200">
                        <Header
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            onOpenChatbot={setIsOpen}
                            onSearchQuery={setSearchQuery}
                            session={session}
                        />
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
                                {/* Ruta protegida - redirige a login si no hay sesión */}
                                <Route
                                    path="/account"
                                    element={session ? <AccountPage /> : <Navigate to="/login" replace />}
                                />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </div>
                        <Footer/>
                    </div>
                </CartProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
