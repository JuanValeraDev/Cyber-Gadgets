import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {CartProvider} from './context/CartContext';
import Catalog from "./components/Catalog.jsx";
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import AccountPage from "./components/AccountPage.jsx";
/*TODO
    3. Put an skeleton while the products are loading
    6. Fix the UI chatbot in mobile landscape

 */

import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);



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
                            <Header onCategoryChange={setSelectedCategory} onOpenChatbot={setIsOpen}
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
