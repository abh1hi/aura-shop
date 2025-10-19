const API_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/orders/';

/**
 * Helper function to retrieve the user's token from local storage.
 * @returns {string | null} The JWT token.
 */
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

/**
 * Creates a new order from the user's cart and provided checkout data.
 * The backend should automatically fetch the cart contents, calculate totals,
 * and create the order based on the authenticated user.
 * * NOTE: For simplicity in this frontend implementation, we will pass the total,
 * shipping, and subtotal. In a production backend, these numbers should be
 * recalculated on the server side using the cart contents for security.
 * * @param {object} orderData - { shippingAddress, paymentMethod, orderSummary }
 * @returns {Promise<object>} The newly created order object.
 */
const createOrder = async (orderData) => {
    const token = getToken();
    if (!token) throw new Error('User not authenticated to place an order.');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // Note: The structure of orderData passed here matches the fields
            // expected by orderController.js (user, shippingAddress, paymentMethod, totals)
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to place order.');
        }

        return await response.json();
    } catch (error) {
        console.error('Order creation failed:', error);
        throw error;
    }
};

/**
 * Fetches the details of a single order by its ID.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<object>} The order object.
 */
const getOrderById = async (orderId) => {
    const token = getToken();
    if (!token) throw new Error('User not authenticated to view order.');

    try {
        const response = await fetch(API_URL + orderId, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Order not found.');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch order details:', error);
        throw error;
    }
};

/**
 * Fetches all orders for the current authenticated user.
 * @returns {Promise<Array>} An array of order objects.
 */
const getMyOrders = async () => {
    const token = getToken();
    if (!token) throw new Error('User not authenticated to view orders.');

    try {
        // Assuming backend has a dedicated route like /api/orders/myorders
        const response = await fetch(API_URL + 'myorders', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders.');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw error;
    }
};


export default {
    createOrder,
    getOrderById,
    getMyOrders
};