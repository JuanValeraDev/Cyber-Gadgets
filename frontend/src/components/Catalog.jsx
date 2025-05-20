import ProductList from "./ProductList.jsx";
import Chatbot from "./Chatbot.jsx";
import { useState} from "react";
import debounce from 'lodash.debounce';
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline/index.js";
import {API_URL, useFetchIsMobile, useFetchProducts} from "../hooks/Hooks.jsx";


export default function Catalog({selectedCategory, onOpenChatbot, isOpen, onSearchQuery, searchQuery}) {

    const [isMobile, setIsMobile] = useState(false)
    const [products, setProducts] = useState([]);


    useFetchProducts(API_URL, setProducts);
    useFetchIsMobile(setIsMobile)

    const handleSearch = debounce((value) => {
        onSearchQuery(value);
    }, 300);

    // Filter products by searchQuery and selectedCategory
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
                {isMobile ? (
                    <div className="flex  flex-col gap-8  mb-8 items-center">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explore our universe
                        </h1>
                        <div className="w-full ps-8 pe-8">
                            <div className="relative">
                                <MagnifyingGlassIcon
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"/>

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-8 pr-20 rounded-lg bg-white dark:bg-zinc-950
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2
                         focus:ring-primary"
                                />
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
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex justify-between  mb-8">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explore our universe
                        </h1>
                        <div className="w-[50%]">
                            <div onSubmit={handleSearch} className="relative  ">

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchQuery(e.target.value)}
                                    className="absolute right-1 w-full  max-w-md  px-4 py-2 pl-2 pr-20 rounded-lg bg-white dark:bg-zinc-950
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2
                         focus:ring-primary"
                                />
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
                            </div>
                        </div>

                    </div>
                )
                }
                <ProductList products={filteredProducts}/>
            </section>
            <Chatbot onOpenChatbot={onOpenChatbot} isOpen={isOpen}/>
        </main>
    );
}
