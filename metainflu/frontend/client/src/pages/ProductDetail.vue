<template>
  <div class="product-page bg-white dark:bg-gray-900 min-h-screen font-sans">
    <!-- Loading & Error States -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
      <span class="loader"></span>
    </div>
    <div v-else-if="error" class="text-center py-12 text-red-500 bg-red-50 rounded-xl m-8">
      <span class="font-semibold">Oops: {{ error }}</span>
      <p class="mt-2 text-gray-400">Try refreshing in a minute.</p>
    </div>

    <!-- Main Product Section -->
    <section v-else class="container mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <!-- Images with minimal thumbnails and motion -->
      <div>
        <div class="h-[420px] rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg">
          <img :src="selectedImage" :alt="product.name" class="object-contain h-full w-full transition-transform duration-300 hover:scale-105"/>
        </div>
        <div class="flex space-x-2 mt-4">
          <img
            v-for="img in product.images"
            :key="img"
            :src="img"
            @click="selectedImage = img"
            :class="['w-16 h-16 rounded-xl cursor-pointer border transition-all', selectedImage === img ? 'border-black dark:border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100']"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col gap-5">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {{ product.name }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-100 opacity-80">{{ product.shortDescription }}</p>
        <div class="text-2xl font-semibold mb-3">
          ${{ displayedPrice }}
        </div>
        <!-- Size and color options as minimalist pills -->
        <div v-if="attributeOptions.length" class="flex gap-4 mb-3">
          <div v-for="attr in attributeOptions" :key="attr.name" class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ attr.name }}:</span>
            <div class="flex gap-2">
              <button
                v-for="val in attr.values"
                :key="val"
                @click="selectOption(attr.name, val)"
                :class="['px-3 py-1 rounded-full text-xs font-medium border transition', selectedOptions[attr.name] === val ? 'bg-black text-white dark:bg-white dark:text-black border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:border-gray-400']">
                {{ val }}
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-4">
          <button @click="buyNow"
            class="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-base font-bold tracking-wide transition-all shadow hover:scale-105">
            Buy Now
          </button>
          <button @click="addToCart"
            class="bg-transparent dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white px-7 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>

        <!-- Micro-interaction: Stock info -->
        <div v-if="product.stock < 10" class="mt-2 text-sm text-red-500">Only {{ product.stock }} left in stock!</div>
      </div>
    </section>

    <!-- Tabs for Details, using progressive disclosure -->
    <nav v-if="product" class="container mx-auto px-4 md:px-8">
      <div class="flex border-b border-gray-200 dark:border-gray-600 text-xl gap-8 py-2 mb-7">
        <button v-for="tab in tabs" :key="tab"
          @click="activeTab = tab"
          :class="['pb-1 border-b-2 transition-all', activeTab === tab ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white']">
          {{ tab }}
        </button>
      </div>
      <div class="py-2 text-gray-900 dark:text-gray-100 text-base">
        <div v-if="activeTab === 'Description' || !activeTab">
          <p class="max-w-prose">{{ product.description }}</p>
        </div>
        <div v-else-if="activeTab === 'Specifications'">
          <dl>
            <div v-for="spec in product.specs" :key="spec.key" class="py-1 grid grid-cols-[1fr_2fr] text-base opacity-85">
              <dt class="text-gray-500">{{ spec.key }}</dt>
              <dd class="text-gray-900 dark:text-gray-100">{{ spec.value }}</dd>
            </div>
          </dl>
        </div>
        <div v-else-if="activeTab === 'Reviews'">
          <div v-if="reviews.length === 0" class="text-gray-400">No reviews yet.</div>
          <div v-for="review in reviews" :key="review.id" class="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 mb-2 shadow transition">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">{{ review.user }}</span>
              <span class="text-yellow-500">{{ '★'.repeat(review.rating) }}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-200">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </nav>

    <!-- Related Products: minimalist grid cards -->
    <section v-if="relatedProducts.length" class="container mx-auto px-4 md:px-8 py-14">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-7 text-center tracking-wider">Related Products</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard v-for="related in relatedProducts" :key="related._id" :product="related" />
      </div>
    </section>
  </div>
</template>

<script setup>
/* (Reuse and lightly refactor your composable logic, adjusting for attributeOptions/selectOption as you had). Use the structure and mock product data shown below for layout demonstration. */
import { ref, onMounted, computed } from 'vue';

const product = ref({
  name: 'Minimalist Running Shoe',
  shortDescription: 'Superlight, ultra-flex, ethically made.',
  description: 'This sleek running shoe redefines barefoot comfort, crafted for sustainable performance. High-vent mesh, bio foam, and grippy minimalist outsole for all distances.',
  images: [
    'https://source.unsplash.com/random/500x400?sneaker,1',
    'https://source.unsplash.com/random/500x400?sneaker,2',
    'https://source.unsplash.com/random/500x400?sneaker,3'
  ],
  specs: [{ key: 'Weight', value: '175g' }, { key: 'Sole', value: 'BioRubber™' }, { key: 'Drop', value: '0 mm' }],
  variants: [{ price: 89.00, attributes: [{ name: 'Size', value: '8' }, { name: 'Color', value: 'Black' }] }],
  stock: 4,
});
const relatedProducts = ref([
  { _id: 1, name: 'Minimalist Sandal', price: 69, images: ['https://source.unsplash.com/random/400x300?sandal,1'] },
  { _id: 2, name: 'Barefoot Crew Sock', price: 15, images: ['https://source.unsplash.com/random/400x300?sock,1'] }
]);
const reviews = ref([{ id: 1, user: 'Amir', rating: 5, comment: 'Incredible comfort.' }]);

const isLoading = ref(false);
const error = ref(null);

// Tab logic, mimicking your original
const tabs = ['Description', 'Specifications', 'Reviews'];
const activeTab = ref('Description');

// Mock minimal logic for attributes/options
const selectedImage = ref(product.value.images[0]);
const attributeOptions = computed(() => [{
  name: 'Size', values: ['8', '9', '10']
}, {
  name: 'Color', values: ['Black', 'White']
}]);
const selectedOptions = ref({ Size: '8', Color: 'Black' });
const selectOption = (name, value) => (selectedOptions.value[name] = value);
const displayedPrice = computed(() => product.value.variants[0].price.toFixed(2));

// Replace stubs with proper cart/buy logic as needed
const addToCart = () => alert('Added to cart!');
const buyNow = () => alert('Proceeding to checkout');
</script>

<style scoped>
.loader { border: 4px solid #e5e7eb; border-radius: 50%; border-top: 4px solid #111; width: 36px; height: 36px; animation: spin 1s linear infinite; margin: auto; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
