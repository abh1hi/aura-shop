<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import productService from '../services/productService';
import categoryService from '../services/categoryService'; 
// 1. IMPORT THE DEDICATED PRODUCT CARD COMPONENT
import ProductCard from '../components/ProductCard.vue'; 

// --- INLINE COMPONENTS ---

// 1. Navbar/Header Component (Kept minimal and inline for single-file approach)
const AuraNavbar = {
  emits: ['toggle-filter'],
  template: `
    <header class="ios-header-blur sticky top-0 z-50 transition duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" class="text-2xl font-extrabold tracking-tight text-gray-900">AURA</a>
        <nav class="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" class="hover:text-gray-700 transition duration-150 nav-link font-bold text-gray-900 border-b-2 border-gray-900">Shop All</a>
          <a href="#" class="hover:text-gray-700 transition duration-150 nav-link">New Arrivals</a>
          <a href="#" class="hover:text-gray-700 transition duration-150 nav-link">Lookbook</a>
          <a href="#" class="hover:text-gray-700 transition duration-150 nav-link">Our Story</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button aria-label="Search" class="p-2 rounded-full hover:bg-gray-100 transition duration-150">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <button aria-label="Cart (0 items)" class="p-2 rounded-full hover:bg-gray-100 transition duration-150 relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </button>
          <!-- Mobile Menu Button -->
          <button @click="$emit('toggle-filter')" aria-label="Menu" class="md:hidden p-2 rounded-full hover:bg-gray-100 transition duration-150">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  `,
};

// 2. Product Card Component: REMOVED INLINE DEFINITION HERE

// 3. Footer Component (Inline definition retained)
const PageFooter = {
  template: `
    <footer class="mt-20 border-t border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-lg font-bold mb-4">AURA</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">About Us</a></li>
              <li><a href="#" class="hover:text-gray-900">Careers</a></li>
              <li><a href="#" class="hover:text-gray-900">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Customer Care</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Shipping & Returns</a></li>
              <li><a href="#" class="hover:text-gray-900">Contact</a></li>
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
          <p class="text-xs text-gray-500">&copy; 2024 AURA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
};


// --- SHOP PAGE LOGIC (UPDATED) ---

const allProducts = ref([]);
const categories = ref([]); // Stores fetched approved categories { _id, name }
const selectedCategoryId = ref('All'); 
const isSidebarOpen = ref(false); 
const sortOption = ref('new'); 
const isLoading = ref(true);
const error = ref(null);

const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
const closeSidebar = () => (isSidebarOpen.value = false);

/**
 * Sets the selected category ID and triggers a new product fetch.
 * @param {string} id - The MongoDB ObjectID of the selected category, or 'All'.
 */
const selectCategory = (id) => {
  if (selectedCategoryId.value === id) return; // Prevent unnecessary re-fetches
  selectedCategoryId.value = id;
  fetchProducts(id); 
  closeSidebar();
};

/**
 * Fetches all products based on the currently selected filter.
 * @param {string} categoryId - The MongoDB ObjectID or 'All'.
 */
const fetchProducts = async (categoryId = selectedCategoryId.value) => {
  isLoading.value = true;
  error.value = null;
  allProducts.value = [];
  
  try {
    const filterId = categoryId === 'All' ? null : categoryId;
    // The productService is designed to handle passing the filter parameter
    const data = await productService.getProducts(filterId);
    
    // Assign fetched data 
    allProducts.value = data; 
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = err.message || 'Failed to load products from the store.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Fetches all approved categories for the filter sidebar.
 */
const fetchCategories = async () => {
    try {
        const data = await categoryService.getCategories();
        categories.value = data;
    } catch (err) {
        console.error('Error fetching categories for filter:', err);
        error.value = error.value || 'Could not load category filters.';
    }
};


// Computed property to add the "All Products" option to the fetched category list
const categoriesWithAll = computed(() => {
  // Use category._id as the unique key
  return [{ _id: 'All', name: 'All Products' }, ...categories.value];
});


// Computed property to apply client-side sorting on the fetched list
const sortedProducts = computed(() => {
  let products = [...allProducts.value];
  if (sortOption.value === 'low-high') {
    return products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption.value === 'high-low') {
    return products.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption.value === 'new') {
    // Sort by createdAt descending (newest first)
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return products; // Default
});


// On Component Mount: Fetch everything
onMounted(() => {
  fetchCategories();
  fetchProducts(); // Initial fetch (All products)
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f7] text-[#1a1a1a] font-sans overflow-x-hidden">
    
    <!-- Navbar Component -->
    <AuraNavbar @toggle-filter="toggleSidebar" />

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
                  <li v-for="cat in categoriesWithAll" :key="cat._id">
                    <a 
                      href="#" 
                      @click.prevent="selectCategory(cat._id)"
                      :class="['hover:text-gray-900 transition duration-150', { 'font-semibold text-gray-900': selectedCategoryId === cat._id }]"
                    >
                      {{ cat.name }} 
                    </a>
                  </li>
                </ul>
              </div>
              
              <!-- Color Filter (Static Placeholder) -->
              <div>
                <h3 class="font-medium mb-2">Color</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="w-6 h-6 rounded-full bg-black border border-gray-400 cursor-pointer transition hover:scale-110"></span>
                  <span class="w-6 h-6 rounded-full bg-white border border-gray-400 ring-2 ring-transparent hover:ring-gray-900 cursor-pointer transition"></span>
                  <span class="w-6 h-6 rounded-full bg-neutral-500 cursor-pointer transition hover:scale-110"></span>
                  <span class="w-6 h-6 rounded-full bg-stone-700 cursor-pointer transition hover:scale-110"></span>
                </div>
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
            
            <!-- Loading/Error State -->
            <div v-if="isLoading" class="text-center py-20 col-span-full">
              <p class="text-xl font-medium text-gray-500">Loading products... </p>
            </div>
             <div v-else-if="error" class="text-center py-20 col-span-full text-red-500">
              <p class="text-xl font-medium">Error loading data: {{ error }}</p>
              <button @click="fetchProducts" class="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Try Reloading</button>
            </div>

            <!-- Product Grid -->
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
            
            <!-- Pagination (Static representation) -->
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

        <!-- Category Filter (Mobile) -->
        <div class="mb-6">
            <h3 class="font-medium mb-3">Category</h3>
            <ul class="space-y-2 text-gray-600">
              <li v-for="cat in categoriesWithAll" :key="cat._id">
                <a 
                  href="#" 
                  @click.prevent="selectCategory(cat._id)"
                  :class="['text-base block py-1 hover:text-gray-900', { 'font-bold text-gray-900': selectedCategoryId === cat._id }]"
                >
                  {{ cat.name }}
                </a>
              </li>
            </ul>
        </div>

        <!-- Color Filter (Static Placeholder) -->
        <div class="mb-6">
            <h3 class="font-medium mb-3">Color</h3>
            <div class="flex flex-wrap gap-2">
                <span class="w-8 h-8 rounded-full bg-black border border-gray-400 cursor-pointer"></span>
                <span class="w-8 h-8 rounded-full bg-white border border-gray-400 cursor-pointer"></span>
                <span class="w-8 h-8 rounded-full bg-neutral-500 cursor-pointer"></span>
                <span class="w-8 h-8 rounded-full bg-stone-700 cursor-pointer"></span>
            </div>
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
