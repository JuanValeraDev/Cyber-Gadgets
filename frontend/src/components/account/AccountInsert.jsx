import {useState} from 'react';
import {Save, X, ImagePlus} from 'lucide-react';
import {categories} from '../../categoriesList.js'
import {handleFormChange, handleImageInputChange, supabase} from "../../hooks/Hooks.jsx";

export default function AccountInsert() {
    // Estado para los datos del formulario de un nuevo producto
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        isNew: false,
        image: null
    });

    // Estado para la previsualización de la imagen
    const [imagePreview, setImagePreview] = useState(null);
    // Estado para controlar el estado de envío del formulario
    const [submitting, setSubmitting] = useState(false);
    // Estado para mostrar mensaje de éxito al guardar
    const [showSuccess, setShowSuccess] = useState(false);
    // Estado para el progreso de la subida de la imagen (aunque no se usa visualmente, puede ser útil)
    const [uploadProgress, setUploadProgress] = useState(0);

    // Manejadores de cambio para campos de formulario e input de imagen
    const handleChange = handleFormChange(setFormData);
    const handleImageChange = handleImageInputChange(setFormData, setImagePreview);

    // Función para subir imagen a Supabase Storage
    const uploadImage = async (file) => {
        if (!file) return null;

        try {
            // Generar nombre único para la imagen usando un timestamp
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const fileName = `product_${timestamp}.${fileExtension}`;

            console.log('Subiendo imagen:', fileName);

            // Subir archivo a Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images') // Asegúrate de que este bucket existe
                .upload(fileName, file);

            if (error) {
                throw error;
            }

            // Construir la URL pública de la imagen subida
            const { publicUrl } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName).data;

            console.log('Imagen subida exitosamente. URL:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error al subir imagen:', error.message);
            return null;
        }
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setShowSuccess(false);

        let imageUrl = null;
        if (formData.image) {
            imageUrl = await uploadImage(formData.image);
            if (!imageUrl) {
                setSubmitting(false);
                alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
                return;
            }
        }

        try {
            // Inserta el nuevo producto en la tabla 'products' de Supabase
            const { data, error } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        stock: parseInt(formData.stock, 10),
                        category: formData.category,
                        isNew: formData.isNew,
                        image_url: imageUrl, // Guarda la URL de la imagen
                        created_at: new Date().toISOString(), // Fecha de creación
                    },
                ]);

            if (error) {
                throw error;
            }

            console.log('Producto insertado con éxito:', data);
            setShowSuccess(true);
            // Reinicia el formulario después de un envío exitoso
            setFormData({
                name: '',
                price: '',
                description: '',
                stock: '',
                category: '',
                isNew: false,
                image: null
            });
            setImagePreview(null); // Limpia la previsualización de la imagen
            setTimeout(() => setShowSuccess(false), 3000); // Oculta el mensaje de éxito después de 3 segundos
        } catch (error) {
            console.error('Error al insertar producto:', error.message);
            alert(`Error al insertar producto: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Insertar Nuevo Producto</h2>

            {/* Mensaje de éxito al guardar */}
            {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 dark:bg-green-800 dark:border-green-700 dark:text-green-100" role="alert">
                    <strong className="font-bold">¡Éxito!</strong>
                    <span className="block sm:inline"> El producto ha sido guardado correctamente.</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowSuccess(false)}>
                        <X className="h-6 w-6 fill-current"/>
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo de Nombre del Producto */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Producto</label>
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

                    {/* Campo de Precio */}
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

                    {/* Campo de Descripción */}
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

                    {/* Campo de Stock */}
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

                    {/* Campo de Categoría */}
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
                </div>

                {/* Botón de Enviar Formulario */}
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'} dark:bg-primary-dark`}
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
                                {formData.image ? 'Subiendo...' : 'Procesando...'}
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2 "/>
                                Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
