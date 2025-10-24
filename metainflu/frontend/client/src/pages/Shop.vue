<template>
  <div class="min-h-screen bg-[#f7f7f7] text-[#1a1a1a] font-sans">
    

    <main class="max-w-7xl mx-auto">
      <section id="shop-all-page" class="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h1 class="text-5xl font-light tracking-tight mb-12 text-center">Shop All</h1>
        
        <div class="md:grid md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <!-- Filter Sidebar (Desktop) -->
          <aside class="hidden md:block md:col-span-1 lg:col-span-1 p-6 bg-white rounded-xl shadow-sm h-fit">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">Filter</h2>
            <div class="space-y-4 text-sm">
              <!-- Category Filter -->
              <div>
                <h3 class="font-medium mb-2">Category</h3>
                <ul class="space-y-1 text-gray-600">
                  <li v-for="cat in categoriesWithAll" :key="cat._id || 'all'">
                    <a 
                      href="#" 
                      @click.prevent="selectCategory(cat._id)"
                      :class="['hover:text-gray-900 transition duration-150', { 'font-semibold text-gray-900': selectedCategoryId === cat._id }]"
                    >
                      {{ cat.name }} ({{ cat.count }})
                    </a>
                  </li>
                </ul>
              </div>
              
              <!-- Sort By Dropdown -->
              <div>
                 <h3 class="font-medium mb-2">Sort By</h3>
                 <select v-model="sortOption" class="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-gray-900 focus:border-gray-900">
                     <option value="new">Newest First</option>
                     <option value="low-high">Price: Low to High</option>
                     <option value="high-low">Price: High to Low</option>
                 </select>
              </div>

              <!-- Clear Filter Button -->
              <div v-if="selectedCategoryId">
                <button @click="selectCategory(null)" class="w-full text-center text-sm text-red-500 hover:text-red-700 mt-4">Clear Filter</button>
              </div>
            </div>
          </aside>

          <!-- Product Grid -->
          <div class="md:col-span-3 lg:col-span-4">
            
            <!-- Mobile Header -->
            <div class="flex justify-between items-center mb-6 md:hidden">
              <span class="text-sm font-medium text-gray-500">{{ sortedProducts.length }} results</span>
               <div class="flex gap-2">
                   <select v-model="sortOption" class="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-gray-900 focus:border-gray-900">
                       <option value="new">Newest First</option>
                       <option value="low-high">Price: L to H</option>
                       <option value="high-low">Price: H to L</option>
                   </select>
                   <button @click="toggleSidebar" class="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h18M6 12h12M9 20h6" /></svg>
                       Filter
                   </button>
               </div>
            </div>
            
            <!-- Loading / Error / Empty States -->
            <div v-if="isLoading" class="text-center py-20">
                <p class="text-lg text-gray-500">Loading products...</p>
            </div>
            <div v-else-if="error" class="text-center py-20 text-red-500 p-4 bg-red-100 rounded-lg">
                <p><strong>Error:</strong> {{ error }}</p>
                <p class="mt-2">Please try again later.</p>
            </div>
            <div v-else-if="sortedProducts.length === 0" class="text-center py-20">
              <p class="text-xl font-medium text-gray-400">No products found.</p>
              <p class="text-sm text-gray-300 mt-2">Try adjusting your filters or check back later.</p>
            </div>

            <!-- Grid Display -->
            <transition-group v-else name="fade-up" tag="div" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              <ProductCard
                v-for="product in sortedProducts"
                :key="product.key"
                :product="product"
              />
            </transition-group>
          </div>
        </div>
      </section>
    </main>

    <!-- Mobile Filter Sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden" @click.self="closeSidebar">
      <div class="w-3/4 max-w-sm bg-[#f7f7f7] rounded-l-2xl p-6 shadow-2xl overflow-y-auto">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
            <h3 class="text-xl font-semibold">Filter</h3>
            <button @click="closeSidebar" class="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <ul class="space-y-2 text-gray-600">
          <li v-for="cat in categoriesWithAll" :key="cat._id || 'all'">
            <a href="#" @click.prevent="selectCategory(cat._id)" :class="['text-base block py-1 hover:text-gray-900', { 'font-bold text-gray-900': selectedCategoryId === cat._id }]">
              {{ cat.name }} ({{ cat.count }})
            </a>
          </li>
        </ul>
        <button @click="closeSidebar" class="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold mt-6">View Items</button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import Footer from '../components/Footer.vue';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

// --- State ---
const allProducts = ref([]);
const categories = ref([]);
const selectedCategoryId = ref(null);
const sortOption = ref('new');
const isLoading = ref(true);
const error = ref(null);
const isSidebarOpen = ref(false);

// --- Computed Properties ---
const categoriesWithAll = computed(() => {
  const allCount = allProducts.value.length;
  const categoryCounts = allProducts.value.reduce((acc, product) => {
    product.categories.forEach(cat => {
      acc[cat._id] = (acc[cat._id] || 0) + 1;
    });
    return acc;
  }, {});

  const categoryList = categories.value.map(cat => ({
    ...cat,
    count: categoryCounts[cat._id] || 0,
  }));

  return [{ name: 'All', _id: null, count: allCount }, ...categoryList];
});

const productsWithVariants = computed(() => {
  const expanded = [];
  allProducts.value.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        // Build each "card product" with variant-specific fields
        expanded.push({
          // Base product identity
          _id: product._id,
          key: `${product._id}-${variant._id || variant.sku || variant.price || ''}`,
          name: product.name,
          description: product.description,
          categories: product.categories || [],
          createdAt: product.createdAt,
          
          // Variant-first fields used by ProductCard
          price: Number(variant.price ?? product.price ?? 0),
          stock: Number(variant.stock ?? 0),
          images: Array.isArray(variant.images) && variant.images.length > 0
            ? variant.images.map(img => ({ url: img }))
            : (Array.isArray(product.images) && product.images.length > 0
              ? product.images.map(img => ({ url: img.url || img }))
              : [{ url: 'https://via.placeholder.com/300' }]),
          
          // Extra fields for downstream usage
          sku: variant.sku,
          variantAttributes: Array.isArray(variant.attributes) ? variant.attributes : [],
          currentVariant: {
            _id: variant._id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            images: variant.images || [],
            attributes: Array.isArray(variant.attributes) ? variant.attributes : []
          },
          
          // Cosmetic/demo fields if needed
          rating: 4.7,
          reviews: 120,
          sizes: ['S', 'M', 'L', 'XL']
        });
      });
    } else {
      // Fallback for products without variants
      expanded.push({
        ...product,
        key: product._id,
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
        images: Array.isArray(product.images) && product.images.length > 0
          ? product.images.map(img => ({ url: img.url || img }))
          : [{ url: 'https://via.placeholder.com/300' }],
        currentVariant: null, // No variant for base products
        variantAttributes: [],
        rating: 4.7,
        reviews: 120,
        sizes: ['S', 'M', 'L', 'XL']
      });
    }
  });
  return expanded;
});

const sortedProducts = computed(() => {
  let products = [...productsWithVariants.value]; // Use the new expanded list
  if (selectedCategoryId.value) {
    products = products.filter(p => p.categories.some(c => c._id === selectedCategoryId.value));
  }

  if (sortOption.value === 'low-high') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'high-low') {
    return products.sort((a, b) => b.price - a.price);
  } else {
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
});

// --- Methods ---
const fetchInitialData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [productsData, categoriesData] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
    ]);
    allProducts.value = productsData;
    categories.value = categoriesData;
  } catch (err) {
    error.value = err.message || 'Failed to load data.';
    console.error('Data fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

const selectCategory = (id) => {
  selectedCategoryId.value = id;
  closeSidebar();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped>
/* Basic transition for product grid */
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