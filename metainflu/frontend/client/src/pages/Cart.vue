<!-- File: src/views/Cart.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Shopping Cart</h1>
            </div>
        </section>

        <section class="section container">
            <div class="cart-layout">
                <div class="cart-items">
                    <div class="cart-item">
                        <img src="https://images.unsplash.com/photo-1584273142342-294256955942?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product Image">
                        <div class="item-details">
                            <h3>Classic Linen Shirt</h3>
                            <p>Size: M, Color: White</p>
                        </div>
                        <div class="item-quantity">
                            <input type="number" value="1" min="1">
                        </div>
                        <div class="item-total">$85.00</div>
                    </div>
                    <div class="cart-item">
                        <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product Image">
                        <div class="item-details">
                            <h3>Slim-Fit Denim</h3>
                            <p>Size: 32, Color: Blue</p>
                        </div>
                        <div class="item-quantity">
                            <input type="number" value="1" min="1">
                        </div>
                        <div class="item-total">$120.00</div>
                    </div>
                </div>
                <aside class="order-summary">
                    <h2>Order Summary</h2>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>$205.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>$10.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>$215.00</span>
                    </div>
                    <button class="checkout-btn">Proceed to Checkout</button>
                </aside>
            </div>
        </section>
    </div>
</template>

<style scoped>
.cart-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: flex-start;
}
.cart-items .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto auto;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--light-gray);
}
.cart-item:last-child {
    border-bottom: none;
}
.cart-item img {
    width: 100%;
    border-radius: 8px;
}
.item-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
}
.item-details p {
    margin: 0;
    color: #555;
}
.item-quantity input {
    width: 50px;
    text-align: center;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
}
.item-total {
    font-weight: 600;
    font-size: 1.2rem;
}
.order-summary {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--light-gray);
    position: sticky;
    top: 120px; /* Adjust based on header height */
}
.order-summary h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}
.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.summary-row.total {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-gray);
}
.checkout-btn {
    width: 100%;
    padding: 1rem;
    background-color: var(--c5);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-top: 1rem;
}

@media (max-width: 992px) {
    .cart-layout {
        grid-template-columns: 1fr;
    }
}
</style>

