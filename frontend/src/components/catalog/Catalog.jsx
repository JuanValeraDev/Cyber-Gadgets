import ProductList from "./ProductList.jsx";
import Chatbot from "./Chatbot.jsx";
import {useState} from "react";
import debounce from 'lodash.debounce';
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline/index.js";
import {API_URL, useFetchIsMobile, useFetchProducts} from "../../hooks/Hooks.jsx";


export default function Catalog({selectedCategory, onOpenChatbot, isOpen, onSearchQuery, searchQuery}) {

    const [isMobile, setIsMobile] = useState(false)
    const [products, setProducts] = useState([]);

    // Hook para cargar los productos desde la API
    useFetchProducts(API_URL, setProducts);
    // Hook para detectar si el dispositivo es móvil
    useFetchIsMobile(setIsMobile)

    // Función de búsqueda con debounce para mejorar el rendimiento
    const handleSearch = debounce((value) => {
        onSearchQuery(value);
    }, 300); // Retraso de 300ms

    // Filtra productos por término de búsqueda y categoría seleccionada
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });


    return (
        <main className="container mx-auto px-4 py-8 dark:bg-zinc-900 rounded-lg min-h-full">
            <section className="mb-12">
                {/* Renderizado condicional para dispositivos móviles */}
                {isMobile ? (
                    <div className="flex  flex-col gap-8  mb-8 items-center">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explora nuestro universo
                        </h1>
                        <button
                            onClick={onOpenChatbot}
                            className="bg-accent text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-accent-dark transition-colors duration-300 dark:bg-terciary-dark dark:hover:bg-primary-dark"
                        >
                            Pregúntale a nuestro Chatbot
                        </button>
                        {/* Campo de búsqueda en móvil */}
                        <div className="relative mt-6 w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-700 dark:text-white"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300"/>
                            {searchQuery && (
                                <button onClick={() => onSearchQuery("")}
                                        className="absolute right-2 top-2 px-2 py-1 text-sm font-medium
                       text-primary hover:text-secondary dark:text-primary-dark dark:hover:text-terciary-dark"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explora nuestro universo
                        </h1>
                        <button
                            onClick={onOpenChatbot}
                            className="bg-accent text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-accent-dark transition-colors duration-300 dark:bg-terciary-dark dark:hover:bg-primary-dark"
                        >
                            Pregúntale a nuestro Chatbot
                        </button>
                    </div>
                )}
            </section>

            {/* Listado de productos filtrados */}
            <ProductList products={filteredProducts}/>

            {/* Componente del Chatbot (se muestra u oculta según el estado `isOpen`) */}
            <Chatbot isOpen={isOpen} onOpenChatbot={onOpenChatbot}/>
        </main>
    );
}
