import {useEffect, useState} from 'react';
import {Trash2, Search, X, ChevronDown, ArrowBigUp} from 'lucide-react';
import {
    API_URL,
    useFetchProducts,
    useFetchIsMobile,
    supabase,
    useProductState,
    handleProductSelect
} from "../../hooks/Hooks.jsx";
import {categories} from "../../categoriesList.js"


export default function AccountDelete() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState({show: false, message: '', isError: false});
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false)

    const {
        products,
        setProducts,
        searchTerm,
        setSearchTerm,
        selectedProduct,
        setSelectedProduct,
        filteredProducts,
        setFilteredProducts,
        showModal, setShowModal
    } = useProductState()

    useFetchProducts(API_URL, setProducts, showModal);

    useEffect(() => {
            setFilteredProducts(
                products.filter(product => {
                    const matchesSearch =
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
                    return matchesSearch && matchesCategory;
                })
            );
        },
        [products, searchTerm, categoryFilter, showModal, setFilteredProducts]
    )


    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        const {data, error} = await supabase.from("products").delete().eq("id", selectedProduct.id)

        // Show success message
        setDeleteStatus({
            show: true,
            message: `"${selectedProduct.name}" has been deleted successfully`,
            isError: false
        });

        // Reset states
        setShowModal(false);
        setSelectedProduct(null);
        setDeleteStatus({show: false, message: '', isError: false});

        if (error) {
            console.log("Error: " + error.message);
        }
    }


    const handleClearSelection = () => {
        setSelectedProduct(null);
        setShowModal(false)
    };

    useFetchProducts(API_URL, setProducts);
    useFetchIsMobile(setIsMobile);


    return (<>

            {
                <div
                    className="bg-white rounded-lg shadow-lg sm:px-4 px-4 sm:py-8 py-4 max-w-full mx-auto mt-6 mb-6 dark:bg-zinc-700 dark:border-2 dark:border-terciary-dark ">


                    {/* Search and Filter Section */}

                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            {/* Search Input */}
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Search products by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative w-full sm:w-64">
                                <div
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer bg-white dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                >
                    <span
                        className={categoryFilter ? 'text-gray-900 dark:text-gray-200  h-5  overflow-hidden whitespace-nowrap text-ellipsis' : 'text-gray-500'}>
                        {categoryFilter || 'Filter by category'}
                    </span>
                                    <ChevronDown size={18}
                                                 className={`text-gray-500 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}/>
                                </div>

                                {categoriesOpen && (
                                    <div
                                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        <div
                                            className="px-4 py-2 hover:bg-secondary hover:text-white cursor-pointer border-b border-gray-200 dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                            onClick={() => {
                                                setCategoryFilter('');
                                                setCategoriesOpen(false);
                                            }}
                                        >
                                            All Categories
                                        </div>
                                        {categories.categories.map((category) => {
                                            if (category !== "All") {

                                                return <div
                                                    key={category}
                                                    className="px-4 py-2 hover:bg-secondary hover:text-white cursor-pointer dark:bg-gray-950 dark:border-gray-500 dark:text-gray-300 dark:placeholder-gray-400"
                                                    onClick={() => {
                                                        setCategoryFilter(category);
                                                        setCategoriesOpen(false);
                                                    }}
                                                    title={category}
                                                >
                                                    {category}
                                                </div>
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Product List Section */}
                    {filteredProducts.length > 0 && !showModal ? (
                        <div className="mb-6 ">
                            <div className="block sm:hidden ">
                                <div className="grid gap-4 " style={{maxHeight: '60vh', overflowY: 'auto'}}>
                                    {filteredProducts.map((product) => (
                                        <div key={product.id}
                                             className="bg-white border-2 dark:bg-zinc-800 border-gray-200 dark:border-zinc-500 rounded-lg p-4 flex flex-col ">
                                            <div className="flex items-center mb-2">
                                                <img className="h-28 w-28 rounded-full object-cover" src={product.image}
                                                     alt={product.name}/>
                                                <div className="ml-4 flex-1">
                                                    <div
                                                        className="text-base font-medium text-gray-900 dark:text-white">{product.name}</div>
                                                    {product.isNew && <span
                                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-primary-dark dark:text-white">New</span>}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-1 dark:text-zinc-50">Category: <span
                                                className="text-gray-900 dark:text-zinc-200">{product.category}</span></div>
                                            <div className="text-sm text-gray-500 mb-1 dark:text-zinc-50">Price: <span
                                                className="text-gray-900 dark:text-zinc-200">${product.price.toFixed(2)}</span></div>
                                            <div className="text-sm text-gray-500 mb-2 dark:text-zinc-50">Stock: <span
                                                className="text-gray-900 dark:text-zinc-200">{product.stock}</span></div>
                                            <button
                                                className="text-white bg-terciary hover:bg-terciary-light dark:bg-primary-dark dark:text-white px-3 py-1 rounded-md inline-flex items-center self-end"
                                                onClick={() => handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal)}
                                            >
                                                <Trash2 size={16} className="mr-1"/>
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:block ">
                                <div
                                    className="overflow-x-auto border border-gray-200 rounded-lg dark:border-zinc-500 dark:border-2"
                                    style={{maxHeight: '80vh', overflowY: 'auto'}}>
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-500">
                                        <thead className="bg-gray-50 dark:bg-zinc-900 p-8 ">
                                        <tr>
                                            <th scope="col"
                                                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-200">Product
                                            </th>
                                            <th scope="col"
                                                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-200">Category
                                            </th>
                                            <th scope="col"
                                                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-200">Price
                                            </th>
                                            <th scope="col"
                                                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-200">Stock
                                            </th>
                                            <th scope="col"
                                                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-200">Action
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-zinc-500">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 dark:bg-zinc-800  dark:hover-bg-zinc-700">
                                                <td className="xl:ps-20 p-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-20 w-20 flex-shrink-0">
                                                            <img className="h-20 w-20 rounded-full object-cover"
                                                                 src={product.image}
                                                                 alt={product.name}/>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div
                                                                className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.name}</div>
                                                            {product.isNew && <span
                                                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary text-white dark:bg-primary-dark dark:text-white">New</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div
                                                        className="text-sm text-gray-500 dark:text-gray-300">{product.category}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div
                                                        className="text-sm text-gray-900 dark:text-gray-300">${product.price.toFixed(2)}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div
                                                        className="text-sm text-gray-900 dark:text-gray-300">{product.stock}</div>
                                                </td>
                                                <td className="xl:pe-20 px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-white bg-primary hover:bg-secondary dark:bg-primary-dark hover:dark:bg-terciary-dark px-3 py-1 rounded-md inline-flex items-center"
                                                        onClick={() => handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal)}
                                                    >
                                                        <Trash2 size={16} className="mr-1"/>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (!showModal &&
                        <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500">No products found matching your criteria.</p>
                        </div>
                    )}
                </div>}
            <div>
                {/* Selected Product Section */}
                {selectedProduct && showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50 ">
                        <div
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-lg dark:bg-zinc-700 dark:border-terciary-dark">
                            <div
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Selected Product</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700 self-end sm:self-auto"
                                    onClick={handleClearSelection}
                                >
                                    <X size={20}/>
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <img src={selectedProduct.image} alt={selectedProduct.name}
                                     className="w-20 h-20 object-cover rounded-md"/>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-300">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Category: {selectedProduct.category}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Price:
                                        ${selectedProduct.price.toFixed(2)} -
                                        Stock: {selectedProduct.stock}</p>
                                    <div className="mt-3">
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="bg-primary hover:bg-secondary dark:bg-primary-dark hover:dark:bg-terciary-dark text-white px-4 py-2 rounded-md inline-flex items-center"
                                        >
                                            <Trash2 size={16} className="mr-2"/>
                                            Delete This Product
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
