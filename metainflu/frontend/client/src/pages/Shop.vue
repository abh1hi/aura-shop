<template>
    <div class="shop-page">
        <PageHeader title="Shop" />

        <main class="container shop-layout">
            <!-- Desktop Filter Sidebar -->
            <aside class="sidebar-desktop">
                <div class="sidebar-content">
                    <h3>Filters</h3>
                    <div class="filter-group">
                        <h4>Category</h4>
                        <div class="options-grid">
                            <input type="radio" id="cat-all-desktop" name="category-desktop" checked><label for="cat-all-desktop">All</label>
                            <input type="radio" id="cat-tops-desktop" name="category-desktop"><label for="cat-tops-desktop">Tops</label>
                            <input type="radio" id="cat-bottoms-desktop" name="category-desktop"><label for="cat-bottoms-desktop">Bottoms</label>
                            <input type="radio" id="cat-outerwear-desktop" name="category-desktop"><label for="cat-outerwear-desktop">Outerwear</label>
                            <input type="radio" id="cat-accessories-desktop" name="category-desktop"><label for="cat-accessories-desktop">Accessories</label>
                        </div>
                    </div>
                    <div class="filter-group">
                        <h4>Price Range</h4>
                        <div class="options-grid">
                            <input type="checkbox" id="price-1-desktop"><label for="price-1-desktop">$0 - $50</label>
                            <input type="checkbox" id="price-2-desktop"><label for="price-2-desktop">$50 - $100</label>
                            <input type="checkbox" id="price-3-desktop"><label for="price-3-desktop">$100 - $200</label>
                            <input type="checkbox" id="price-4-desktop"><label for="price-4-desktop">$200+</label>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Mobile Filter Button -->
            <div class="filter-toggle-btn-mobile" @click="toggleFilter">
                <span>Filters</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </div>

            <!-- Mobile Filter Bottom Sheet -->
            <div class="filter-bottom-sheet" :class="{ 'open': isFilterOpen }">
                <div class="filter-overlay" @click="closeFilter"></div>
                <div class="bottom-sheet-content" v-touch:swipe.down="closeFilter">
                    <div class="bottom-sheet-header">
                        <h3>Filters</h3>
                        <button class="close-btn" @click="closeFilter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div class="filter-group">
                        <h4>Category</h4>
                        <div class="options-grid">
                            <input type="radio" id="cat-all-mobile" name="category-mobile" checked><label for="cat-all-mobile">All</label>
                            <input type="radio" id="cat-tops-mobile" name="category-mobile"><label for="cat-tops-mobile">Tops</label>
                            <input type="radio" id="cat-bottoms-mobile" name="category-mobile"><label for="cat-bottoms-mobile">Bottoms</label>
                            <input type="radio" id="cat-outerwear-mobile" name="category-mobile"><label for="cat-outerwear-mobile">Outerwear</label>
                            <input type="radio" id="cat-accessories-mobile" name="category-mobile"><label for="cat-accessories-mobile">Accessories</label>
                        </div>
                    </div>
                    <div class="filter-group">
                        <h4>Price Range</h4>
                        <div class="options-grid">
                            <input type="checkbox" id="price-1-mobile"><label for="price-1-mobile">$0 - $50</label>
                            <input type="checkbox" id="price-2-mobile"><label for="price-2-mobile">$50 - $100</label>
                            <input type="checkbox" id="price-3-mobile"><label for="price-3-mobile">$100 - $200</label>
                            <input type="checkbox" id="price-4-mobile"><label for="price-4-mobile">$200+</label>
                        </div>
                    </div>
                    <button class="apply-filters-btn" @click="closeFilter">Apply Filters</button>
                </div>
            </div>

            <!-- Main Product Content -->
            <section class="main-content">
                <div v-if="products.length > 0" class="product-grid">
                    <ProductCard v-for="product in products" :key="product._id" :product="product" />
                </div>
                <div v-else class="loading-state">
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
const isFilterOpen = ref(false);

const toggleFilter = () => {
    isFilterOpen.value = !isFilterOpen.value;
};

const closeFilter = () => {
    isFilterOpen.value = false;
};

onMounted(async () => {
    try {
        products.value = await productService.getProducts();
    } catch (error) {
        console.error("Failed to load products:", error);
    }
});
</script>

<style scoped>
.shop-page {
    background-color: #f4f4f9;
}

.shop-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    padding: 2rem 0;
}

/* Desktop Sidebar */
.sidebar-desktop {
    background-color: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    height: fit-content;
}

.sidebar-desktop h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

/* Mobile Filter Button */
.filter-toggle-btn-mobile {
    display: none; /* Hidden on desktop */
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    -webkit-tap-highlight-color: transparent;
}

/* Mobile Filter Bottom Sheet */
.filter-bottom-sheet {
    display: none; /* Hidden on desktop */
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    pointer-events: none;
}

.filter-bottom-sheet.open {
    pointer-events: auto;
}

.filter-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.filter-bottom-sheet.open .filter-overlay {
    opacity: 1;
}

.bottom-sheet-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 1.5rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.filter-bottom-sheet.open .bottom-sheet-content {
    transform: translateY(0);
}

.bottom-sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.bottom-sheet-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}

/* Common Filter Styles */
.filter-group {
    margin-bottom: 1.5rem;
}

.filter-group h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #555;
}

.options-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.options-grid input[type="checkbox"],
.options-grid input[type="radio"] {
    display: none;
}

.options-grid label {
    padding: 0.75rem 1.25rem;
    border: 1px solid #ddd;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
}

.options-grid input:checked + label {
    background-color: #000;
    color: #fff;
    border-color: #000;
}

.apply-filters-btn {
    width: 100%;
    padding: 1rem;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    -webkit-appearance: none;
}

/* Main Content */
.main-content {
    min-width: 0;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.loading-state {
    text-align: center;
    padding: 4rem;
    font-size: 1.2rem;
    color: #777;
}

/* Responsive */
@media (max-width: 768px) {
    .shop-layout {
        grid-template-columns: 1fr;
    }

    .sidebar-desktop {
        display: none;
    }

    .filter-toggle-btn-mobile {
        display: flex;
    }

    .filter-bottom-sheet {
        display: block;
    }

    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>