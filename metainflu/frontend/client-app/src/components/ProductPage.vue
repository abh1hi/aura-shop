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
        <div class="flex mt-4 gap-4 overflow-x-auto">
          <img
            v-for="(img, index) in availableImages"
            :key="index"
            :src="typeof img === 'string' ? img : img.url"
            class="w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0"
            :class="selectedImage === (typeof img === 'string' ? img : img.url) ? 'border-gray-900' : 'border-transparent hover:border-gray-400'"
            @click="selectedImage = typeof img === 'string' ? img : img.url"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          <div class="price-section mb-6">
            <p class="text-2xl text-gray-800 font-semibold">${{ formatPrice(currentPrice) }}</p>
            <p v-if="priceRange" class="text-lg text-gray-600 mt-1">{{ priceRange }}</p>
            <div v-if="selectedVariant" class="text-sm text-gray-500 mt-2">
              <span v-if="selectedVariant.sku">SKU: {{ selectedVariant.sku }}</span>
              <span v-if="selectedVariant.stock !== undefined" class="ml-4">
                {{ selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock' }}
              </span>
            </div>
          </div>

          <!-- Variant Selection -->
          <div v-if="hasVariants" class="mb-6 space-y-4">
            <div v-for="attributeGroup in groupedAttributes" :key="attributeGroup.name">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ attributeGroup.name }}</h4>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="value in attributeGroup.values"
                  :key="value"
                  @click="selectAttribute(attributeGroup.name, value)"
                  :class="[
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                    selectedAttributes[attributeGroup.name] === value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
                  ]"
                  :disabled="!isAttributeValueAvailable(attributeGroup.name, value)"
                >
                  {{ value }}
                  <span v-if="!isAttributeValueAvailable(attributeGroup.name, value)" class="ml-2 text-xs opacity-50">(Out of stock)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Legacy Size/Color Options (fallback) -->
          <div v-else-if="product.sizes?.length || product.colors?.length" class="mb-6">
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
                      ? 'border-gray-900 ring-2 ring-gray-300'
                      : 'border-gray-300 hover:border-gray-500'
                  ]"
                  :style="{ backgroundColor: color }"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity Selector -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Quantity</h4>
          <div class="flex items-center gap-3">
            <button
              @click="decrementQuantity"
              :disabled="quantity <= 1"
              class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-minus text-sm"></i>
            </button>
            <span class="text-lg font-semibold min-w-[3rem] text-center">{{ quantity }}</span>
            <button
              @click="incrementQuantity"
              :disabled="!canIncreaseQuantity"
              class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-plus text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 flex-wrap mt-6">
          <button
            @click="buyNow"
            :disabled="!canAddToCart"
            class="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
          <button
            @click="handleAddToCart"
            :disabled="!canAddToCart || isAdding"
            class="bg-white text-black border border-gray-300 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isAdding ? 'Adding...' : canAddToCart ? 'Add to Cart' : 'Select Options' }}
          </button>
        </div>

        <!-- Variant Selection Status -->
        <div v-if="hasVariants && !allRequiredAttributesSelected" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p class="text-sm text-amber-800">
            <i class="fas fa-info-circle mr-2"></i>
            Please select all options to add this item to your cart.
          </p>
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
import { ref, computed, watch } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useCart } from '../composables/useCart';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addToCart } = useCart();

const isAdding = ref(false);
const quantity = ref(1);
const selectedAttributes = ref({});

// Legacy selections (fallback)
const selectedSize = ref(null);
const selectedColor = ref(null);

const product = ref({
  _id: '1',
  name: 'MetaBerry Luxe Jacket',
  price: 299.99,
  imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop',
  description: 'A premium jacket for the modern Gen-Z individual. Ethically made with high-quality sustainable materials.',
  images: [
    { url: 'https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1887&auto=format&fit=crop' }
  ],
  // Example variants structure based on your provided format
  variants: [
    {
      _id: '68f251df0eb8b0fbf0acb5e0',
      sku: 'ghd-1760711135938',
      attributes: [
        { name: 'Size', value: 'M' },
        { name: 'Color', value: 'Black' }
      ],
      price: 299.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop'],
      status: 'active',
      regionAvailability: []
    },
    {
      _id: '68f251df0eb8b0fbf0acb5e1',
      sku: 'ghd-1760711135939',
      attributes: [
        { name: 'Size', value: 'L' },
        { name: 'Color', value: 'Black' }
      ],
      price: 299.99,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop'],
      status: 'active',
      regionAvailability: []
    },
    {
      _id: '68f251df0eb8b0fbf0acb5e2',
      sku: 'ghd-1760711135940',
      attributes: [
        { name: 'Size', value: 'M' },
        { name: 'Color', value: 'Navy' }
      ],
      price: 309.99,
      stock: 3,
      images: ['https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1887&auto=format&fit=crop'],
      status: 'active',
      regionAvailability: []
    }
  ],
  specs: [
    { key: 'Material', value: 'Organic Cotton & Recycled Polyester' },
    { key: 'Fit', value: 'Regular' },
    { key: 'Care', value: 'Machine Washable' },
    { key: 'Made In', value: 'Italy' }
  ]
});

const relatedProducts = ref([
  { _id: '2', name: 'Luxe Tee', price: 49.99, images: [{ url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1770&auto=format&fit=crop' }] },
  { _id: '3', name: 'Slim-Fit Denim', price: 120.0, images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop' }] },
  { _id: '4', name: 'Merino Wool Sweater', price: 150.0, images: [{ url: 'https://images.unsplash.com/photo-1584273142342-294256955942?q=80&w=1887&auto=format&fit=crop' }] }
]);

const reviews = ref([
  { id: 1, user: 'Alex G.', rating: 5, comment: 'Absolutely love this jacket! Fits perfectly and feels premium.' },
  { id: 2, user: 'Jordan L.', rating: 4, comment: 'Great quality but a bit snug on the arms.' }
]);

const selectedImage = ref(product.value.imageUrl || (product.value.images?.[0]?.url));

// Variant handling
const hasVariants = computed(() => {
  return product.value.variants && product.value.variants.length > 0;
});

const availableVariants = computed(() => {
  if (!hasVariants.value) return [];
  return product.value.variants.filter(variant => variant.status === 'active');
});

// Group attributes by name
const groupedAttributes = computed(() => {
  if (!hasVariants.value) return [];
  
  const groups = {};
  
  availableVariants.value.forEach(variant => {
    if (variant.attributes) {
      variant.attributes.forEach(attr => {
        if (!groups[attr.name]) {
          groups[attr.name] = {
            name: attr.name,
            values: new Set()
          };
        }
        groups[attr.name].values.add(attr.value);
      });
    }
  });
  
  // Convert sets to arrays
  return Object.values(groups).map(group => ({
    ...group,
    values: Array.from(group.values)
  }));
});

// Find selected variant based on selected attributes
const selectedVariant = computed(() => {
  if (!hasVariants.value || !allRequiredAttributesSelected.value) {
    return null;
  }
  
  return availableVariants.value.find(variant => {
    if (!variant.attributes) return false;
    
    return variant.attributes.every(attr => 
      selectedAttributes.value[attr.name] === attr.value
    );
  });
});

// Check if all required attributes are selected
const allRequiredAttributesSelected = computed(() => {
  if (!hasVariants.value) return true;
  
  return groupedAttributes.value.every(group => 
    selectedAttributes.value[group.name]
  );
});

// Current price based on selected variant
const currentPrice = computed(() => {
  return selectedVariant.value?.price || product.value.price || 0;
});

// Price range for variants
const priceRange = computed(() => {
  if (!hasVariants.value || availableVariants.value.length <= 1) return null;
  
  const prices = availableVariants.value.map(v => v.price).filter(p => p != null);
  if (prices.length === 0) return null;
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (minPrice === maxPrice) return null;
  
  return `$${formatPrice(minPrice)} - $${formatPrice(maxPrice)}`;
});

// Available images from current variant or product
const availableImages = computed(() => {
  const images = [];
  
  // Add variant-specific images if available
  if (selectedVariant.value?.images?.length) {
    images.push(...selectedVariant.value.images);
  }
  
  // Add product images
  if (product.value.images?.length) {
    product.value.images.forEach(img => {
      const url = typeof img === 'string' ? img : img.url;
      if (url && !images.includes(url)) {
        images.push(img);
      }
    });
  }
  
  // Fallback to product imageUrl
  if (images.length === 0 && product.value.imageUrl) {
    images.push(product.value.imageUrl);
  }
  
  return images;
});

const canAddToCart = computed(() => {
  if (hasVariants.value && !allRequiredAttributesSelected.value) return false;
  if (selectedVariant.value && selectedVariant.value.stock <= 0) return false;
  if (!hasVariants.value && (!product.value.stock || product.value.stock <= 0)) return false;
  return true;
});

const canIncreaseQuantity = computed(() => {
  const maxStock = selectedVariant.value?.stock || product.value.stock || 0;
  return quantity.value < maxStock;
});

// Utility functions
const formatPrice = (price) => {
  if (!price || price === 0) return '0.00';
  return parseFloat(price).toFixed(2);
};

const selectAttribute = (attributeName, value) => {
  selectedAttributes.value[attributeName] = value;
};

const isAttributeValueAvailable = (attributeName, value) => {
  return availableVariants.value.some(variant => 
    variant.stock > 0 && 
    variant.attributes?.some(attr => attr.name === attributeName && attr.value === value)
  );
};

const incrementQuantity = () => {
  if (canIncreaseQuantity.value) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!canAddToCart.value || isAdding.value) return;

  isAdding.value = true;
  try {
    const cartData = {
      productId: product.value._id,
      quantity: quantity.value
    };

    // Add variant information if available
    if (selectedVariant.value) {
      cartData.variantId = selectedVariant.value._id;
      cartData.variant = {
        _id: selectedVariant.value._id,
        sku: selectedVariant.value.sku,
        price: selectedVariant.value.price,
        attributes: selectedVariant.value.attributes || [],
        images: selectedVariant.value.images || [],
        stock: selectedVariant.value.stock
      };
    } else if (selectedSize.value || selectedColor.value) {
      // Fallback for legacy size/color selection
      cartData.variant = {
        size: selectedSize.value,
        color: selectedColor.value,
        price: product.value.price
      };
    }

    console.log('Adding to cart with full variant data:', cartData);
    const result = await addToCart(cartData);
    console.log('Successfully added to cart:', result);
    
    // Show success message (you can customize this)
    alert('Added to cart!');
    
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert('Failed to add item to cart. Please try again.');
  } finally {
    isAdding.value = false;
  }
};

const buyNow = () => {
  if (!canAddToCart.value) return;
  
  router.push({ 
    name: 'Checkout', 
    query: { 
      productId: product.value._id,
      variantId: selectedVariant.value?._id,
      quantity: quantity.value
    } 
  });
};

// Watch for variant changes to update selected image
watch(selectedVariant, (newVariant) => {
  if (newVariant?.images?.length > 0) {
    selectedImage.value = newVariant.images[0];
  }
}, { immediate: true });

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

@keyframes fadein {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>