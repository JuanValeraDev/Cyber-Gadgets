import {useState, useEffect} from 'react';
import {Save, RefreshCw, X, ImagePlus, ChevronDown, Search, ArrowBigUp} from 'lucide-react';
import {
    API_URL, handleProductSelect,
    supabase,
    useFetchProducts,
    useProductState
} from "../../hooks/Hooks.jsx";
import {handleFormChange, handleImageInputChange} from '../../hooks/Hooks.jsx';
import {categories} from "../../categoriesList.js";


export default function AccountUpdate() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        isNew: false,
        image: null
    });

    const [originalData, setOriginalData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const {
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
    } = useProductState()

    useFetchProducts(API_URL, setProducts);
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

    useEffect(() => {
        // When selected product changes, load its data
        if (selectedProduct) {
            const product = products.find(p => p.id === parseInt(selectedProduct.id));
            if (product) {
                const newFormData = {
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stock: product.stock,
                    category: product.category,
                    isNew: product.isNew,
                    image: null
                };

                setFormData(newFormData);
                setOriginalData(newFormData);
                setImagePreview(product.image);
                setHasChanges(false);
            }
        }
    }, [selectedProduct]);

    useEffect(() => {
        // Check if form has changes compared to original data
        if (originalData) {
            const isChanged =
                formData.name !== originalData.name ||
                parseFloat(formData.price) !== parseFloat(originalData.price) ||
                formData.description !== originalData.description ||
                parseInt(formData.stock) !== parseInt(originalData.stock) ||
                formData.category !== originalData.category ||
                formData.isNew !== originalData.isNew ||
                formData.image !== originalData.image;

            setHasChanges(isChanged);
        }
    }, [formData, originalData]);


    const handleChange = handleFormChange(setFormData);
    const handleImageChange = handleImageInputChange(setFormData, setImagePreview);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const {data, error} = await supabase
            .from('products')
            .update(
                {
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    stock: parseInt(formData.stock),
                    category: formData.category,
                    isNew: Boolean(formData.isNew),
                    image: formData.image
                }
            ).eq('id', parseInt(selectedProduct.id));
        if (error) {
            console.log("Error: " + error.name + error.message)
        }
        setSubmitting(false);
        setShowSuccess(true);
        setShowModal(false)
        setTimeout(() => {
            setHasChanges(false);
            setShowSuccess(false)
        }, 1000)
    };

    const handleReset = () => {
        if (originalData) {
            setFormData({...originalData});
            setHasChanges(false);

            // If there was an image in the original data, reset to that
            const product = products.find(p => p.id === parseInt(selectedProduct.id));
            if (product) {
                setImagePreview(product.image);
            }
        }
    };

    return (<>
            {!showModal &&
                <div
                    className="bg-white rounded-lg shadow-lg px-20 py-14 max-w-full mx-auto mt-6 mb-6 dark:bg-zinc-700 dark:border-2 dark:border-terciary-dark ">
                    <div className="flex justify-between items-center mb-6">
                        {showSuccess && (
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center">
                                <span className="font-medium">Product updated successfully!</span>
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
                    <span className={categoryFilter ? 'text-gray-900 dark:text-gray-200  h-5  overflow-hidden whitespace-nowrap text-ellipsis' : 'text-gray-500'}>
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
                                             className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col ">
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
                                                <ArrowBigUp size={16} className="mr-1"/>
                                                Update
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:block ">
                                <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-zinc-500 dark:border-2"
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
                                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-zinc-500" >
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 dark:bg-zinc-800 ">
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
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{product.category}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div
                                                        className="text-sm text-gray-900 dark:text-gray-300">${product.price.toFixed(2)}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-300">{product.stock}</div>
                                                </td>
                                                <td className="xl:pe-20 px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="text-white bg-primary hover:bg-secondary dark:bg-primary-dark hover:dark:bg-terciary-dark px-3 py-1 rounded-md inline-flex items-center"
                                                        onClick={() => handleProductSelect(product, setSelectedProduct, setDropdownOpen, setShowModal)}
                                                    >
                                                        <ArrowBigUp size={16} className="mr-1"/>
                                                        Update
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


            {selectedProduct && showModal && (
                <div
                    className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto max-h-screen overflow-y-auto mt-6 dark:bg-zinc-700">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary
                                                                        dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                        placeholder="Enter product name"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary                                 dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary                                dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                        placeholder="Available quantity"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category"
                                           className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white                                 dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                    >
                                        <option value="">Select category</option>
                                        {categories.categories.map((category) => {
                                            if (category !== "All") {
                                                return <option key={category} value={category}>{category}</option>
                                            }
                                        })}
                                    </select>
                                </div>

                                {/* Is New Toggle */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isNew"
                                        name="isNew"
                                        checked={formData.isNew}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded                                 dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                    />
                                    <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700 dark:text-secondary-dark">
                                        Mark as New Product
                                    </label>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-6">
                                {/* Description */}
                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="5"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary                                 dark:bg-gray-950 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"

                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-secondary-dark">
                                        Product Image
                                    </label>
                                    <div
                                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${imagePreview ? 'border-primary bg-zinc-200 dark:border-terciary-dark ' : 'border-gray-300 hover:border-gray-400'} dark:bg-zinc-800`}>
                                        {imagePreview ? (
                                            <div className="space-y-2 text-center">
                                                <img src={imagePreview} alt="Preview"
                                                     className="mx-auto h-32 object-contain"/>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setFormData({...formData, image: null});
                                                    }}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <X size={16} className="mr-1"/>
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-center">
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="image-upload"
                                                           className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-light focus-within:outline-none dark:text-secondary-dark">
                                                        <div className="flex flex-col items-center">
                                                            <ImagePlus className="mx-auto h-12 w-12 text-gray-400"/>
                                                            <span>Upload a file</span>
                                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to
                                                                10MB</p>
                                                        </div>
                                                        <input
                                                            id="image-upload"
                                                            name="image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center dark:bg-zinc-900 dark:text-gray-200"
                                onClick={() => setShowModal(false)}
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                                Back to List
                            </button>
                            <button
                                type="button"
                                disabled={!hasChanges}
                                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${hasChanges ? 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-200' : 'text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-zinc-700'} `}
                                onClick={handleReset}
                            >
                                <div className="flex items-center">
                                    <RefreshCw size={16} className="mr-2"/>
                                    Reset Changes
                                </div>
                            </button>
                            <button
                                type="button"
                                disabled={submitting || !hasChanges}
                                onClick={handleSubmit}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-secondary-light' : hasChanges ? 'bg-primary hover:bg-primary-light' : 'bg-gray-400 cursor-not-allowed dark:bg-gray-400 hover:dark:bg-gray-400'} dark:bg-primary-dark hover:dark:bg-terciary-dark`}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2"/>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
