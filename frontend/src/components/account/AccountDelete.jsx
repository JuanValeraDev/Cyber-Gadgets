import {useEffect, useState} from 'react';
import {Trash2, Search, X, ChevronDown} from 'lucide-react';
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

    useFetchProducts(API_URL, setProducts,showModal);

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

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-auto mt-5 max-w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                    {deleteStatus.show && (
                        <div
                            className={`${deleteStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-4 py-2 rounded-md flex items-center w-full sm:w-auto`}>
                            <span className="font-medium">{deleteStatus.message}</span>
                        </div>
                    )}
                </div>

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
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                placeholder="Search products by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative w-full sm:w-64">
                            <div
                                className="w-full px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer bg-white"
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                            >
                    <span className={categoryFilter ? 'text-gray-900' : 'text-gray-500'}>
                        {categoryFilter || 'Filter by category'}
                    </span>
                                <ChevronDown size={18}
                                             className={`text-gray-500 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}/>
                            </div>

                            {categoriesOpen && (
                                <div
                                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    <div
                                        className="px-4 py-2 hover:bg-secondary hover:text-white cursor-pointer border-b border-gray-200"
                                        onClick={() => {
                                            setCategoryFilter('');
                                            setCategoriesOpen(false);
                                        }}
                                    >
                                        All Categories
                                    </div>
                                    {categories.categories.map((category) => (
                                        <div
                                            key={category}
                                            className="px-4 py-2 hover:bg-secondary hover:text-white cursor-pointer"
                                            onClick={() => {
                                                setCategoryFilter(category);
                                                setCategoriesOpen(false);
                                            }}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product List Section */}
                {filteredProducts.length > 0 ? (
                    <div className="mb-6">
                        <div className="block sm:hidden">
                            <div className="grid gap-4" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                                {filteredProducts.map((product) => (
                                    <div key={product.id}
                                         className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                                        <div className="flex items-center mb-2">
                                            <img className="h-28 w-28 rounded-full object-cover" src={product.image}
                                                 alt={product.name}/>
                                            <div className="ml-4 flex-1">
                                                <div
                                                    className="text-base font-medium text-gray-900">{product.name}</div>
                                                {product.isNew && <span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">New</span>}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 mb-1">Category: <span
                                            className="text-gray-900">{product.category}</span></div>
                                        <div className="text-sm text-gray-500 mb-1">Price: <span
                                            className="text-gray-900">${product.price.toFixed(2)}</span></div>
                                        <div className="text-sm text-gray-500 mb-2">Stock: <span
                                            className="text-gray-900">{product.stock}</span></div>
                                        <button
                                            className="text-white bg-terciary hover:bg-terciary-light px-3 py-1 rounded-md inline-flex items-center self-end"
                                            onClick={() => handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal)}
                                        >
                                            <Trash2 size={16} className="mr-1"/>
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="overflow-x-auto border border-gray-200 rounded-lg"
                                 style={{maxHeight: '60vh', overflowY: 'auto'}}>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Product
                                        </th>
                                        <th scope="col"
                                            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category
                                        </th>
                                        <th scope="col"
                                            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Price
                                        </th>
                                        <th scope="col"
                                            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock
                                        </th>
                                        <th scope="col"
                                            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-20 w-20 flex-shrink-0">
                                                        <img className="h-20 w-20 rounded-full object-cover"
                                                             src={product.image}
                                                             alt={product.name}/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        {product.isNew && <span
                                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">New</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{product.category}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div
                                                    className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{product.stock}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    className="text-white bg-terciary hover:bg-terciary-light px-3 py-1 rounded-md inline-flex items-center"
                                                    onClick={() => handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal)}
                                                >
                                                    <Trash2 size={16} className="mr-1"/>
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
            <div>
                {/* Selected Product Section */}
                {selectedProduct && showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-40">
                        <div
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-lg">
                            <div
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                                <h3 className="text-lg font-medium text-gray-900">Selected Product</h3>
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
                                    <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">Category: {selectedProduct.category}</p>
                                    <p className="text-sm text-gray-500">Price:
                                        ${selectedProduct.price.toFixed(2)} -
                                        Stock: {selectedProduct.stock}</p>
                                    <div className="mt-3">
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="bg-terciary hover:bg-terciary-light text-white px-4 py-2 rounded-md inline-flex items-center"
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
