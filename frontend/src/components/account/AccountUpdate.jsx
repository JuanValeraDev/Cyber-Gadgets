import {useState, useEffect} from 'react';
import {Save, RefreshCw, X, ImagePlus, ChevronDown} from 'lucide-react';
import {API_URL, useFetchProducts} from "../../hooks/Hooks.jsx";


export default function AccountUpdate() {

    const [products, setProducts] = useState([])
    const [selectedProductId, setSelectedProductId] = useState('');
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

    const categories = [
        "Electronics",
        "Clothing",
        "Home & Kitchen",
        "Books",
        "Beauty & Personal Care",
        "Toys & Games",
        "Sports & Outdoors"
    ];

    useFetchProducts(API_URL, setProducts);

    useEffect(() => {
        // When selected product changes, load its data
        if (selectedProductId) {
            const product = products.find(p => p.id === parseInt(selectedProductId));
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
                setImagePreview(product.imageUrl);
                setHasChanges(false);
            }
        }
    }, [selectedProductId]);

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

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Product updated:', formData);
            console.log('Product ID:', selectedProductId);
            setSubmitting(false);
            setShowSuccess(true);
            setHasChanges(false);
            setOriginalData({...formData});

            // Reset success message after delay
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }, 1500);
    };

    const handleReset = () => {
        if (originalData) {
            setFormData({...originalData});
            setHasChanges(false);

            // If there was an image in the original data, reset to that
            const product = products.find(p => p.id === parseInt(selectedProductId));
            if (product) {
                setImagePreview(product.imageUrl);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Update Product</h2>
                {showSuccess && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center">
                        <span className="font-medium">Product updated successfully!</span>
                    </div>
                )}
            </div>

            {/* Product Selection Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product to Update
                </label>
                <div className="relative">
                    <div
                        className="w-full px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer bg-white"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
            <span className={selectedProductId ? 'text-gray-900' : 'text-gray-500'}>
              {selectedProductId
                  ? products.find(p => p.id === parseInt(selectedProductId))?.name
                  : 'Select a product'}
            </span>
                        <ChevronDown size={20}
                                     className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}/>
                    </div>

                    {dropdownOpen && (
                        <div
                            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="px-4 py-2 hover:bg-secondary hover:text-white cursor-pointer"
                                    onClick={() => {
                                        setSelectedProductId(product.id.toString());
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {product.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProductId && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Enter product name"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Available quantity"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                >
                                    <option value="" disabled>Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
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
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                                    Mark as New Product
                                </label>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Enter product description"
                                ></textarea>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Image
                                </label>
                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
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
                                                       className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-light focus-within:outline-none">
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
                            disabled={!hasChanges}
                            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${hasChanges ? 'text-gray-700 bg-white hover:bg-gray-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
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
                            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-secondary-light' : hasChanges ? 'bg-primary hover:bg-primary-light' : 'bg-gray-400 cursor-not-allowed'}`}
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
            )}
        </div>
    );
}
