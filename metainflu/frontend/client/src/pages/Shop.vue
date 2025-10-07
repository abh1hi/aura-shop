<template>
    <div>
        <PageHeader title="Shop" />

        <main class="container shop-layout">
            <aside class="sidebar">
                <h3>Filters</h3>
                <div class="filter-group">
                    <h4>Category</h4>
                    <ul>
                        <li><label><input type="checkbox" checked> All</label></li>
                        <li><label><input type="checkbox"> Tops</label></li>
                        <li><label><input type="checkbox"> Bottoms</label></li>
                        <li><label><input type="checkbox"> Outerwear</label></li>
                        <li><label><input type="checkbox"> Accessories</label></li>
                    </ul>
                </div>
                <div class="filter-group">
                    <h4>Price</h4>
                    <ul>
                        <li><label><input type="checkbox"> $0 - $50</label></li>
                        <li><label><input type="checkbox"> $50 - $100</label></li>
                        <li><label><input type="checkbox"> $100 - $200</label></li>
                        <li><label><input type="checkbox"> $200+</label></li>
                    </ul>
                </div>
            </aside>

            <section class="main-content">
                <div v-if="products.length > 0" class="product-grid">
                    <ProductCard v-for="product in products" :key="product._id" :product="product" />
                </div>
                 <div v-else>
                    <p>Loading products...</p>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard.vue';
import PageHeader from '../components/PageHeader.vue';

const products = ref([]);

onMounted(async () => {
    try {
        products.value = await productService.getProducts();
    } catch (error) {
        console.error("Failed to load products:", error);
    }
});
</script>

<style scoped>
.shop-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 4rem;
    padding: 4rem 0;
}

.sidebar h3 {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;
    color: var(--text-color);
}

.filter-group {
    margin-bottom: 2.5rem;
}

.filter-group h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-color);
    border-bottom: 2px solid var(--c7);
    padding-bottom: 0.5rem;
    display: inline-block;
}

.filter-group ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.filter-group li {
    margin-bottom: 1rem;
}

.filter-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    color: #555;
}

.filter-group input[type="checkbox"] {
    margin-right: 10px;
    accent-color: var(--c5);
}

.main-content {
    min-width: 0;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2.5rem;
}

.product-card {
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    border: 1px solid var(--light-gray);
}

.product-card:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.08);
    transform: translateY(-8px);
}

.product-image-container {
    position: relative;
    overflow: hidden;
}

.product-card img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-card:hover img {
    transform: scale(1.05);
}

.product-info {
    padding: 1.5rem;
    text-align: center;
}

.product-name {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.product-price {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--c5);
}

.add-to-cart-btn {
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translate(-50%, 10px);
    opacity: 0;
    background-color: var(--c5);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    white-space: nowrap;
}

.product-card:hover .add-to-cart-btn {
    transform: translate(-50%, 0);
    opacity: 1;
}

.add-to-cart-btn:hover {
    background-color: var(--c6);
}

@media (max-width: 992px) {
    .shop-layout {
        grid-template-columns: 1fr;
    }

    .sidebar {
        margin-bottom: 3rem;
    }
}

@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
}

@media (max-width: 576px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>

