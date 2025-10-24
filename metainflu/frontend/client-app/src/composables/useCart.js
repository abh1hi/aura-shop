// useCart.js - Cart composable for global cart state management
import { ref, computed } from 'vue'
import cartService from '../services/cartService'

// Global cart state
const cartItems = ref([])
const isLoading = ref(false)
const error = ref(null)

export const useCart = () => {
  // Computed properties
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + ((item.product?.price || 0) * (item.quantity || 0))
    }, 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  // Actions
  const fetchCart = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await cartService.getCart()
      cartItems.value = response.items || []
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (productData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await cartService.addToCart(productData)
      
      // Update local cart state
      await fetchCart()
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to add to cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await cartService.removeFromCart(itemId)
      
      // Update local cart state
      cartItems.value = cartItems.value.filter(item => item._id !== itemId)
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to remove from cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (quantity <= 0) {
        return await removeFromCart(itemId)
      }
      
      const response = await cartService.updateCartItem(itemId, quantity)
      
      // Update local cart state
      const itemIndex = cartItems.value.findIndex(item => item._id === itemId)
      if (itemIndex !== -1) {
        cartItems.value[itemIndex].quantity = quantity
      }
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to update cart item:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearCart = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await cartService.clearCart()
      cartItems.value = []
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to clear cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize cart on first use
  const initializeCart = async () => {
    try {
      await fetchCart()
    } catch (err) {
      // Silently fail if user is not authenticated
      if (!err.message.includes('401') && !err.message.includes('unauthorized')) {
        console.error('Failed to initialize cart:', err)
      }
    }
  }

  return {
    // State
    cartItems: computed(() => cartItems.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed properties
    cartCount,
    cartTotal,
    isEmpty,
    
    // Actions
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    initializeCart
  }
}