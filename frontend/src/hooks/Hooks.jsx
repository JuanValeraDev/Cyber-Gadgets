import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";


export function useProductState() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([])
    const [showModal, setShowModal] = useState(false)

    return {
        products,
        setProducts,
        searchTerm,
        setSearchTerm,
        selectedProduct,
        setSelectedProduct,
        filteredProducts,
        setFilteredProducts,
        showModal,
        setShowModal
    };
}


export function handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal) {
    console.log("En handleProductSelect")
    setSelectedProduct(product);
    setShowModal(true)
    setDropdownOpen(false);

}


export const API_URL = import.meta.env.MODE === 'production'
    ? 'https://cyber-gadgets.onrender.com'
    : 'http://localhost:5000';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function useFetchProducts(API_URL, setProducts, showModal) {
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
    }, [API_URL, setProducts, showModal]);
}

export function useFetchIsMobile(setIsMobile) {

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

// En Hooks.jsx
export function handleFormChange(setFormData) {
    return (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
}

export function handleImageInputChange(setFormData, setImagePreview) {
    return (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
}

