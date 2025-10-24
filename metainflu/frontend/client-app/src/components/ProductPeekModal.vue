<!-- ProductPeekModal.vue -->
<template>
  <transition name="peek-fade" appear>
    <div 
      v-if="isVisible" 
      class="peek-overlay" 
      @click="closePeek"
      @touchstart.prevent="closePeek"
    >
      <div 
        class="peek-modal"
        :class="{ 'mobile': isMobile }"
        @click.stop
        @touchstart.stop
      >
        <!-- Close button -->
        <button class="peek-close" @click="closePeek">
          <i class="fas fa-times"></i>
        </button>

        <!-- Product variants gallery -->
        <div class="peek-gallery">
          <div class="main-image">
            <img 
              :src="selectedVariant?.images?.[0] || product.images?.[0]?.url" 
              :alt="product.name"
            />
          </div>
          
          <!-- Variants selection -->
          <div class="variants-grid">
            <div 
              v-for="variant in product.variants" 
              :key="variant.sku || variant._id"
              class="variant-option"
              :class="{ 'active': selectedVariant?._id === variant._id }"
              @click="selectVariant(variant)"
            >
              <img 
                :src="variant.images?.[0] || product.images?.[0]?.url" 
                :alt="`${product.name} - ${variant.attributes?.color || 'Variant'}`"
              />
              <span class="variant-label">
                {{ variant.attributes?.color || variant.attributes?.size || 'Variant' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product details -->
        <div class="peek-details">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="product-price">₹{{ selectedVariant?.price || product.price }}</p>
          
          <!-- Quick details -->
          <div class="quick-details">
            <div class="detail-item" v-if="selectedVariant?.attributes?.size">
              <span class="label">Size:</span>
              <span class="value">{{ selectedVariant.attributes.size }}</span>
            </div>
            <div class="detail-item" v-if="selectedVariant?.attributes?.color">
              <span class="label">Color:</span>
              <span class="value">{{ selectedVariant.attributes.color }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Stock:</span>
              <span class="value" :class="{ 'low-stock': selectedVariant?.stock < 5 }">
                {{ selectedVariant?.stock || product.stock }} available
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="peek-actions">
            <button class="btn-primary" @click="addToCart">
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
            <button class="btn-secondary" @click="viewProduct">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  product: Object,
  isVisible: Boolean,
  isMobile: Boolean
})

const emit = defineEmits(['close', 'addToCart', 'viewProduct'])

const selectedVariant = ref(props.product?.variants?.[0] || null)

const selectVariant = (variant) => {
  selectedVariant.value = variant
}

const closePeek = () => {
  emit('close')
}

const addToCart = () => {
  emit('addToCart', selectedVariant.value || props.product)
  closePeek()
}

const viewProduct = () => {
  emit('viewProduct', props.product)
  closePeek()
}

// Reset selected variant when product changes
watch(() => props.product, (newProduct) => {
  if (newProduct?.variants?.length) {
    selectedVariant.value = newProduct.variants[0]
  }
})
</script>

<style scoped>
.peek-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.peek-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.peek-modal.mobile {
  grid-template-columns: 1fr;
  max-width: 95vw;
  padding: 1.5rem;
}

.peek-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}

.peek-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.peek-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}

.variant-option {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.variant-option:hover,
.variant-option.active {
  border-color: #1a1a1a;
  transform: scale(1.05);
}

.variant-option img {
  flex: 1;
  width: 100%;
  object-fit: cover;
}

.variant-label {
  padding: 0.25rem;
  font-size: 0.75rem;
  text-align: center;
  background: white;
  font-weight: 500;
}

.peek-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e74c3c;
  margin: 0;
}

.quick-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item .label {
  font-weight: 600;
  color: #64748b;
}

.detail-item .value {
  font-weight: 500;
  color: #1a1a1a;
}

.detail-item .value.low-stock {
  color: #e74c3c;
}

.peek-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-primary,
.btn-secondary {
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #1a1a1a;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #1a1a1a;
}

/* Animations */
.peek-fade-enter-active,
.peek-fade-leave-active {
  transition: all 0.3s ease;
}

.peek-fade-enter-from,
.peek-fade-leave-to {
  opacity: 0;
}

.peek-fade-enter-from .peek-modal,
.peek-fade-leave-to .peek-modal {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 767px) {
  .peek-modal {
    margin: 1rem;
    padding: 1rem;
    gap: 1rem;
  }
  
  .variants-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
