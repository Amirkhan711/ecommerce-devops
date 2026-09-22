import { useState, useEffect } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        let isMounted = true;
        const fetchCart = async () => {
            try {
                setLoading(true);
                const res = await cartAPI.getCart(user.id);
                if (isMounted) {
                    setCart(res.data);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch cart', err);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCart();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            alert('Please login to add to cart');
            return;
        }

        try {
            const res = await cartAPI.addItem(user.id, {
                productId: product.id,
                quantity,
                price: product.price
            });
            setCart(res.data);
            alert('Added to cart!');
        } catch (err) {
            console.error('Failed to add to cart', err);
            alert('Failed to add to cart');
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            await cartAPI.clearCart(user.id);
            setCart({ items: [], total: 0 });
        } catch (err) {
            console.error('Failed to clear cart', err);
        }
    };

    const currentCart = user ? cart : { items: [], total: 0 };

    return (
        <CartContext.Provider value={{ cart: currentCart, loading, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
