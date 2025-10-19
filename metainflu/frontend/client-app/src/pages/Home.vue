<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero">
      <video autoplay muted loop playsinline class="hero-bg">
       <source src="/videos/hero-fashion.mp4" type="video/mp4" />
      </video>
      <div class="overlay"></div>
      <div class="hero-content">
        <h1>Effortless. Elevated. <span class="brand-gradient">AURA.</span></h1>
        <p>Luxury minimalism for the new generation — consciously crafted, timelessly styled.</p>
        <router-link to="/shop" class="cta-button">Explore Collection</router-link>
      </div>
      <div class="scroll-indicator">Scroll ↓</div>
    </section>

    <!-- TRENDING COLLECTION -->
    <section class="section trending">
      <div class="container">
        <div class="section-header">
          <h2>New Drop: FW 2025</h2>
          <a href="#" class="view-all">View All</a>
        </div>
        <div class="scroll-grid">
          <ProductCard
            v-for="product in trendingProducts"
            :key="product.id"
            :product="product"
            class="scroll-item"
          />
        </div>
      </div>
    </section>

    <!-- SIGNATURE COLLECTION -->
    <section class="signature-section">
      <div class="signature-item left">
        <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200" alt="">
        <div class="signature-text">
          <h3>The Modern Classic</h3>
          <p>Structured silhouettes. Neutral palette. Subtle rebellion.</p>
          <a href="#">Shop The Edit</a>
        </div>
      </div>
      <div class="signature-item right">
        <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200" alt="">
        <div class="signature-text">
          <h3>Street Luxury</h3>
          <p>Urban aesthetic meets artisanal detail.</p>
          <a href="#">Discover More</a>
        </div>
      </div>
    </section>

    <!-- ETHICAL STATEMENT -->
    <section class="ethos">
      <div class="container">
        <h2>Responsibly Designed. Consciously Worn.</h2>
        <p>
          MetaBerry stands for design integrity and ethical creation.
          Every fabric, every thread, every silhouette — curated for the planet and you.
        </p>
      </div>
    </section>

    <!-- MOODBOARD / COMMUNITY -->
    <section class="moodboard">
      <h2>#MetaMood</h2>
      <div class="mood-grid">
        <img v-for="n in 6" :key="n" :src="`https://source.unsplash.com/random/800x800?fashion,${n}`" />
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter">
      <div class="container">
        <h2>Join the Collective</h2>
        <p>Be first to know about new drops, limited edits, and exclusive perks.</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Join Now</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/productService';

const products = ref([]);

onMounted(async () => {
  try {
    products.value = await productService.getProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
});

const trendingProducts = computed(() => {
  const allVariants = [];
  products.value.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        allVariants.push({
          _id: product._id,
          id: `${product._id}-${variant.sku}`,
          name: product.name,
          price: variant.price,
          images: variant.images.length > 0 ? [{ url: variant.images[0] }] : product.images,
        });
      });
    } else {
      allVariants.push({
        ...product,
        id: product._id,
      });
    }
  });
  return allVariants;
});
</script>

<style scoped>
:root {
  --primary: #111;
  --accent: #c19a6b;
  --bg: #fafafa;
}

/* HERO */
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}
.hero-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(55%);
}
.overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 2rem;
  animation: fadeInUp 1.2s ease;
}
.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1.2rem;
}
.brand-gradient {
  background: linear-gradient(90deg, #fff, #c19a6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-content p {
  font-size: 1.2rem;
  color: #ddd;
  margin-bottom: 2.2rem;
}
.cta-button {
  padding: 1rem 2.5rem;
  border-radius: 30px;
  background: #fff;
  color: #000;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;
}
.cta-button:hover {
  background: var(--accent);
  color: #fff;
  transform: scale(1.05);
}
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  font-size: 0.9rem;
  letter-spacing: 2px;
  opacity: 0.7;
}

/* TRENDING SECTION */
.section {
  padding: 5rem 1rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.scroll-grid {
  display: flex;
  overflow-x: auto;
  gap: 2rem;
  scroll-snap-type: x mandatory;
}
.scroll-item {
  min-width: 300px;
  scroll-snap-align: start;
}
.view-all {
  text-decoration: none;
  font-weight: 500;
  color: var(--accent);
}

/* SIGNATURE COLLECTION */
.signature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 600px;
}
.signature-item {
  position: relative;
  overflow: hidden;
}
.signature-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}
.signature-item:hover img {
  transform: scale(1.1);
}
.signature-text {
  position: absolute;
  bottom: 60px;
  left: 60px;
  color: #fff;
}
.signature-text h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.signature-text a {
  color: #fff;
  border-bottom: 1px solid #fff;
  text-decoration: none;
}

/* ETHOS */
.ethos {
  background: var(--bg);
  padding: 6rem 1rem;
  text-align: center;
}
.ethos h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.ethos p {
  max-width: 700px;
  margin: 0 auto;
  color: #555;
}

/* MOODBOARD / COMMUNITY */
.moodboard {
  padding: 5rem 1rem;
  text-align: center;
}
.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.mood-grid img {
  width: 100%;
  border-radius: 12px;
  transition: transform 0.4s ease;
}
.mood-grid img:hover {
  transform: scale(1.03);
}

/* NEWSLETTER */
.newsletter {
  background: #111;
  color: #fff;
  text-align: center;
  padding: 5rem 1rem;
}
.newsletter-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.newsletter-form input {
  padding: 0.8rem 1.2rem;
  border-radius: 30px;
  border: none;
  width: 280px;
  outline: none;
}
.newsletter-form button {
  background: var(--accent);
  border: none;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.newsletter-form button:hover {
  background: #b78859;
}

/* Animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 992px) {
  .signature-section {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>