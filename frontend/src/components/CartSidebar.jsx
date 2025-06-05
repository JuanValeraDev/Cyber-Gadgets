import {XMarkIcon, CheckCircleIcon} from '@heroicons/react/24/outline';
import {useCart} from '../context/CartContext';
import styles from '../styles/CartSidebar.module.css';
import {useState} from 'react';

// Checkout Success Modal Component
function CheckoutSuccessModal({isOpen, onClose, orderDetails}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                        <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Order Confirmed!
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Thank you for your purchase. Your order has been successfully processed.
                    </p>

                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 mb-6">
                        <div className="text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Order Total:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ${orderDetails.total}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Items:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {orderDetails.itemCount}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                                <span className="font-mono text-xs text-gray-900 dark:text-white">
                                    #{orderDetails.orderId}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CartSidebar({isOpen, onClose}) {
    const {cart, removeFromCart, updateQuantity, cartTotal} = useCart();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setIsProcessing(true);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create order details
        const orderInfo = {
            total: cartTotal.toFixed(2),
            itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
            orderId: Math.random().toString(36).substr(2, 9).toUpperCase()
        };

        setOrderDetails(orderInfo);

        // Clear the cart
        cart.forEach(item => removeFromCart(item.id));

        setIsProcessing(false);
        setShowSuccessModal(true);
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        onClose(); // Close the cart sidebar too
    };

    return (
        <>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className="h-full flex flex-col bg-white dark:bg-zinc-900 shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shopping Cart</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                Your cart is empty
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id}
                                         className="flex items-center space-x-4 p-4 bg-gray-200 dark:bg-zinc-700 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-zinc-600 rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">${item.price}</p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span
                                                    className="mx-2 text-gray-700 dark:text-gray-300">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t dark:border-gray-700 p-4">
                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                            <p>Subtotal</p>
                            <p>${cartTotal.toFixed(2)}</p>
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
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Checkout'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <CheckoutSuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                orderDetails={orderDetails}
            />
        </>
    );
}
