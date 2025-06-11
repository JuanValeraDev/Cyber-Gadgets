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
    // Estado para mostrar el mensaje de eliminación (éxito/error)
    const [deleteStatus, setDeleteStatus] = useState({show: false, message: '', isError: false});
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false)

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
        showModal, setShowModal
    } = useProductState()

    // Hook para cargar productos al montar el componente
    useFetchProducts(API_URL, setProducts, showModal);

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

    // Maneja la selección de un producto del dropdown
    const handleProductSelectAndClose = (product) => {
        handleProductSelect(product, setSelectedProduct, setDropdownOpen);
    };

    // Abre/cierra el dropdown de productos
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Maneja el cambio en el input de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setDropdownOpen(true); // Abre el dropdown al escribir
    };

    // Limpia la búsqueda y el producto seleccionado
    const clearSearch = () => {
        setSearchTerm('');
        setSelectedProduct(null);
        setDeleteStatus({show: false, message: '', isError: false});
    };

    // Cierra el modal de confirmación de eliminación
    const closeModal = () => {
        setShowModal(false);
    };

    // Muestra el modal de confirmación antes de eliminar
    const handleDeleteClick = () => {
        if (selectedProduct) {
            setShowModal(true);
        }
    };

    // Confirma y ejecuta la eliminación del producto
    const handleConfirmDelete = async () => {
        if (!selectedProduct || !selectedProduct.id) {
            setDeleteStatus({show: true, message: 'No hay producto seleccionado para eliminar.', isError: true});
            setShowModal(false);
            return;
        }

        try {
            // Elimina el producto de la base de datos Supabase
            const {error} = await supabase
                .from('products')
                .delete()
                .eq('id', selectedProduct.id);

            if (error) {
                throw error;
            }

            // Elimina la imagen asociada del almacenamiento de Supabase
            if (selectedProduct.image_url) {
                const fileName = selectedProduct.image_url.split('/').pop();
                const {error: storageError} = await supabase.storage
                    .from('product-images')
                    .remove([fileName]);

                if (storageError) {
                    console.error('Error al eliminar la imagen del almacenamiento:', storageError.message);
                    // Decide si quieres lanzar este error o solo loggearlo
                }
            }

            // Actualiza la lista de productos después de la eliminación
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setSelectedProduct(null); // Limpia el producto seleccionado
            setShowModal(false); // Cierra el modal
            setDeleteStatus({show: true, message: 'Producto eliminado con éxito.', isError: false}); // Muestra mensaje de éxito

        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
            setDeleteStatus({show: true, message: `Error al eliminar el producto: ${error.message}`, isError: true}); // Muestra mensaje de error
            setShowModal(false);
        }
    };


    return (
        <>
            <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Eliminar Producto</h2>

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
                            onFocus={() => setDropdownOpen(true)} // Abre el dropdown al enfocar
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

                {/* Mensajes de estado (éxito/error) */}
                {deleteStatus.show && (
                    <div className={`p-3 rounded-md mb-4 ${deleteStatus.isError ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
                        {deleteStatus.message}
                    </div>
                )}

                {/* Información del producto seleccionado y botón de eliminación */}
                {selectedProduct && (
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                            Producto Seleccionado
                        </h3>
                        <div className="flex items-center">
                            <img src={selectedProduct.image_url} alt={selectedProduct.name}
                                 className="w-20 h-20 object-cover rounded-md mr-4"/>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-300">{selectedProduct.name}</p>
                                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Categoría: {selectedProduct.category}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Precio:
                                    ${selectedProduct.price.toFixed(2)} -
                                    Stock: {selectedProduct.stock}</p>
                                <div className="mt-3">
                                    <button
                                        onClick={handleDeleteClick}
                                        className="bg-primary hover:bg-secondary dark:bg-primary-dark hover:dark:bg-terciary-dark text-white px-4 py-2 rounded-md inline-flex items-center"
                                    >
                                        <Trash2 size={16} className="mr-2"/>
                                        Eliminar Este Producto
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación de eliminación */}
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
                         aria-modal="true">
                        <div
                            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                 aria-hidden="true"></div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                  aria-hidden="true">&#8203;</span>

                            <div
                                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div
                                            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <Trash2 className="h-6 w-6 text-red-600"/>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                                                id="modal-title">
                                                Eliminar Producto
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ¿Estás seguro de que quieres eliminar el producto <span
                                                    className="font-bold">{selectedProduct?.name}</span>? Esta acción no se puede deshacer.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleConfirmDelete}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
