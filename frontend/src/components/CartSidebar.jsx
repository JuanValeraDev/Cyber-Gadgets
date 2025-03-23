import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import styles from '../styles/CartSidebar.module.css';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
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
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md" />
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
                      <span className="mx-2 text-gray-700 dark:text-gray-300">{item.quantity}</span>
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
            className="mt-4 w-full bg-primary text-white px-6 py-3 rounded-md 
                     hover:bg-blue-600 transition-colors duration-200"
            onClick={() => {/* Implement checkout */}}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}