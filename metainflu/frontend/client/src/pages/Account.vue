<!-- File: src/views/Account.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>My Account</h1>
            </div>
        </section>

        <section class="section container">
            <div class="account-layout">
                <aside class="account-nav">
                    <ul>
                        <li><a href="#orders" :class="{ active: activeTab === 'orders' }" @click.prevent="activeTab = 'orders'">Orders</a></li>
                        <li><a href="#profile" :class="{ active: activeTab === 'profile' }" @click.prevent="activeTab = 'profile'">Profile</a></li>
                        <li><a href="#addresses" :class="{ active: activeTab === 'addresses' }" @click.prevent="activeTab = 'addresses'">Addresses</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul>
                </aside>
                <div class="account-content">
                    <div id="orders" v-show="activeTab === 'orders'">
                        <h2>Order History</h2>
                        <div class="order-history">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#12345</td>
                                        <td>2025-09-15</td>
                                        <td>Shipped</td>
                                        <td>$125.00</td>
                                    </tr>
                                    <tr>
                                        <td>#12344</td>
                                        <td>2025-09-10</td>
                                        <td>Delivered</td>
                                        <td>$85.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="profile" v-show="activeTab === 'profile'">
                        <h2>Edit Profile</h2>
                        <form>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" value="Your Name">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" value="your.email@example.com">
                            </div>
                            <div class="form-group">
                                <label for="password">New Password</label>
                                <input type="password" id="password">
                            </div>
                            <button type="submit" class="submit-btn">Save Changes</button>
                        </form>
                    </div>
                    <div id="addresses" v-show="activeTab === 'addresses'">
                        <h2>Manage Addresses</h2>
                        <p>Your default shipping address will be used for all future orders.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('orders');
</script>

<style scoped>
.account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 4rem;
}

.account-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
    overflow: hidden;
}

.account-nav li a {
    display: block;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: background-color 0.3s;
    border-bottom: 1px solid var(--light-gray);
    cursor: pointer;
}

.account-nav li:last-child a {
    border-bottom: none;
}

.account-nav li a.active,
.account-nav li a:hover {
    background-color: var(--light-gray);
    color: var(--c5);
}

.account-content h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--c5);
}

.order-history table {
    width: 100%;
    border-collapse: collapse;
}

.order-history th,
.order-history td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--light-gray);
}

.order-history th {
    font-weight: 600;
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
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
}

.submit-btn {
    background-color: var(--c5);
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

@media (max-width: 992px) {
    .account-layout {
        grid-template-columns: 1fr;
    }
}
</style>

