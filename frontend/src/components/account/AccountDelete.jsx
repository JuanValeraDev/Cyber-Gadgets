import {useState} from 'react';
import {Trash2, AlertTriangle, Search, X, ChevronDown} from 'lucide-react';
import {API_URL, useFetchProducts, useFetchIsMobile} from "../../hooks/Hooks.jsx";
import {categories} from "../../categoriesList.js"


export default function AccountDelete() {

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState({show: false, message: '', isError: false});
    const [isDeleting, setIsDeleting] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false)


    // Filtered products based on search term and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setDropdownOpen(false);
    };

    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleConfirmDelete = () => {
        if (!selectedProduct) return;

        setIsDeleting(true);

        // Simulate API call
        setTimeout(() => {
            // Remove the product from the list
            const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
            setProducts(updatedProducts);

            // Show success message
            setDeleteStatus({
                show: true,
                message: `"${selectedProduct.name}" has been deleted successfully`,
                isError: false
            });

            // Reset states
            setIsDeleting(false);
            setShowConfirmation(false);
            setSelectedProduct(null);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setDeleteStatus({show: false, message: '', isError: false});
            }, 3000);
        }, 1500);
    };

    const handleClearSelection = () => {
        setSelectedProduct(null);
    };
    useFetchProducts(API_URL, setProducts)
    useFetchIsMobile(setIsMobile)

    return (
        <div className="bg-white rounded-lg shadow-lg p-6  mx-auto mt-5">
            <div className="flex justify-between items-center mb-6">
                {deleteStatus.show && (
                    <div
                        className={`${deleteStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-4 py-2 rounded-md flex items-center`}>
                        <span className="font-medium">{deleteStatus.message}</span>
                    </div>
                )}
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Search products by name or description..."
                            value={searchTerm}
                            onChange={handleSearch}
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
                isMobile ? (
                    <div className="mb-6 grid gap-4"  style={{maxHeight: '60vh', overflowY: 'auto'}}>>
                        {filteredProducts.map((product) => (
                            <div key={product.id}
                                 className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
                                <div className="flex items-center mb-2">
                                    <img className="h-14 w-14 rounded-full object-cover" src={product.imageUrl}
                                         alt={product.name}/>
                                    <div className="ml-4 flex-1">
                                        <div className="text-base font-medium text-gray-900">{product.name}</div>
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
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <Trash2 size={16} className="mr-1"/>
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mb-6 overflow-hidden border border-gray-200 rounded-lg"
                         style={{maxHeight: '60vh', overflowY: 'auto'}}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover"
                                                     src={product.imageUrl}
                                                     alt={product.name}/>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                {product.isNew && <span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">New</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.stock}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-white bg-terciary hover:bg-terciary-light px-3 py-1 rounded-md inline-flex items-center"
                                            onClick={() => handleProductSelect(product)}
                                        >
                                            <Trash2 size={16} className="mr-1"/>
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>)) : (
                <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
            )}

            {/* Selected Product Section */}
            {selectedProduct && !showConfirmation && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Selected Product</h3>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={handleClearSelection}
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    <div className="flex items-start">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name}
                             className="w-20 h-20 object-cover rounded-md"/>
                        <div className="ml-4">
                            <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                            <p className="text-sm text-gray-500 mt-1">Category: {selectedProduct.category}</p>
                            <p className="text-sm text-gray-500">Price: ${selectedProduct.price.toFixed(2)} -
                                Stock: {selectedProduct.stock}</p>
                            <div className="mt-3">
                                <button
                                    onClick={handleDeleteClick}
                                    className="bg-terciary hover:bg-terciary-light text-white px-4 py-2 rounded-md inline-flex items-center"
                                >
                                    <Trash2 size={16} className="mr-2"/>
                                    Delete This Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-slide-in">
                        <div className="flex items-center justify-center text-terciary mb-4">
                            <AlertTriangle size={48}/>
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to delete <span
                            className="font-semibold">&#34;{selectedProduct.name}&#34;</span>? This action cannot be
                            undone.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-terciary text-white rounded-md shadow-sm text-sm font-medium hover:bg-terciary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terciary"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Trash2 size={16} className="mr-2"/>
                                        Confirm Delete
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
