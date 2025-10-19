<template>
  <div class="shop-page">
    <PageHeader title="Our Collection" subtitle="Consciously crafted, timelessly styled." />

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filter and Sort Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <button @click="isFilterSidebarOpen = true" class="filter-button">
            <i class="fas fa-filter mr-2"></i>
            <span>Filters</span>
          </button>
          <div class="custom-select-wrapper">
            <select v-model="sortOption" class="custom-select">
              <option value="new">Newest</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          Showing {{ displayedProducts.length }} of {{ sortedProducts.length }} products
        </div>
      </div>

      <!-- Product Grid -->
      <div v-if="isLoading" class="text-center py-20">
        <p class="text-lg text-gray-400">Loading our collection...</p>
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-400">
        <p><strong>An error occurred:</strong> {{ error }}</p>
      </div>
      <div v-else-if="sortedProducts.length === 0" class="text-center py-20">
        <p class="text-xl font-medium text-gray-400">No products found in this collection.</p>
      </div>
      <transition-group v-else name="fade-up" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.key"
          :product="product"
        />
      </transition-group>

      <!-- Infinite Scroll Sentinel -->
      <div ref="sentinel" class="h-10"></div>
    </main>

    <!-- Filter Sidebar -->
    <transition name="slide-fade">
      <div v-if="isFilterSidebarOpen" class="filter-sidebar-overlay" @click="isFilterSidebarOpen = false">
        <div class="filter-sidebar" @click.stop>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Filters</h3>
            <button @click="isFilterSidebarOpen = false" class="text-gray-500 hover:text-gray-800">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <div>
            <h4 class="text-lg font-medium mb-4">Category</h4>
            <ul>
              <li>
                <a href="#" @click.prevent="selectedCategoryId = null" :class="{ 'font-bold': selectedCategoryId === null }">All Categories</a>
              </li>
              <li v-for="cat in categories" :key="cat._id">
                <a href="#" @click.prevent="selectedCategoryId = cat._id" :class="{ 'font-bold': selectedCategoryId === cat._id }">{{ cat.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const allProducts = ref([]);
const categories = ref([]);
const selectedCategoryId = ref(null);
const sortOption = ref('new');
const isLoading = ref(true);
const error = ref(null);
const displayedCount = ref(12);
const isFilterSidebarOpen = ref(false);
const sentinel = ref(null);

const productsWithVariants = computed(() => {
  return allProducts.value.flatMap(product => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map(variant => {
        const imageUrl = (variant.images && variant.images.length > 0) 
          ? variant.images[0] 
          : (product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300');
        
        return {
          ...product,
          key: `${product._id}-${variant.sku || variant._id}`,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
          images: [{ url: imageUrl }],
          variantAttributes: variant.attributes,
        };
      });
    } else {
      return {
        ...product,
        key: product._id,
        price: product.price || 0,
      };
    }
  });
});

const sortedProducts = computed(() => {
  let products = productsWithVariants.value;

  if (selectedCategoryId.value) {
    products = products.filter(p => p.categories.some(c => c._id === selectedCategoryId.value));
  }

  const sortFn = {
    'low-high': (a, b) => a.price - b.price,
    'high-low': (a, b) => b.price - a.price,
    'new': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  }[sortOption.value];

  return [...products].sort(sortFn);
});

const displayedProducts = computed(() => {
  return sortedProducts.value.slice(0, displayedCount.value);
});

const hasMore = computed(() => {
  return displayedCount.value < sortedProducts.value.length;
});

const loadMore = () => {
  if (hasMore.value) {
    displayedCount.value += 8;
  }
};

const fetchInitialData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    [allProducts.value, categories.value] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
    ]);
  } catch (err) {
    console.error("Failed to load shop data:", err);
    error.value = err.message || 'Failed to load data.';
  } finally {
    isLoading.value = false;
  }
};

watch([selectedCategoryId, sortOption], () => {
  displayedCount.value = 12;
});

let observer;
onMounted(() => {
  fetchInitialData();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  });
  observer.observe(sentinel.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.shop-page {
  background-color: #f9fafb;
  color: #1a1a1a;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-button:hover {
  border-color: #c19a6b;
  background-color: #f8f8f8;
}

.custom-select-wrapper {
  position: relative;
}

.custom-select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  padding: 0.75rem 2.5rem 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s;
}

.custom-select:hover {
  border-color: #c19a6b;
}

.custom-select-wrapper::after {
  content: '\25BC';
  font-size: 0.7rem;
  color: #888;
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.filter-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.filter-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: #fff;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 101;
}

.filter-sidebar ul {
  list-style: none;
  padding: 0;
}

.filter-sidebar li a {
  display: block;
  padding: 0.75rem 0;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.filter-sidebar li a:hover {
  color: #c19a6b;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
