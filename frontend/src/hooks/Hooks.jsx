import { useEffect } from "react";
import {createClient} from "@supabase/supabase-js";

// eslint-disable-next-line no-undef
export const API_URL = process.env.NODE_ENV === 'production' ? 'https://cyber-gadgets.onrender.com' : 'http://localhost:5000';

export const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

export function useFetchProducts(API_URL, setProducts) {
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProducts();
    }, [API_URL, setProducts]);
}

export function useFetchIsMobile(setIsMobile){

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
        };

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

}
