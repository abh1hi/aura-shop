<template>
  <div class="product-page bg-white min-h-screen font-sans">
    <!-- Product Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Product Images -->
      <div class="relative group">
        <img
          :src="selectedImage"
          :alt="product.name"
          class="w-full h-[500px] object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
        />
        <div class="flex mt-4 gap-4">
          <img
            v-for="(img, index) in product.gallery || [product.imageUrl]"
            :key="index"
            :src="img"
            class="w-20 h-20 object-cover rounded-xl cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
            @click="selectedImage = img"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          <p class="text-2xl text-gray-800 font-semibold mb-6">${{ product.price.toFixed(2) }}</p>

          <!-- Options -->
          <div class="mb-6">
            <div v-if="product.sizes?.length">
              <h4 class="text-sm font-semibold text-gray-500 mb-2">Size</h4>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  @click="selectedSize = size"
                  :class="[
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <div v-if="product.colors?.length" class="mt-4">
              <h4 class="text-sm font-semibold text-gray-500 mb-2">Color</h4>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  @click="selectedColor = color"
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-all',
                    selectedColor === color
                      ? 'border-gray-900'
                      : 'border-gray-300'
                  ]"
                  :style="{ backgroundColor: color }"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 flex-wrap mt-6">
          <button
            @click="buyNow"
            class="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors duration-300 flex-1"
          >
            Buy Now
          </button>
          <button
            @click="addToCart"
            class="bg-white text-black border border-gray-300 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex-1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Product Tabs -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="border-b border-gray-200 mb-6 flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'pb-2 font-semibold text-gray-700 transition-all',
            activeTab === tab ? 'border-b-2 border-black text-black' : 'hover:text-gray-900'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content text-gray-700 space-y-6">
        <!-- Description -->
        <div v-if="activeTab === 'Description'">
          <p>{{ product.description }}</p>
        </div>

        <!-- Specifications -->
        <div v-if="activeTab === 'Specifications'">
          <ul class="space-y-2">
            <li v-for="(spec, index) in product.specs" :key="index" class="flex justify-between border-b border-gray-100 py-2">
              <span class="font-medium text-gray-600">{{ spec.key }}</span>
              <span class="text-gray-800">{{ spec.value }}</span>
            </li>
          </ul>
        </div>

        <!-- Reviews -->
        <div v-if="activeTab === 'Reviews'">
          <div v-if="reviews.length === 0" class="text-gray-400">No reviews yet.</div>
          <div v-for="review in reviews" :key="review.id" class="p-4 border rounded-xl mb-4 shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">{{ review.user }}</span>
              <span class="text-yellow-500">{{ '★'.repeat(review.rating) }}</span>
            </div>
            <p class="text-gray-700">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Related Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard
          v-for="related in relatedProducts"
          :key="related._id"
          :product="related"
          class="motion-safe:animate-fadein"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import cartService from '../services/cartService';
import { useRouter } from 'vue-router';

const router = useRouter();

const product = ref({
  _id: '1',
  name: 'MetaBerry Luxe Jacket',
  price: 299.99,
  imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop',
  description: 'A premium jacket for the modern Gen-Z individual. Ethically made with high-quality sustainable materials.',
  gallery: [
    'https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1887&auto=format&fit=crop'
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['#000000', '#ffffff', '#b5651d'],
  specs: [
    { key: 'Material', value: 'Organic Cotton & Recycled Polyester' },
    { key: 'Fit', value: 'Regular' },
    { key: 'Care', value: 'Machine Washable' },
    { key: 'Made In', value: 'Italy' }
  ]
});

const relatedProducts = ref([
  { _id: '2', name: 'Luxe Tee', price: 49.99, imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1770&auto=format&fit=crop' },
  { _id: '3', name: 'Slim-Fit Denim', price: 120.0, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop' },
  { _id: '4', name: 'Merino Wool Sweater', price: 150.0, imageUrl: 'https://images.unsplash.com/photo-1584273142342-294256955942?q=80&w=1887&auto=format&fit=crop' }
]);

const reviews = ref([
  { id: 1, user: 'Alex G.', rating: 5, comment: 'Absolutely love this jacket! Fits perfectly and feels premium.' },
  { id: 2, user: 'Jordan L.', rating: 4, comment: 'Great quality but a bit snug on the arms.' }
]);

const selectedImage = ref(product.value.imageUrl);
const selectedSize = ref(null);
const selectedColor = ref(null);

const addToCart = async () => {
  try {
    await cartService.addItem({ productId: product.value._id, quantity: 1 });
    alert('Added to cart!');
  } catch (err) {
    console.error(err);
  }
};

const buyNow = () => {
  router.push({ name: 'Checkout', query: { productId: product.value._id } });
};

// Tabs
const tabs = ['Description', 'Specifications', 'Reviews'];
const activeTab = ref('Description');
</script>

<style scoped>
.product-page {
  font-family: 'Helvetica Neue', sans-serif;
}
.motion-safe\:animate-fadein {
  animation: fadein 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
