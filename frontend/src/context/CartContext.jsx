import {createContext, useContext, useState, useEffect} from 'react';

const CartContext = createContext('cart');

export function CartProvider({children}) {
    // Inicializar carrito desde sessionStorage para persistir durante la sesión
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Guardar carrito en sessionStorage cada vez que cambie
    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            if (existingItem) {
                // Si el producto ya existe, incrementar cantidad
                return currentCart.map(item =>
                    item.id === product.id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }
            // Si es nuevo, agregarlo con cantidad 1
            return [...currentCart, {...product, quantity: 1}];
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(currentCart =>
            currentCart.map(item =>
                item.id === productId ? {...item, quantity} : item
            )
        );
    };

    // Calcular total del carrito
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Calcular número total de artículos
    const cartItemsCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotal,
            cartItemsCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
