import {XMarkIcon, CheckCircleIcon} from '@heroicons/react/24/outline';
import {useCart} from '../../context/CartContext.jsx';
import styles from '../../styles/CartSidebar.module.css';
import {useState} from 'react';

// Componente del modal de éxito de la compra
function CheckoutSuccessModal({isOpen, onClose, orderDetails}) {
    if (!isOpen) return null; // No renderiza si no está abierto

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                <div className="text-center">
                    <div
                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                        <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400"/>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        ¡Pedido Confirmado!
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                    </p>

                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 mb-6">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Productos comprados:
                            </p>
                            {orderDetails?.items?.map(item => (
                                <p key={item.id} className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                                    - {item.name} (x{item.quantity}) - ${item.price.toFixed(2)} c/u
                                </p>
                            ))}
                            <p className="text-lg font-bold text-gray-800 dark:text-white mt-2">
                                Total: ${orderDetails?.total?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary dark:bg-primary-dark dark:hover:bg-terciary-dark transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente de la barra lateral del carrito de compras
export default function CartSidebar({isOpen, onClose}) {
    // Uso del contexto del carrito para acceder a los ítems, funciones y estado
    const {cart, removeFromCart, updateQuantity, getTotalPrice, clearCart} = useCart();
    // Estado para controlar si el proceso de checkout está en curso
    const [isProcessing, setIsProcessing] = useState(false);
    // Estado para mostrar el modal de éxito de la compra
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Estado para almacenar los detalles del pedido a mostrar en el modal
    const [orderDetails, setOrderDetails] = useState(null);

    // Maneja el clic en el botón de checkout
    const handleCheckout = async () => {
        setIsProcessing(true); // Activa el estado de procesamiento
        try {
            // Simula una llamada a la API para procesar el pedido
            // En un entorno real, aquí se enviaría el carrito a un backend
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simula un retraso de 2 segundos

            // Prepara los detalles del pedido para el modal de éxito
            setOrderDetails({
                items: cart,
                total: getTotalPrice(),
            });

            clearCart(); // Vacía el carrito después de la compra simulada
            setShowSuccessModal(true); // Muestra el modal de éxito
            onClose(); // Cierra la barra lateral del carrito
        } catch (error) {
            console.error('Error durante el checkout:', error);
            // Aquí se manejaría el error (ej. mostrar un mensaje al usuario)
        } finally {
            setIsProcessing(false); // Desactiva el estado de procesamiento
        }
    };

    // Cierra el modal de éxito y reinicia los detalles del pedido
    const handleModalClose = () => {
        setShowSuccessModal(false);
        setOrderDetails(null);
    };

    return (
        <>
            {/* Overlay oscuro para cuando la barra lateral está abierta */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                onClick={onClose} // Cierra la barra lateral al hacer clic en el overlay
            ></div>

            {/* Barra lateral del carrito */}
            <div
                className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''} dark:bg-zinc-800 dark:text-white`}
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-zinc-700">
                    <h2 className="text-xl font-semibold">Tu Carrito</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                        <XMarkIcon className="h-6 w-6"/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">El carrito está vacío.</p>
                    ) : (
                        <ul>
                            {cart.map(item => (
                                <li key={item.id} className="flex items-center py-3 border-b last:border-b-0 dark:border-zinc-700">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity === 1}
                                                className="px-2 py-1 border rounded-md dark:border-zinc-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2 text-gray-800 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 border rounded-md dark:border-zinc-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-4 border-t dark:border-zinc-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isProcessing}
                        className={`mt-4 w-full px-6 py-3 rounded-md transition-all duration-200 font-medium
                                ${cart.length === 0 || isProcessing
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-secondary dark:bg-primary-dark dark:hover:bg-terciary-dark hover:shadow-lg transform hover:scale-[1.02]'
                        }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            'Comprar'
                        )}
                    </button>
                </div>
            </div>

            {/* Renderiza el modal de éxito */}
            <CheckoutSuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                orderDetails={orderDetails}
            />
        </>
    );
}
