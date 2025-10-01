<!-- File: src/views/OrderPlaced.vue -->
<template>
    <div class="confirmation-page">
         <header>
            <div class="container">
                <a href="#" class="logo">AURA</a>
            </div>
        </header>
        <main>
            <section class="container confirmation-content">
                <h1>Thank You for Your Order!</h1>
                <p>Your order has been placed successfully. You will receive an email confirmation shortly.</p>
                <p class="order-number">Order Number: #12345</p>
                <a href="#" class="cta-button">Continue Shopping</a>
            </section>
        </main>
         <footer class="footer">
            <p>&copy; 2025 AURA. All rights reserved.</p>
        </footer>
    </div>
</template>

<style scoped>
.confirmation-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    text-align: center;
}
header {
    padding: 1.5rem 0;
}
.logo {
    font-weight: 700;
    font-size: 1.8rem;
    text-decoration: none;
    color: var(--c5);
}
main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.container {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
}
.confirmation-content h1 {
    font-size: 3rem;
    font-weight: 600;
    color: var(--c5);
    margin-bottom: 1rem;
}
.confirmation-content p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
}
.order-number {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 3rem;
}
.footer {
    padding: 2rem 0;
    text-align: center;
    color: #aaa;
}
</style>

