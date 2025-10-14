<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
    <!-- Page Header -->
    <PageHeader title="Shop" subtitle="Curated Collection for the New Generation" />

    <!-- Floating Filter & Sort -->
    <div class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <!-- Mobile Filter Button -->
        <button
          @click="toggleFilter"
          class="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h18M6 12h12M9 20h6" />
          </svg>
          <span class="text-sm font-medium">Filter</span>
        </button>

        <!-- Desktop Category Buttons -->
        <div class="hidden sm:flex gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            :class="[
              'px-4 py-2 rounded-full text-sm transition-all duration-300',
              selectedCategory === cat
                ? 'bg-black text-white shadow-md'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Sort Dropdown -->
      <select v-model="sortOption" class="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none">
        <option value="default">Sort by</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
        <option value="new">Newest</option>
      </select>
    </div>

    <!-- Main Product Grid -->
    <main class="container mx-auto px-6 py-16">
      <transition-group name="fade-up" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <ProductCard
          v-for="product in sortedProducts"
          :key="product._id"
          :product="product"
          class="motion-safe:animate-fadein"
        />
      </transition-group>

      <!-- Empty State -->
      <div v-if="sortedProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <p class="text-xl font-medium text-gray-400">No products match your filters.</p>
        <p class="text-sm text-gray-300 mt-2">Try adjusting your filters or reset to explore all items.</p>
      </div>
    </main>

    <!-- Mobile Filter Modal -->
    <div
      v-if="isFilterOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
      @click.self="closeFilter"
    >
      <div class="w-full max-w-sm bg-white rounded-l-3xl p-8 shadow-2xl overflow-y-auto animate-slidein">
        <h3 class="text-lg font-semibold mb-6">Filters</h3>

        <!-- Price Range Filter -->
        <h4 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Price Range</h4>
        <div class="space-y-3 mb-8">
          <label
            v-for="range in priceRanges"
            :key="range.label"
            class="flex items-center gap-3 border border-gray-200 rounded-xl p-3 hover:bg-gray-50 cursor-pointer"
          >
            <input type="checkbox" :value="range.value" v-model="selectedPrices" class="h-4 w-4 accent-black" />
            <span class="text-sm text-gray-800">{{ range.label }}</span>
          </label>
        </div>

        <button
          @click="closeFilter"
          class="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-900 transition-all duration-300"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';

const allProducts = ref([]);
const categories = ref(['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']);
const selectedCategory = ref('All');
const isFilterOpen = ref(false);
const sortOption = ref('default');

const priceRanges = ref([
  { label: '$0 - $50', value: { min: 0, max: 50 } },
  { label: '$50 - $100', value: { min: 50, max: 100 } },
  { label: '$100 - $200', value: { min: 100, max: 200 } },
  { label: '$200+', value: { min: 200, max: Infinity } },
]);
const selectedPrices = ref([]);

const filteredProducts = computed(() => {
  let products = allProducts.value;
  if (selectedCategory.value !== 'All') {
    products = products.filter(p => p.category === selectedCategory.value);
  }
  if (selectedPrices.value.length > 0) {
    products = products.filter(p =>
      selectedPrices.value.some(range => p.price >= range.min && p.price <= range.max)
    );
  }
  return products;
});

const sortedProducts = computed(() => {
  let products = [...filteredProducts.value];
  if (sortOption.value === 'low-high') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'high-low') {
    return products.sort((a, b) => b.price - a.price);
  } else if (sortOption.value === 'new') {
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return products;
});

const toggleFilter = () => (isFilterOpen.value = !isFilterOpen.value);
const closeFilter = () => (isFilterOpen.value = false);
const selectCategory = cat => (selectedCategory.value = cat);

onMounted(async () => {
  try {
    const fetched = await productService.getProducts();
    allProducts.value = fetched.map(p => ({
      ...p,
      category:
        p.category || categories.value[Math.floor(Math.random() * (categories.value.length - 1)) + 1],
    }));
  } catch (err) {
    console.error('Failed to load products:', err);
  }
});
</script>

<style scoped>
/* Fade-up Animation */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(25px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* Product Fade-in */
.motion-safe\:animate-fadein {
  animation: fadein 0.6s ease-out;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide-in for Filter Drawer */
@keyframes slidein {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slidein {
  animation: slidein 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
