import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import Login from "./components/account/Login.jsx";
import AccountPage from "./components/account/AccountPage.jsx";
/*TODO
    6. Fix the UI chatbot in mobile landscape

 */

import './index.css'
import { useState, useEffect } from 'react'
import {supabase} from "./hooks/Hooks.jsx";


function App() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [session, setSession] = useState(null)


    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

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
                        <div
                            className="min-h-screen flex flex-col bg-gray-100 dark:bg-black transition-colors duration-200">
                            <Header selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onOpenChatbot={setIsOpen}
                                    onSearchQuery={setSearchQuery} session={session}/>
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
                                    <Route path="/account" element={<AccountPage/>}/>
                                    <Route path="/login" element={<Login/>}/>
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
