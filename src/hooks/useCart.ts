import { useCartContext } from '../context/CartContext';

// Alias conveniente para acceder al contexto del carrito
function useCart() {
  return useCartContext();
}

export default useCart;
