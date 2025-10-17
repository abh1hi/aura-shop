<template>
  <div class="vendor-landing">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column - Content -->
          <div class="text-content">
            <div class="badge mb-6">
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                🚀 Join 10,000+ Successful Vendors
              </span>
            </div>
            
            <h1 class="hero-title">
              Grow Your Business with
              <span class="gradient-text">Aura Shop</span>
            </h1>
            
            <p class="hero-description">
              Transform your products into profit with our powerful vendor platform.
              Reach millions of customers, manage inventory seamlessly, and scale your business effortlessly.
            </p>
            
            <div class="cta-buttons">
              <button 
                @click="startSelling" 
                class="btn-primary"
              >
                Start Selling Today
                <ArrowRightIcon class="ml-2 h-5 w-5" />
              </button>
              
              <button 
                @click="watchDemo" 
                class="btn-secondary ml-4"
              >
                <PlayIcon class="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            
            <div class="trust-indicators">
              <p class="text-sm text-gray-600 mb-3">Trusted by leading brands:</p>
              <div class="brand-logos">
                <img src="/images/brand-1.png" alt="Brand 1" class="brand-logo" />
                <img src="/images/brand-2.png" alt="Brand 2" class="brand-logo" />
                <img src="/images/brand-3.png" alt="Brand 3" class="brand-logo" />
                <img src="/images/brand-4.png" alt="Brand 4" class="brand-logo" />
              </div>
            </div>
          </div>
          
          <!-- Right Column - Hero Image/Video -->
          <div class="hero-media">
            <div class="media-container">
              <img 
                src="/images/vendor-dashboard-preview.png" 
                alt="Vendor Dashboard Preview"
                class="dashboard-preview"
              />
              <div class="floating-cards">
                <div class="stats-card card-1">
                  <div class="stat-item">
                    <span class="stat-number">₹2.5L</span>
                    <span class="stat-label">Monthly Revenue</span>
                  </div>
                </div>
                <div class="stats-card card-2">
                  <div class="stat-item">
                    <span class="stat-number">1,247</span>
                    <span class="stat-label">Orders This Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h2 class="section-title">Everything You Need to Succeed</h2>
          <p class="section-description">
            Powerful tools and insights to help you grow your business faster
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.id" class="feature-card">
            <div class="feature-icon">
              <component :is="feature.icon" class="h-8 w-8" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.id" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h2 class="section-title">Start Selling in 3 Simple Steps</h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="step.id" class="step-card">
            <div class="step-number">{{ index + 1 }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h2 class="section-title">What Our Vendors Say</h2>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
            <div class="testimonial-content">
              <p class="testimonial-text">"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-business">{{ testimonial.business }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container mx-auto px-4 py-16">
        <div class="cta-card">
          <div class="text-center">
            <h2 class="cta-title">Ready to Start Your Journey?</h2>
            <p class="cta-description">
              Join thousands of successful vendors already growing their business with Aura Shop
            </p>
            <div class="cta-buttons">
              <button @click="startSelling" class="btn-primary-large">
                Get Started Now
              </button>
              <p class="cta-note">Free to join • No setup fees • 24/7 support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRightIcon,
  PlayIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'VendorLanding',
  components: {
    ArrowRightIcon,
    PlayIcon,
    ShoppingBagIcon,
    ChartBarIcon,
    CurrencyRupeeIcon,
    TruckIcon,
    ChatBubbleLeftRightIcon,
    ShieldCheckIcon
  },
  setup() {
    const router = useRouter();
    
    const features = ref([
      {
        id: 1,
        icon: 'ShoppingBagIcon',
        title: 'Easy Product Management',
        description: 'Upload products, manage inventory, and track performance with our intuitive dashboard.'
      },
      {
        id: 2,
        icon: 'ChartBarIcon',
        title: 'Advanced Analytics',
        description: 'Get detailed insights on sales, customer behavior, and market trends to optimize your business.'
      },
      {
        id: 3,
        icon: 'CurrencyRupeeIcon',
        title: 'Fast Payments',
        description: 'Receive payments quickly with our secure payment system and transparent fee structure.'
      },
      {
        id: 4,
        icon: 'TruckIcon',
        title: 'Logistics Support',
        description: 'Seamless shipping integration with multiple courier partners for nationwide delivery.'
      },
      {
        id: 5,
        icon: 'ChatBubbleLeftRightIcon',
        title: '24/7 Support',
        description: 'Get help whenever you need it with our dedicated vendor support team.'
      },
      {
        id: 6,
        icon: 'ShieldCheckIcon',
        title: 'Secure Platform',
        description: 'Your data and transactions are protected with enterprise-grade security.'
      }
    ]);
    
    const stats = ref([
      { id: 1, number: '10,000+', label: 'Active Vendors' },
      { id: 2, number: '₹50Cr+', label: 'Revenue Generated' },
      { id: 3, number: '5M+', label: 'Products Sold' },
      { id: 4, number: '99.9%', label: 'Uptime' }
    ]);
    
    const steps = ref([
      {
        id: 1,
        title: 'Create Your Account',
        description: 'Sign up in minutes with basic business information and verification documents.'
      },
      {
        id: 2,
        title: 'List Your Products',
        description: 'Upload product catalogs, set prices, and configure shipping options.'
      },
      {
        id: 3,
        title: 'Start Selling',
        description: 'Go live and start receiving orders from customers across the country.'
      }
    ]);
    
    const testimonials = ref([
      {
        id: 1,
        name: 'Priya Sharma',
        business: 'Fashion Boutique',
        avatar: '/images/vendor-1.jpg',
        content: 'Increased my sales by 300% within 6 months. The platform is incredibly user-friendly and the support team is amazing.'
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        business: 'Electronics Store',
        avatar: '/images/vendor-2.jpg',
        content: 'The analytics dashboard helps me understand my customers better. I can now make data-driven decisions for my business.'
      },
      {
        id: 3,
        name: 'Anita Patel',
        business: 'Home Decor',
        avatar: '/images/vendor-3.jpg',
        content: 'Fast payments and excellent logistics support. I can focus on my products while Aura Shop handles the rest.'
      }
    ]);
    
    const startSelling = () => {
      router.push({ name: 'VendorRegister' });
    };
    
    const watchDemo = () => {
      // Open demo video modal or navigate to demo page
      window.open('https://www.youtube.com/watch?v=demo-video', '_blank');
    };
    
    return {
      features,
      stats,
      steps,
      testimonials,
      startSelling,
      watchDemo
    };
  }
};
</script>

<style scoped>
.vendor-landing {
  @apply min-h-screen bg-white;
}

/* Hero Section */
.hero-section {
  @apply bg-gradient-to-br from-blue-50 to-indigo-100;
}

.hero-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6;
}

.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.hero-description {
  @apply text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl;
}

.cta-buttons {
  @apply flex flex-col sm:flex-row items-start sm:items-center mb-12;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-200 flex items-center;
}

.btn-secondary {
  @apply bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 transition-all duration-200 flex items-center mt-4 sm:mt-0;
}

.trust-indicators {
  @apply mt-12;
}

.brand-logos {
  @apply flex items-center space-x-8 opacity-60;
}

.brand-logo {
  @apply h-8 w-auto filter grayscale;
}

/* Hero Media */
.hero-media {
  @apply relative;
}

.media-container {
  @apply relative;
}

.dashboard-preview {
  @apply w-full h-auto rounded-2xl shadow-2xl;
}

.floating-cards {
  @apply absolute top-4 -left-4;
}

.stats-card {
  @apply bg-white rounded-lg shadow-lg p-4 mb-4 transform;
}

.card-1 {
  @apply -rotate-6;
}

.card-2 {
  @apply rotate-3 ml-8;
}

.stat-number {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

/* Features Section */
.features-section {
  @apply bg-white py-16;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-gray-900 mb-4;
}

.section-description {
  @apply text-xl text-gray-600 max-w-3xl mx-auto;
}

.feature-card {
  @apply bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg;
}

.feature-icon {
  @apply w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6;
}

.feature-title {
  @apply text-xl font-semibold text-gray-900 mb-3;
}

.feature-description {
  @apply text-gray-600 leading-relaxed;
}

/* Stats Section */
.stats-section {
  @apply bg-blue-600 text-white;
}

.stats-section .stat-number {
  @apply text-4xl font-bold mb-2;
}

.stats-section .stat-label {
  @apply text-blue-100;
}

/* How It Works */
.how-it-works {
  @apply bg-gray-50;
}

.step-card {
  @apply text-center;
}

.step-number {
  @apply w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6;
}

.step-title {
  @apply text-xl font-semibold text-gray-900 mb-3;
}

.step-description {
  @apply text-gray-600 leading-relaxed;
}

/* Testimonials */
.testimonials-section {
  @apply bg-white;
}

.testimonial-card {
  @apply bg-gray-50 p-8 rounded-xl;
}

.testimonial-text {
  @apply text-gray-700 leading-relaxed mb-6 italic;
}

.testimonial-author {
  @apply flex items-center;
}

.author-avatar {
  @apply w-12 h-12 rounded-full mr-4;
}

.author-name {
  @apply font-semibold text-gray-900;
}

.author-business {
  @apply text-gray-600 text-sm;
}

/* CTA Section */
.cta-section {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
}

.cta-card {
  @apply bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-12;
}

.cta-title {
  @apply text-3xl md:text-4xl font-bold text-white mb-4;
}

.cta-description {
  @apply text-xl text-blue-100 mb-8 max-w-2xl mx-auto;
}

.btn-primary-large {
  @apply bg-white hover:bg-gray-100 text-blue-600 px-12 py-4 rounded-lg font-semibold text-xl transition-all duration-200 transform hover:scale-105;
}

.cta-note {
  @apply text-blue-200 mt-4;
}

/* Responsive Design */
@media (max-width: 640px) {
  .hero-title {
    @apply text-3xl;
  }
  
  .cta-buttons {
    @apply space-y-4;
  }
  
  .btn-secondary {
    @apply w-full justify-center;
  }
}
</style>