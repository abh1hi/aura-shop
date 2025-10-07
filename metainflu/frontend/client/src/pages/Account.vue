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
                    <!-- Desktop/Tablet Navigation -->
                    <ul class="desktop-nav">
                        <li><a href="#orders" :class="{ active: activeTab === 'orders' }" @click.prevent="activeTab = 'orders'">Orders</a></li>
                        <li><a href="#profile" :class="{ active: activeTab === 'profile' }" @click.prevent="activeTab = 'profile'">Profile</a></li>
                        <li><a href="#addresses" :class="{ active: activeTab === 'addresses' }" @click.prevent="activeTab = 'addresses'">Addresses</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul>
                    
                    <!-- Mobile/Small Tablet Navigation -->
                    <div class="mobile-tabs">
                        <button 
                            :class="{ active: activeTab === 'orders' }" 
                            @click="activeTab = 'orders'"
                        >Orders</button>
                         <button 
                            :class="{ active: activeTab === 'profile' }" 
                            @click="activeTab = 'profile'"
                        >Profile</button>
                         <button 
                            :class="{ active: activeTab === 'addresses' }" 
                            @click="activeTab = 'addresses'"
                        >Addresses</button>
                        <button>Logout</button>
                    </div>
                </aside>
                <div class="account-content">
                    <div id="orders" v-show="activeTab === 'orders'">
                        <h2>Order History</h2>
                        <div class="order-history">
                            <div class="table-scroll">
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
    grid-template-columns: 280px 1fr; /* Desktop default */
    gap: 4rem;
}

/* Desktop Navigation (Visible by default) */
.desktop-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
    overflow: hidden;
}

.desktop-nav li a {
    display: block;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: background-color 0.3s;
    border-bottom: 1px solid var(--light-gray);
    cursor: pointer;
}

.desktop-nav li:last-child a {
    border-bottom: none;
}

.desktop-nav li a.active,
.desktop-nav li a:hover {
    background-color: var(--light-gray);
    color: var(--c5);
}

/* Mobile Tabs (Hidden by default) */
.mobile-tabs {
    display: none;
}

.account-content h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--c5);
}

.order-history {
    overflow-x: auto;
}

.order-history table {
    width: 100%;
    min-width: 600px; /* Ensure table doesn't get too narrow on mobile */
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
    white-space: nowrap;
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
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: var(--c6);
}

@media (max-width: 992px) {
    .account-layout {
        grid-template-columns: 1fr; /* Stack layout on tablet/mobile */
        gap: 2rem;
    }

    /* Hide desktop navigation */
    .desktop-nav {
        display: none;
    }

    /* Show mobile tabs */
    .mobile-tabs {
        display: flex;
        justify-content: space-around;
        background-color: var(--light-gray);
        border-radius: 12px;
        padding: 0.5rem;
        gap: 0.5rem;
    }
    
    .mobile-tabs button {
        flex-grow: 1;
        padding: 0.75rem 0.5rem;
        background-color: transparent;
        color: var(--text-color);
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
        white-space: nowrap;
    }

    .mobile-tabs button.active {
        background-color: white;
        color: var(--c5);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
}
</style>
