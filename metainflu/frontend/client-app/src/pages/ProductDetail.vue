<template>
  <div class="product-detail-page">
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
    </div>
    <div v-else-if="error" class="error-container">
      <p><strong>Oops!</strong> {{ error }}</p>
      <p class="text-gray-500">Please try refreshing the page.</p>
    </div>

    <div v-else-if="product" class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div class="image-gallery">
          <div class="main-image-wrapper">
            <img :src="selectedImage" :alt="product.name" class="main-image" />
          </div>
          <div class="thumbnail-grid">
            <img
              v-for="(image, index) in productImages"
              :key="index"
              :src="image"
              @click="selectedImage = image"
              :class="['thumbnail-image', { 'active': selectedImage === image }]"
            />
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{{ product.name }}</h1>
          <p class="text-2xl font-semibold text-gray-800 mb-6">${{ displayedPrice }}</p>

          <!-- Variant Selection -->
          <div v-for="(options, name) in variantOptions" :key="name" class="mb-6">
            <h3 class="text-sm font-medium text-gray-800 mb-3">{{ name }}</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="value in options"
                :key="value"
                @click="selectVariant(name, value)"
                :class="['variant-button', { 'active': selectedVariants[name] === value }]"
              >
                {{ value }}
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4 mt-8">
            <button @click="addToCart" class="add-to-cart-btn">Add to Cart</button>
            <button @click="buyNow" class="buy-now-btn">Buy Now</button>
          </div>

          <div v-if="selectedVariant && selectedVariant.stock < 10" class="mt-4 text-sm text-red-600">
            Only {{ selectedVariant.stock }} left!
          </div>

          <!-- Accordion for details -->
          <div class="mt-10">
            <div class="accordion-item">
              <button @click="toggleAccordion('description')" class="accordion-header">
                <span>Description</span>
                <i :class="['fas', accordion.description ? 'fa-minus' : 'fa-plus']"></i>
              </button>
              <div v-show="accordion.description" class="accordion-content">
                <p>{{ product.description }}</p>
              </div>
            </div>
            <div class="accordion-item">
              <button @click="toggleAccordion('details')" class="accordion-header">
                <span>Details</span>
                <i :class="['fas', accordion.details ? 'fa-minus' : 'fa-plus']"></i>
              </button>
              <div v-show="accordion.details" class="accordion-content">
                <!-- Placeholder for more details -->
                <p>More product details will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section v-if="relatedProducts.length" class="mt-20 pt-16 border-t border-gray-200">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">You Might Also Like</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <ProductCard v-for="related in relatedProducts" :key="related._id" :product="related" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';

const route = useRoute();
const product = ref(null);
const relatedProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);

const selectedImage = ref('');
const selectedVariants = ref({});
const accordion = ref({
  description: true,
  details: false,
});

const fetchProductData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const productId = route.params.id;
    product.value = await productService.getProductById(productId);
    // Mock related products for now
    relatedProducts.value = (await productService.getProducts()).slice(0, 4);

    if (product.value) {
      initializeDefaultVariant();
    }
  } catch (err) {
    console.error("Failed to load product data:", err);
    error.value = err.message || 'Failed to load product.';
  } finally {
    isLoading.value = false;
  }
};

const initializeDefaultVariant = () => {
  if (product.value.variants && product.value.variants.length > 0) {
    const defaultVariant = product.value.variants[0];
    defaultVariant.attributes.forEach(attr => {
      selectedVariants.value[attr.name] = attr.value;
    });
  } else {
    selectedImage.value = product.value.images.length > 0 ? product.value.images[0].url : '';
  }
};

const productImages = computed(() => {
  if (!product.value) return [];
  const images = new Set();
  if (product.value.images) {
    product.value.images.forEach(img => images.add(img.url));
  }
  if (product.value.variants) {
    product.value.variants.forEach(v => v.images.forEach(img => images.add(img)));
  }
  return Array.from(images);
});

const variantOptions = computed(() => {
  if (!product.value || !product.value.variants) return {};
  const options = {};
  product.value.variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (!options[attr.name]) {
        options[attr.name] = new Set();
      }
      options[attr.name].add(attr.value);
    });
  });
  Object.keys(options).forEach(key => {
    options[key] = Array.from(options[key]);
  });
  return options;
});

const selectedVariant = computed(() => {
  if (!product.value || !product.value.variants) return null;
  return product.value.variants.find(variant =>
    variant.attributes.every(attr => selectedVariants.value[attr.name] === attr.value)
  );
});

const displayedPrice = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.price.toFixed(2);
  }
  if (product.value && product.value.price) {
    return product.value.price.toFixed(2);
  }
  return '0.00';
});

const selectVariant = (name, value) => {
  selectedVariants.value = { ...selectedVariants.value, [name]: value };
};

const toggleAccordion = (section) => {
  accordion.value[section] = !accordion.value[section];
};

watch(selectedVariant, (newVariant) => {
  if (newVariant && newVariant.images && newVariant.images.length > 0) {
    selectedImage.value = newVariant.images[0];
  } else if (product.value && product.value.images.length > 0) {
    selectedImage.value = product.value.images[0].url;
  }
}, { immediate: true });

const addToCart = () => {
  if (selectedVariant.value) {
    console.log('Adding to cart:', product.value.name, selectedVariant.value);
    alert('Added to cart!');
  } else {
    alert('Please select all options');
  }
};

const buyNow = () => {
  if (selectedVariant.value) {
    console.log('Buying now:', product.value.name, selectedVariant.value);
    alert('Redirecting to checkout...');
  } else {
    alert('Please select all options');
  }
};

onMounted(() => {
  fetchProductData();
});

watch(() => route.params.id, () => {
  fetchProductData();
});

</script>

<style scoped>
.product-detail-page { background-color: #fff; }
.loading-container, .error-container { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 60vh; }
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #c19a6b; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.image-gallery { display: flex; flex-direction: column; gap: 1rem; }
.main-image-wrapper { background-color: #f1f1f1; border-radius: 1rem; overflow: hidden; aspect-ratio: 1 / 1; }
.main-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.main-image-wrapper:hover .main-image { transform: scale(1.05); }

.thumbnail-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
.thumbnail-image { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 0.5rem; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
.thumbnail-image:hover { border-color: #e0e0e0; }
.thumbnail-image.active { border-color: #c19a6b; transform: scale(1.05); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

.product-info { padding-top: 1rem; }

.variant-button {
  padding: 0.6rem 1.2rem;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}
.variant-button:hover { background-color: #f3f4f6; }
.variant-button.active { background-color: #1a1a1a; color: white; border-color: #1a1a1a; }

.add-to-cart-btn, .buy-now-btn {
  flex-grow: 1;
  padding: 1rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background-color: #fff;
  border: 2px solid #1a1a1a;
  color: #1a1a1a;
}
.add-to-cart-btn:hover { background-color: #1a1a1a; color: white; }

.buy-now-btn {
  background-color: #c19a6b;
  border: 2px solid #c19a6b;
  color: white;
}
.buy-now-btn:hover { background-color: #b38e5f; border-color: #b38e5f; transform: translateY(-2px); }

.accordion-item {
  border-bottom: 1px solid #e5e7eb;
}
.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}
.accordion-content {
  padding: 0.5rem 0 1.5rem;
  color: #4b5563;
}
</style>
