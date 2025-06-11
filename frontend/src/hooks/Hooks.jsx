import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";

// Hook personalizado para manejar el estado de productos
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
    setSelectedProduct(product);
    setShowModal(true)
    setDropdownOpen(false);
}

// Configuración de API según el entorno
export const API_URL = import.meta.env.MODE === 'production'
    ? import.meta.env.API_URL_PRODUCTION
    : import.meta.env.API_URL_DEV

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Hook para obtener productos desde Supabase
export function useFetchProducts(API_URL, setProducts, showModal) {
    useEffect(() => {
        async function fetchProducts() {
            const {data, error} = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.log("Error: " + error.name + error.message);
            } else {
                setProducts(data || []);
            }
        }

        fetchProducts();
    }, [API_URL, setProducts, showModal]);
}

// Hook para detectar si estamos en dispositivo móvil
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

// Manejador universal para cambios en formularios
export function handleFormChange(setFormData) {
    return (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
}

// Manejador específico para inputs de imagen con preview
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

// Modal de verificación de email
function EmailVerificationModal({isOpen, onClose, email}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-sm w-full p-6">
                <div className="text-center">
                    <div
                        className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Check your email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        We sent a verification link to <span className="font-medium">{email}</span>. Please
                        verify your account to continue.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationModal;
