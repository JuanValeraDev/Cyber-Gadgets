import ProductList from "./ProductList.jsx";
import Chatbot from "./Chatbot.jsx";

import {MagnifyingGlassIcon} from "@heroicons/react/24/outline/index.js";
import {useEffect, useState} from "react";

export default function Catalog() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
        };

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()

        console.log('Search query:', searchQuery)
    };

    return (
        <main className="container mx-auto px-4 py-8 dark:bg-zinc-900 rounded-lg">
            <section className="mb-12">
                {isMobile ? (
                    <div className="flex  flex-col gap-8  mb-8 items-center">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explore our universe
                        </h1>
                        <div className="w-full ps-8 pe-8">
                            <form onSubmit={handleSearch} className="relative  ">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-2 pr-20 rounded-lg bg-white dark:bg-zinc-950
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2
                         focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 px-2 py-1 text-sm font-medium
                       text-primary hover:text-secondary dark:text-primary-dark dark:hover:text-terciary-dark"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                    </div>
                ) : (
                    <div className="flex justify-between  mb-8">
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                            Explore our universe
                        </h1>
                        <div className="w-[50%]">
                            <form onSubmit={handleSearch} className="relative  ">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="absolute right-1 w-full  max-w-md  px-4 py-2 pl-2 pr-20 rounded-lg bg-white dark:bg-zinc-950
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2
                         focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 px-2 py-1 text-sm font-medium
                       text-primary hover:text-secondary dark:text-primary-dark dark:hover:text-terciary-dark"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                    </div>
                )
                }
                <ProductList/>
            </section>
            <Chatbot/>
        </main>
    );
}
