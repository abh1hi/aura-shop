<!-- File: src/views/Checkout.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Checkout</h1>
            </div>
        </section>

        <section class="section container">
            <div class="checkout-layout">
                <div class="checkout-form">
                    <section>
                        <h2>Shipping Information</h2>
                        <form>
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name">
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" id="address">
                            </div>
                            <!-- More address fields -->
                        </form>
                    </section>
                    <section>
                        <h2>Payment Details</h2>
                        <form>
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number">
                            </div>
                            <!-- More payment fields -->
                        </form>
                    </section>
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
                    <button class="place-order-btn">Place Order</button>
                </aside>
            </div>
        </section>
    </div>
</template>

<style scoped>
.checkout-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: flex-start;
}

.checkout-form h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--light-gray);
    padding-bottom: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
}

.order-summary {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--light-gray);
    position: sticky;
    top: 40px;
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

.place-order-btn {
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
    .checkout-layout {
        grid-template-columns: 1fr;
    }
}
</style>

