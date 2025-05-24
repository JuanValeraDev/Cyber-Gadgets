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

// Filtered products based on search term and category
// Custom hook to get filtered products based on search term and category
export function useFilteredProducts(products, searchTerm, categoryFilter) {
    return products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
}


export function handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal) {
    console.log("En handleProductSelect")
    setSelectedProduct(product);
    setShowModal(true)
    setDropdownOpen(false);

}


// eslint-disable-next-line no-undef
export const API_URL = process.env.NODE_ENV === 'production' ? 'https://cyber-gadgets.onrender.com' : 'http://localhost:5000';

export const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

export function useFetchProducts(API_URL, setProducts,showModal) {
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
    }, [API_URL, setProducts,showModal]);
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

