<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import Navbar from '../components/Navbar.vue'; // Importing the site-wide Navbar for completeness, although App.vue manages it.

// --- STATE MANAGEMENT ---
const allProducts = ref([]);
const categories = ref([]);
const selectedCategoryId = ref(null); // Null means 'All' initially
const isLoading = ref(true);
const error = ref(null);
const isSidebarOpen = ref(false); 
const sortOption = ref('new'); 

// --- INLINE UTILITY COMPONENTS (Only retaining Footer) ---

// Footer Component
const PageFooter = {
  template: `
    <footer class="mt-20 border-t border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-lg font-bold mb-4">AURA</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><router-link to="/about" class="hover:text-gray-900">About Us</router-link></li>
              <li><a href="#" class="hover:text-gray-900">Careers</a></li>
              <li><a href="#" class="hover:text-gray-900">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Customer Care</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Shipping & Returns</a></li>
              <li><router-link to="/contact" class="hover:text-gray-900">Contact</router-link></li>
              <li><a href="#" class="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
          <div class="col-span-2 md:col-span-2">
            <h4 class="text-lg font-bold mb-4">Stay Informed</h4>
            <p class="text-sm text-gray-600 mb-4">Sign up for early access to new collections and events.</p>
            <form class="flex space-x-2">
              <input type="email" placeholder="Email address" class="flex-1 p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-0 text-sm" required>
              <button type="submit" class="px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition duration-300">
                Join
              </button>
            </form>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-500">&copy; {{ new Date().getFullYear() }} AURA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
};


// --- LOGIC AND DATA FETCHING ---

const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
const closeSidebar = () => (isSidebarOpen.value = false);

/**
 * Fetches categories from the backend and adds an "All" option.
 */
const fetchCategories = async () => {
  try {
    const data = await categoryService.getCategories();
    categories.value = data;
    // Set initial category to 'All'
    selectedCategoryId.value = null; 
  } catch (err) {
    error.value = 'Failed to load categories.';
    console.error('Category fetch error:', err);
  }
};

/**
 * Fetches products from the backend, applying filtering if a category is selected.
 * @param {string | null} categoryId The ObjectId of the category or null for all.
 */
const fetchProducts = async (categoryId = null) => {
  isLoading.value = true;
  error.value = null;
  try {
    // Pass the selected categoryId (or null) to the service
    const data = await productService.getProducts(categoryId);
    allProducts.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to load products.';
    console.error('Product fetch error:', err);
    allProducts.value = [];
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handles category selection from the sidebar.
 * @param {string | null} id The ObjectId or null/string 'All'.
 */
const selectCategory = (id) => {
  // Map 'All' option to null for the API call
  selectedCategoryId.value = id === 'All' ? null : id;
  // Re-fetch products with the new filter
  fetchProducts(selectedCategoryId.value);
  closeSidebar(); 
};


// --- COMPUTED PROPERTIES FOR DISPLAY ---

// Adds 'All' category and formats categories for display
const categoriesWithAll = computed(() => {
  const list = categories.value.map(cat => ({
      ...cat,
      // Calculate count by checking if the product's categories array contains the current cat._id
      count: allProducts.value.filter(p => 
        p.categories && p.categories.some(c => c._id === cat._id) 
      ).length
  }));
  
  // Add 'All' option
  const allCount = allProducts.value.length;
  list.unshift({ name: 'All', _id: null, count: allCount });
  
  return list;
});


const validProducts = computed(() => {
  // Filter out any products that are missing a numeric price before sorting
  return sortedProducts.value.filter(p => 
    p && typeof p.price === 'number' && !isNaN(p.price)
  );
});

const sortedProducts = computed(() => {
  let products = [...allProducts.value];
  
  // Filter out products without a valid price before sorting
  products = products.filter(p => typeof p.price === 'number' && !isNaN(p.price));
  
  if (sortOption.value === 'low-high') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'high-low') {
    return products.sort((a, b) => b.price - a.price);
  } else if (sortOption.value === 'new') {
    // Sort by createdAt descending
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return products;
});


onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f7] text-[#1a1a1a] font-sans overflow-x-hidden">
    
    <!-- NOTE: The global Navbar is handled by the parent App.vue and router-view. -->

    <main class="max-w-7xl mx-auto">
      <section id="shop-all-page" class="page-content px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h1 class="text-5xl font-light tracking-tight mb-12 text-center">Shop All</h1>
        
        <div class="md:grid md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <!-- Filter Sidebar (Desktop View) -->
          <aside class="hidden md:block md:col-span-1 lg:col-span-1 mb-8 md:mb-0 p-6 bg-white rounded-xl ios-card-shadow h-fit">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">Filter</h2>
            <div class="space-y-4 text-sm">
              
              <!-- Category Filter -->
              <div>
                <h3 class="font-medium mb-2">Category</h3>
                <ul class="space-y-1 text-gray-600">
                  <li v-for="cat in categoriesWithAll" :key="cat._id || 'all'">
                    <a 
                      href="#" 
                      @click.prevent="selectCategory(cat._id || 'All')"
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
            </div>
          </aside>

          <!-- Product Grid -->
          <div class="md:col-span-3 lg:col-span-4">
            
            <!-- Mobile Sort/Filter Header -->
            <div class="flex justify-between items-center mb-6 md:hidden">
              <span class="text-sm font-medium text-gray-500">{{ sortedProducts.length }} results</span>
               <div class="flex gap-2">
                   <select v-model="sortOption" class="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-gray-900 focus:border-gray-900">
                       <option value="new">Newest First</option>
                       <option value="low-high">Price: L to H</option>
                       <option value="high-low">Price: H to L</option>
                   </select>
                   <button @click="toggleSidebar" class="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-all text-sm font-medium">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4h18M6 12h12M9 20h6" />
                       </svg>
                       Filter
                   </button>
               </div>
            </div>
            
            <!-- Loading and Error States -->
            <div v-if="isLoading" class="text-center py-20">
                <p class="text-lg text-gray-500">Loading products, please wait...</p>
            </div>
            <div v-else-if="error" class="text-center py-20 text-red-500 p-4 bg-red-100 rounded-lg">
                {{ error }}
            </div>

            <!-- Grid Display -->
            <transition-group v-else name="fade-up" tag="div" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              <ProductCard
                v-for="product in sortedProducts"
                :key="product._id"
                :product="product"
                class="motion-safe:animate-fadein"
              />
            </transition-group>

            <!-- Empty State -->
            <div v-if="!isLoading && !error && sortedProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center col-span-full">
              <p class="text-xl font-medium text-gray-400">No products match your criteria.</p>
              <p class="text-sm text-gray-300 mt-2">Try selecting 'All' or adjusting the sort option.</p>
            </div>
            
            <!-- Pagination Placeholder -->
            <div class="col-span-full flex justify-center mt-10">
              <div class="flex items-center space-x-2">
                <a href="#" class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100">&larr;</a>
                <a href="#" class="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full bg-gray-900 text-white">1</a>
                <a href="#" class="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full hover:bg-gray-200">2</a>
                <a href="#" class="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full hover:bg-gray-200">3</a>
                <a href="#" class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100">&rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Mobile Filter Modal/Sidebar -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end md:hidden"
      @click.self="closeSidebar"
    >
      <div class="w-3/4 max-w-sm bg-[#f7f7f7] rounded-l-2xl p-6 shadow-2xl overflow-y-auto animate-slidein">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
            <h3 class="text-xl font-semibold">Filter</h3>
            <button @click="closeSidebar" aria-label="Close Filter" class="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Category Filter -->
        <div class="mb-6">
            <h3 class="font-medium mb-3">Category</h3>
            <ul class="space-y-2 text-gray-600">
              <li v-for="cat in categoriesWithAll" :key="cat._id || 'all'">
                <a 
                  href="#" 
                  @click.prevent="selectCategory(cat._id || 'All')"
                  :class="['text-base block py-1 hover:text-gray-900', { 'font-bold text-gray-900': selectedCategoryId === cat._id }]"
                >
                  {{ cat.name }} ({{ cat.count }})
                </a>
              </li>
            </ul>
        </div>
        
        <button
          @click="closeSidebar"
          class="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all duration-300 mt-6"
        >
          View {{ sortedProducts.length }} Items
        </button>
      </div>
    </div>

    <!-- Footer Component -->
    <PageFooter />
  </div>
</template>

<style scoped>
/* Custom CSS from the HTML for the aesthetic */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f7f7f7;
    color: #1a1a1a;
}
.ios-header-blur {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.ios-card-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ios-card-shadow:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
}
.aspect-square {
    aspect-ratio: 1 / 1;
}

/* Vue Animations */
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

.motion-safe\:animate-fadein {
  animation: fadein 0.6s ease-out;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slidein {
  from { transform: translateX(100%); opacity: 1; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slidein {
  animation: slidein 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

