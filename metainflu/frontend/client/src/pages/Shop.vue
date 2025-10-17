<script setup>
import { ref, computed, onMounted } from 'vue';

// --- MOCK SERVICE & DATA (Since external service imports are not allowed in single files) ---

const mockProducts = [
  { _id: 1, name: 'Structured Blazer', price: 290, category: 'Outerwear', img: 'https://placehold.co/600x600/e5e7eb/374151?text=Blazer', createdAt: new Date('2024-01-10') },
  { _id: 2, name: 'Slim Trousers', price: 150, category: 'Bottoms', img: 'https://placehold.co/600x600/d1d5db/374151?text=Trousers', createdAt: new Date('2024-01-15') },
  { _id: 3, name: 'Ribbed Turtleneck', price: 90, category: 'Knitwear', img: 'https://placehold.co/600x600/e5e7eb/374151?text=Turtleneck', createdAt: new Date('2024-02-01') },
  { _id: 4, name: 'Leather Belt', price: 75, category: 'Accessories', img: 'https://placehold.co/600x600/d1d5db/374151?text=Belt', createdAt: new Date('2024-02-20') },
  { _id: 5, name: 'Cashmere Scarf', price: 110, category: 'Accessories', img: 'https://placehold.co/600x600/e5e7eb/374151?text=Scarf', createdAt: new Date('2024-03-05') },
  { _id: 6, name: 'Wool Overshirt', price: 180, category: 'Outerwear', img: 'https://placehold.co/600x600/d1d5db/374151?text=Overshirt', createdAt: new Date('2024-03-10') },
  { _id: 7, name: 'Straight-Fit Jeans', price: 165, category: 'Bottoms', img: 'https://placehold.co/600x600/e5e7eb/374151?text=Jeans', createdAt: new Date('2024-03-25') },
  { _id: 8, name: 'V-Neck Jumper', price: 85, category: 'Knitwear', img: 'https://placehold.co/600x600/d1d5db/374151?text=Jumper', createdAt: new Date('2024-04-01') },
];

// --- INLINE COMPONENTS ---

// 1. Navbar/Header Component
const AuraNavbar = {
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

// 2. Product Card Component
const ProductCard = {
  props: ['product'],
  template: `
    <div class="group cursor-pointer">
      <div class="aspect-square bg-white rounded-xl overflow-hidden ios-card-shadow mb-4">
        <img :src="product.img" :alt="product.name" class="w-full h-full object-cover group-hover:scale-[1.05] transition duration-500" onerror="this.onerror=null; this.src='https://placehold.co/600x600/e5e7eb/374151?text=Image+Error'">
      </div>
      <p class="text-sm text-gray-700 tracking-wide">{{ product.category }}</p>
      <h3 class="text-lg font-medium mt-1">{{ product.name }}</h3>
      <p class="text-md font-semibold mt-1">\${{ product.price }}</p>
    </div>
  `,
};

// 3. Footer Component
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


// --- SHOP ALL LOGIC ---

const allProducts = ref([]);
// Extracted categories from mock data, plus 'All'
const categories = ref(['All', 'Outerwear', 'Bottoms', 'Knitwear', 'Accessories']);
const selectedCategory = ref('All');
// Renamed to follow new design (sidebar open on mobile)
const isSidebarOpen = ref(false); 
const sortOption = ref('new'); // Default to 'Newest First' from new HTML

const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
const closeSidebar = () => (isSidebarOpen.value = false);
const selectCategory = cat => {
  selectedCategory.value = cat;
  closeSidebar(); // Close sidebar on mobile after selecting
};

// Categories with counts for the sidebar display
const categoriesWithCounts = computed(() => {
  const counts = allProducts.value.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return categories.value
    .filter(cat => cat !== 'All')
    .map(cat => ({
      name: cat,
      count: counts[cat] || 0,
      slug: cat.toLowerCase().replace(/\s/g, '_'),
    }));
});


const filteredProducts = computed(() => {
  let products = allProducts.value;
  if (selectedCategory.value !== 'All') {
    products = products.filter(p => p.category === selectedCategory.value);
  }
  // The new design removes the complex price filtering from the UI, so we remove the logic here.
  return products;
});

const sortedProducts = computed(() => {
  let products = [...filteredProducts.value];
  if (sortOption.value === 'low-high') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'high-low') {
    return products.sort((a, b) => b.price - a.price);
  } else if (sortOption.value === 'new') {
    // Sort by createdAt descending
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return products; // 'default' or unknown
});


onMounted(async () => {
  // Mock data loading
  allProducts.value = mockProducts;
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
                  <li v-for="cat in categoriesWithCounts" :key="cat.slug">
                    <a 
                      href="#" 
                      @click.prevent="selectCategory(cat.name)"
                      :class="['hover:text-gray-900 transition duration-150', { 'font-semibold text-gray-900': selectedCategory === cat.name }]"
                    >
                      {{ cat.name }} ({{ cat.count }})
                    </a>
                  </li>
                </ul>
              </div>
              
              <!-- Color Filter (Static representation from HTML) -->
              <div>
                <h3 class="font-medium mb-2">Color</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="w-6 h-6 rounded-full bg-black border border-gray-400 cursor-pointer transition hover:scale-110"></span>
                  <span class="w-6 h-6 rounded-full bg-white border border-gray-400 ring-2 ring-transparent hover:ring-gray-900 cursor-pointer transition"></span>
                  <span class="w-6 h-6 rounded-full bg-neutral-500 cursor-pointer transition hover:scale-110"></span>
                  <span class="w-6 h-6 rounded-full bg-stone-700 cursor-pointer transition hover:scale-110"></span>
                </div>
              </div>
              
              <!-- Sort By Dropdown (Duplicated for consistency, though primary sort is in grid header) -->
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
            <!-- Mobile Sort/Filter Header (Replaces the old floating bar logic) -->
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

            <!-- Grid Display -->
            <transition-group name="fade-up" tag="div" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              <ProductCard
                v-for="product in sortedProducts"
                :key="product._id"
                :product="product"
                class="motion-safe:animate-fadein"
              />
            </transition-group>

            <!-- Empty State -->
            <div v-if="sortedProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center col-span-full">
              <p class="text-xl font-medium text-gray-400">No products match your criteria.</p>
              <p class="text-sm text-gray-300 mt-2">Try selecting 'All' or adjusting the sort option.</p>
            </div>
            
            <!-- Pagination (Static representation from HTML) -->
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
              <li v-for="cat in categoriesWithCounts" :key="cat.slug">
                <a 
                  href="#" 
                  @click.prevent="selectCategory(cat.name)"
                  :class="['text-base block py-1 hover:text-gray-900', { 'font-bold text-gray-900': selectedCategory === cat.name }]"
                >
                  {{ cat.name }} ({{ cat.count }})
                </a>
              </li>
            </ul>
        </div>

        <!-- Color Filter -->
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
