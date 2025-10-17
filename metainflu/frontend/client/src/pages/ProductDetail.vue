<template>
  <div class="product-page bg-white min-h-screen font-sans">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-lg text-gray-500">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 text-red-500 p-4 bg-red-100 rounded-lg">
      <p><strong>Error:</strong> {{ error }}</p>
      <p class="mt-2">Please try again later.</p>
    </div>

    <!-- Product Container -->
    <div v-else-if="product" class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Product Images -->
      <div class="relative group">
        <img
          :src="selectedImage"
          :alt="product.name"
          class="w-full h-[500px] object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
        />
        <div class="flex mt-4 gap-4">
          <img
            v-for="(img, index) in product.images"
            :key="index"
            :src="img.url"
            class="w-20 h-20 object-cover rounded-xl cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
            @click="selectedImage = img.url"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          <p v-if="product.variants && product.variants.length > 0" class="text-2xl text-gray-800 font-semibold mb-6">${{ product.variants[0].price.toFixed(2) }}</p>

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
    <div v-if="product" class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
    <section v-if="product" class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';
import cartService from '../services/cartService';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const relatedProducts = ref([]);
const reviews = ref([]);

const selectedImage = ref('');
const selectedVariant = ref(null);

const displayedPrice = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.price.toFixed(2);
  }
  if (product.value && product.value.variants && product.value.variants.length > 0) {
    return product.value.variants[0].price.toFixed(2);
  }
  return 'N/A';
});

const attributeOptions = computed(() => {
    if (!product.value || !product.value.variants) return [];

    const options = {};
    product.value.variants.forEach(variant => {
        variant.attributes.forEach(attr => {
            if (!options[attr.name]) {
                options[attr.name] = new Set();
            }
            options[attr.name].add(attr.value);
        });
    });

    return Object.keys(options).map(name => ({
        name,
        values: Array.from(options[name])
    }));
});

const selectedOptions = ref({});

const selectOption = (name, value) => {
    selectedOptions.value[name] = value;
    findMatchingVariant();
};

const findMatchingVariant = () => {
    if (!product.value || !product.value.variants) return;

    const matchingVariant = product.value.variants.find(variant => {
        return Object.keys(selectedOptions.value).every(key => {
            return variant.attributes.some(attr => attr.name === key && attr.value === selectedOptions.value[key]);
        });
    });

    if (matchingVariant) {
        selectedVariant.value = matchingVariant;
        if (matchingVariant.images && matchingVariant.images.length > 0) {
            selectedImage.value = matchingVariant.images[0];
        }
    }
};

onMounted(async () => {
  try {
    const productId = route.params.id;
    product.value = await productService.getProductById(productId);
    if (product.value) {
        if (product.value.variants && product.value.variants.length > 0) {
            selectedVariant.value = product.value.variants[0];
            // Set default selected options
            selectedVariant.value.attributes.forEach(attr => {
                selectedOptions.value[attr.name] = attr.value;
            });
        }
        if (product.value.images && product.value.images.length > 0) {
            selectedImage.value = product.value.images[0].url;
        }
    }
  } catch (err) {
    error.value = err.message || 'Failed to load product details.';
  } finally {
    isLoading.value = false;
  }
});

const addToCart = async () => {
  try {
    await cartService.addItem({ productId: selectedVariant.value ? selectedVariant.value._id : product.value._id, quantity: 1 });
    alert('Added to cart!');
  } catch (err) {
    console.error(err);
  }
};

const buyNow = () => {
  router.push({ name: 'Checkout', query: { productId: selectedVariant.value ? selectedVariant.value._id : product.value._id } });
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