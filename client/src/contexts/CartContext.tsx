import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
    inventory: {
      quantity: number;
      trackQuantity: boolean;
    };
    status: string;
  };
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  addedAt: Date;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { productId: string; quantity: number; variant?: any } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variant?: any } };

interface CartContextType {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, variant?: any) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, variant?: any) => Promise<void>;
  removeFromCart: (productId: string, variant?: any) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null };
    case 'UPDATE_ITEM_QUANTITY':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.product._id === action.payload.productId &&
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            item =>
              !(item.product._id === action.payload.productId &&
                JSON.stringify(item.variant) === JSON.stringify(action.payload.variant))
          ),
        },
      };
    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('/api/cart');
      dispatch({ type: 'SET_CART', payload: response.data.cart });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId: string, quantity = 1, variant?: any) => {
    try {
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity,
        variant,
      });
      dispatch({ type: 'SET_CART', payload: response.data.cart });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add item to cart' });
      throw error;
    }
  };

  const updateCartItem = async (productId: string, quantity: number, variant?: any) => {
    try {
      // Optimistically update the UI
      dispatch({
        type: 'UPDATE_ITEM_QUANTITY',
        payload: { productId, quantity, variant },
      });

      const response = await axios.put('/api/cart/update', {
        productId,
        quantity,
        variant,
      });
      dispatch({ type: 'SET_CART', payload: response.data.cart });
    } catch (error: any) {
      // Revert optimistic update and show error
      fetchCart();
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update cart' });
      throw error;
    }
  };

  const removeFromCart = async (productId: string, variant?: any) => {
    try {
      // Optimistically update the UI
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { productId, variant },
      });

      const response = await axios.delete(`/api/cart/remove/${productId}`, {
        data: { variant },
      });
      dispatch({ type: 'SET_CART', payload: response.data.cart });
    } catch (error: any) {
      // Revert optimistic update and show error
      fetchCart();
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to remove item from cart' });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to clear cart' });
      throw error;
    }
  };

  const getCartItemsCount = () => {
    return state.cart?.totalItems || 0;
  };

  const getCartTotal = () => {
    return state.cart?.totalAmount || 0;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartItemsCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};