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
  </div>
</template>

<script setup>
// No script needed for this simplified home page
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

/* Animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>