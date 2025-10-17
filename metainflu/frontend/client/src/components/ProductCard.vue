<template>
  <div
    class="product-card relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 ease-[0.4,0,0.2,1] cursor-pointer"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Image Container -->
    <div class="relative group overflow-hidden">
      <template v-if="product.images && product.images.length > 1">
        <img
          v-for="(image, index) in product.images"
          :key="index"
          :src="image.url"
          :alt="product.name"
          class="w-full h-80 object-cover transition-opacity duration-500 absolute inset-0"
          :class="{ 'opacity-100': index === currentImageIndex, 'opacity-0': index !== currentImageIndex }"
        />
        <!-- Manual Controls -->
        <div class="absolute inset-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button @click.stop="prevImage" class="bg-black/30 text-white p-2 rounded-full ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click.stop="nextImage" class="bg-black/30 text-white p-2 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </template>
      <img
        v-else-if="product.images && product.images.length > 0"
        :src="product.images[0].url"
        :alt="product.name"
        class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Glassy overlay with action buttons -->
      <div
        class="absolute inset-0 bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3"
      >
        <button
          @click.stop="buyNow"
          class="bg-black/90 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-black transition-colors duration-300"
        >
          Buy Now
        </button>
        <button
          @click.stop="addToCart"
          class="bg-white/90 text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors duration-300 border border-gray-200"
        >
          Add to Cart
        </button>
        <button
          @click.stop="viewDetails"
          class="bg-transparent text-black/90 px-6 py-2 rounded-full text-sm font-semibold hover:text-black/100 transition-colors duration-300 border border-gray-300"
        >
          View Details
        </button>
      </div>
        <!-- Slideshow Dots -->
      <div v-if="product.images && product.images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <span
          v-for="(image, index) in product.images"
          :key="index"
          class="w-2 h-2 rounded-full transition-colors"
          :class="{ 'bg-white': index === currentImageIndex, 'bg-white/50': index !== currentImageIndex }"
        ></span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4 text-center">
      <h3 class="text-lg font-medium text-gray-900 truncate">{{ product.name }}</h3>
      <p class="text-sm text-gray-500 mt-1">${{ product.price ? product.price.toFixed(2) : 'N/A' }}</p>
    </div>

    <!-- Subtle Hover Shadow Glow -->
    <div
      class="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style="box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import cartService from '../services/cartService';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const isAdding = ref(false);
const isAdded = ref(false);

const currentImageIndex = ref(0);

const nextImage = () => {
  if (props.product.images && props.product.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.product.images.length;
  }
};

const prevImage = () => {
  if (props.product.images && props.product.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value - 1 + props.product.images.length) % props.product.images.length;
  }
};

let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    nextImage();
  }
  if (touchStartX - touchEndX < -50) {
    prevImage();
  }
};


const addToCart = async () => {
  isAdding.value = true;
  try {
    await cartService.addItem({ productId: props.product._id, quantity: 1 });
    isAdded.value = true;
    setTimeout(() => (isAdded.value = false), 2000);
  } catch (err) {
    console.error('Add to cart failed', err);
  } finally {
    isAdding.value = false;
  }
};

const buyNow = () => {
  router.push({ name: 'Checkout', query: { productId: props.product._id } });
};

const viewDetails = () => {
  router.push({ name: 'ProductDetail', params: { id: props.product._id } });
};
</script>

<style scoped>
.product-card {
  perspective: 1000px;
}

/* Optional 3D tilt effect on hover */
.product-card:hover img {
  transform: scale(1.05) rotateX(1deg) rotateY(1deg);
}
</style>