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
    // Estado para los datos del formulario de actualización
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        isNew: false,
        image: null
    });

    // Estado para almacenar los datos originales del producto seleccionado
    const [originalData, setOriginalData] = useState(null);
    // Estado para la previsualización de la imagen
    const [imagePreview, setImagePreview] = useState(null);
    // Estado para controlar el estado de envío del formulario
    const [submitting, setSubmitting] = useState(false);
    // Estado para mostrar mensaje de éxito al guardar
    const [showSuccess, setShowSuccess] = useState(false);
    // Estado para indicar si hay cambios en el formulario
    const [hasChanges, setHasChanges] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    // Desestructuración de estados y funciones del hook useProductState
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

    // Hook para cargar productos al montar el componente
    useFetchProducts(API_URL, setProducts);
    useEffect(() => {
        // Filtra productos por término de búsqueda y categoría
        setFilteredProducts(
            products.filter(product => {
                const matchesSearch =
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
                return matchesSearch && (matchesCategory);
            })
        );
    }, [products, searchTerm, categoryFilter]);

    // Actualiza el formulario y la previsualización de imagen cuando se selecciona un producto
    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name || '',
                price: selectedProduct.price || '',
                description: selectedProduct.description || '',
                stock: selectedProduct.stock || '',
                category: selectedProduct.category || '',
                isNew: selectedProduct.isNew || false,
                image: null // La imagen no se carga en el formData inicial para evitar re-subidas innecesarias
            });
            // Establece la URL de la imagen actual para la previsualización
            setImagePreview(selectedProduct.image_url || null);
            // Guarda una copia de los datos originales para comparar cambios
            setOriginalData({
                name: selectedProduct.name || '',
                price: selectedProduct.price || '',
                description: selectedProduct.description || '',
                stock: selectedProduct.stock || '',
                category: selectedProduct.category || '',
                isNew: selectedProduct.isNew || false,
                image_url: selectedProduct.image_url || null // Guardar la URL para comparación
            });
            setHasChanges(false); // Inicialmente no hay cambios
        }
    }, [selectedProduct]);

    // Comprueba si hay cambios entre los datos del formulario y los datos originales
    useEffect(() => {
        if (originalData && formData) {
            const currentData = {
                name: formData.name,
                price: parseFloat(formData.price), // Convertir a número para comparación
                description: formData.description,
                stock: parseInt(formData.stock, 10), // Convertir a número para comparación
                category: formData.category,
                isNew: formData.isNew,
                image_url: imagePreview // Usar la URL de la previsualización para la imagen
            };

            // Compara cada campo para detectar cambios
            const changed = Object.keys(currentData).some(key => {
                if (key === 'image_url') {
                    // Si se seleccionó un nuevo archivo, siempre hay un cambio
                    return formData.image !== null || currentData[key] !== originalData[key];
                }
                return currentData[key] !== originalData[key];
            });
            setHasChanges(changed);
        }
    }, [formData, originalData, imagePreview]);

    // Manejadores de cambio para campos de formulario e input de imagen
    const handleChange = handleFormChange(setFormData);
    const handleImageChange = handleImageInputChange(setFormData, setImagePreview);

    // Maneja la selección de un producto del dropdown
    const handleProductSelectAndClose = (product) => {
        handleProductSelect(product, setSelectedProduct, setDropdownOpen);
        setSearchTerm(product.name); // Setea el término de búsqueda al nombre del producto
    };

    // Abre/cierra el dropdown de productos
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Maneja el cambio en el input de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setDropdownOpen(true); // Abre el dropdown al escribir
        setSelectedProduct(null); // Deselecciona el producto al cambiar la búsqueda
        setImagePreview(null); // Limpia la previsualización de la imagen
    };

    // Limpia la búsqueda y el producto seleccionado
    const clearSearch = () => {
        setSearchTerm('');
        setSelectedProduct(null);
        setFormData({ // Reinicia el formulario
            name: '', price: '', description: '', stock: '', category: '', isNew: false, image: null
        });
        setImagePreview(null); // Limpia la previsualización
        setOriginalData(null); // Limpia los datos originales
        setShowSuccess(false); // Oculta el mensaje de éxito
        setHasChanges(false); // Restablece el estado de cambios
    };

    // Función para subir una nueva imagen o mantener la existente
    const uploadImage = async (file) => {
        if (!file) return imagePreview; // Si no hay nuevo archivo, devuelve la URL existente

        try {
            // Generar nombre único para la imagen
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const fileName = `product_${timestamp}.${fileExtension}`;

            console.log('Subiendo nueva imagen:', fileName);

            // Eliminar la imagen antigua si existe y es diferente a la nueva
            if (selectedProduct?.image_url && selectedProduct.image_url !== imagePreview) {
                const oldFileName = selectedProduct.image_url.split('/').pop();
                const {error: removeError} = await supabase.storage
                    .from('product-images')
                    .remove([oldFileName]);
                if (removeError) {
                    console.error('Error al eliminar imagen antigua:', removeError.message);
                }
            }

            // Subir el nuevo archivo
            const {data, error} = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (error) {
                throw error;
            }

            const {publicUrl} = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName).data;

            console.log('Nueva imagen subida exitosamente. URL:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error al subir imagen:', error.message);
            return null;
        }
    };


    // Manejador para el envío del formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setShowSuccess(false);

        if (!selectedProduct) {
            alert('Por favor, selecciona un producto para actualizar.');
            setSubmitting(false);
            return;
        }

        let newImageUrl = imagePreview; // Por defecto, se mantiene la imagen actual
        if (formData.image) { // Si se ha seleccionado una nueva imagen
            newImageUrl = await uploadImage(formData.image);
            if (!newImageUrl) {
                setSubmitting(false);
                alert('Error al subir la nueva imagen. Por favor, inténtalo de nuevo.');
                return;
            }
        }

        try {
            // Actualiza el producto en la base de datos Supabase
            const {data, error} = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    stock: parseInt(formData.stock, 10),
                    category: formData.category,
                    isNew: formData.isNew,
                    image_url: newImageUrl, // Actualiza la URL de la imagen
                    updated_at: new Date().toISOString(), // Fecha de actualización
                })
                .eq('id', selectedProduct.id); // Condición para actualizar el producto correcto

            if (error) {
                throw error;
            }

            console.log('Producto actualizado con éxito:', data);
            setShowSuccess(true);
            setOriginalData({ ...formData, image_url: newImageUrl, image:null }); // Actualiza los datos originales con los nuevos valores, resetea image
            setSelectedProduct(prev => ({...prev, ...formData, image_url: newImageUrl})); // Actualiza selectedProduct
            setFormData(prev => ({...prev, image: null})); // Limpia el archivo de imagen del formData
            setTimeout(() => setShowSuccess(false), 3000); // Oculta el mensaje de éxito después de 3 segundos
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            alert(`Error al actualizar producto: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Actualizar Producto</h2>

            {/* Área de búsqueda y selección de producto */}
            <div className="mb-4 relative">
                <label htmlFor="search-product" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Buscar y seleccionar producto:
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="text"
                        id="search-product"
                        className="form-input block w-full pl-10 pr-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 rounded-md"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setDropdownOpen(true)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400"/>
                    </div>
                    {searchTerm && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" onClick={clearSearch}/>
                        </div>
                    )}
                </div>

                {/* Dropdown de resultados de búsqueda */}
                {dropdownOpen && filteredProducts.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
                        {filteredProducts.map(product => (
                            <li
                                key={product.id}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                                onClick={() => handleProductSelectAndClose(product)}
                            >
                                <img src={product.image_url} alt={product.name}
                                     className="w-10 h-10 object-cover rounded-md mr-3"/>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">{product.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Mensaje de éxito al guardar */}
            {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 dark:bg-green-800 dark:border-green-700 dark:text-green-100" role="alert">
                    <strong className="font-bold">¡Éxito!</strong>
                    <span className="block sm:inline"> El producto ha sido actualizado correctamente.</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowSuccess(false)}>
                        <X className="h-6 w-6 fill-current"/>
                    </span>
                </div>
            )}

            {/* Formulario de actualización de producto */}
            {selectedProduct && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                        Editar Producto: {selectedProduct.name}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Campo Precio */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Campo Descripción */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            ></textarea>
                        </div>

                        {/* Campo Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Campo Categoría */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                            <select
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Checkbox "Es Nuevo" */}
                        <div className="col-span-1 md:col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                name="isNew"
                                id="isNew"
                                checked={formData.isNew}
                                onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                                className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                            />
                            <label htmlFor="isNew" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Es Nuevo</label>
                        </div>

                        {/* Campo de Imagen */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen del Producto</label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-md file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-primary file:text-white
                                           hover:file:bg-secondary dark:file:bg-primary-dark dark:hover:file:bg-terciary-dark"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Previsualización de Imagen:</p>
                                    <img src={imagePreview} alt="Previsualización" className="mt-2 w-32 h-32 object-cover rounded-md shadow-sm"/>
                                </div>
                            )}
                        </div>

                        {/* Botón de Guardar Cambios */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={submitting || !hasChanges} // Deshabilita si está enviando o no hay cambios
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasChanges && !submitting ? 'bg-primary hover:bg-secondary' : 'bg-gray-400 cursor-not-allowed dark:bg-gray-400 hover:dark:bg-gray-400'} dark:bg-primary-dark hover:dark:bg-terciary-dark`}
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
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2"/>
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
