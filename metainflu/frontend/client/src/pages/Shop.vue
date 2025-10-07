<template>
    <div>
        <!-- Page Header -->
        <PageHeader title="Shop" />

        <main class="container shop-layout">
            
            <!-- Filter Toggle Button (Always visible now) -->
            <div class="filter-toggle-btn" @click="toggleFilter">
                <h3 class="font-semibold text-lg">{{ isFilterOpen ? 'Hide Filters' : 'Show Filters' }}</h3>
                <span>
                    <svg v-if="!isFilterOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
            </div>

            <!-- Filter Component (Floating Overlay on all sizes) -->
            <ProductFilter 
                :is-open="isFilterOpen" 
                @close="closeFilter"
            />

            <!-- Main Product Content -->
            <section class="main-content">
                <div v-if="products.length > 0" class="product-grid">
                    <ProductCard v-for="product in products" :key="product._id" :product="product" />
                </div>
                 <div v-else class="text-center p-8 text-xl text-gray-500">
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
import ProductFilter from '../components/ProductFilter.vue'; // New Import

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
/* --- Removed sidebar width variable and grid layout in shop-layout --- */
.shop-layout {
    display: block; /* No grid needed, products take full width */
    padding: 4rem 0;
}

/* --- Filter Toggle Button (Desktop/Mobile/Tablet) --- */
.filter-toggle-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 2rem;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    max-width: 300px; /* Constrain button width */
    margin-left: auto;
    margin-right: auto;
}
.filter-toggle-btn span {
    color: var(--c5);
}


/* --- Product Grid Styling --- */
.main-content {
    min-width: 0;
}

.product-grid {
    display: grid;
    /* Adjusted Adaptive layout for full width: */
    /* 1 col on small mobile, 2 cols on tablet, 3-4 cols on large tablet/desktop */
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

/* --- Responsive Adjustments --- */

/* Tablet and Large Mobile (Below 1024px to 600px) */
@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
}

/* Small Mobile (Below 600px) */
@media (max-width: 600px) {
    .product-grid {
        /* Single column for narrow mobile screens */
        grid-template-columns: 1fr;
    }
    .filter-toggle-btn {
        max-width: 100%; /* Full width filter button on mobile */
    }
}
</style>
