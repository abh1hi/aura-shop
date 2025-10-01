<!-- File: src/views/Home.vue -->
<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1>Discover Your Signature Style</h1>
        <p>Minimalist designs, ethically crafted for the modern individual. Explore our new collection.</p>
        <a href="#" class="cta-button">Shop Now</a>
      </div>
    </section>

    <section class="section container">
      <h2 class="section-title">Featured Products</h2>
      <div class="product-grid">
        <div class="product-card">
          <div class="product-image-container">
            <img src="https://images.unsplash.com/photo-1584273142342-294256955942?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product 1">
          </div>
          <div class="product-info">
            <h3 class="product-name">Classic Linen Shirt</h3>
            <p class="product-price">$85.00</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image-container">
            <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product 2">
          </div>
          <div class="product-info">
            <h3 class="product-name">Slim-Fit Denim</h3>
            <p class="product-price">$120.00</p>
          </div>
        </div>
        <div class="product-card">
            <div class="product-image-container">
                <img src="https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product 3">
            </div>
            <div class="product-info">
                <h3 class="product-name">Merino Wool Sweater</h3>
                <p class="product-price">$150.00</p>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image-container">
                <img src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product 4">
            </div>
            <div class="product-info">
                <h3 class="product-name">Graphic Tee</h3>
                <p class="product-price">$39.99</p>
            </div>
        </div>
      </div>
    </section>

    <section class="section container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="category-grid">
            <a href="#" class="category-card">
                <img src="https://images.unsplash.com/photo-1521577352947-3c47e345e909?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tops">
                <div class="category-overlay">
                    <h3 class="category-title">Tops</h3>
                </div>
            </a>
            <a href="#" class="category-card">
                <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Bottoms">
                <div class="category-overlay">
                    <h3 class="category-title">Bottoms</h3>
                </div>
            </a>
            <a href="#" class="category-card">
                <img src="https://images.unsplash.com/photo-1551028719-00167b16e2a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Outerwear">
                <div class="category-overlay">
                    <h3 class="category-title">Outerwear</h3>
                </div>
            </a>
        </div>
    </section>

    <section class="section about-section">
        <div class="container">
            <h2 class="section-title">Ethical. Timeless. Yours.</h2>
            <p>We believe in fashion that lasts. Our pieces are designed with intention, crafted from high-quality, sustainable materials, and made to be cherished for years to come. Join us in building a more mindful wardrobe.</p>
            <a href="#" class="cta-button">Learn More About Us</a>
        </div>
    </section>

  </div>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.hero {
  height: 85vh;
  background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content h1 {
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 15px rgba(0,0,0,0.3);
}

.hero-content p {
  font-size: 1.3rem;
  font-weight: 300;
  margin-bottom: 2.5rem;
  max-width: 600px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.product-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 1px solid var(--light-gray);
}

.product-card:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.08);
  transform: translateY(-8px);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-card:hover img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
  text-align: center;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.product-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--c5);
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.category-card {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    height: 400px;
    text-decoration: none;
}

.category-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
}

.category-card:hover img {
    transform: scale(1.1);
}

.category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
    display: flex;
    align-items: flex-end;
    padding: 2rem;
    box-sizing: border-box;
}

.category-title {
    color: white;
    font-size: 2rem;
    font-weight: 600;
}

.about-section {
    background-color: var(--light-gray);
    text-align: center;
}

.about-section h2 {
    color: var(--text-color);
}

.about-section p {
    max-width: 700px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
    line-height: 1.8;
}


@media (max-width: 992px) {
    .hero-content h1 {
        font-size: 3.5rem;
    }
}

@media (max-width: 768px) {
    .product-grid,
    .category-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .hero-content h1 {
        font-size: 3rem;
    }

    .hero-content p {
        font-size: 1.1rem;
    }
}

@media (max-width: 576px) {
    .product-grid,
    .category-grid {
        grid-template-columns: 1fr;
    }
}
</style>

