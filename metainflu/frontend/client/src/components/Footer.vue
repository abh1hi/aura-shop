<!-- File: src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <h4>Shop</h4>
        <a href="#">New Arrivals</a>
        <a href="#">Clothing</a>
        <a href="#">Accessories</a>
      </div>
      <div class="footer-section">
        <h4>About</h4>
        <a href="#">Our Story</a>
        <a href="#">Sustainability</a>
      </div>
      <div class="footer-section">
        <h4>Support</h4>
        <a href="#">Contact Us</a>
        <a href="#">Shipping & Returns</a>
        <a href="#">FAQ</a>
      </div>
      <div class="footer-section">
        <h4>Connect</h4>
        <a href="#">Instagram</a>
        <a href="#">Twitter</a>
        <a href="#">Pinterest</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 5rem 0;
  background-color: #1a1a1a;
  color: #fdfbff;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
}

.footer-section h4 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: var(--c7);
  font-weight: 600;
}

.footer-section a {
  display: block;
  text-decoration: none;
  color: #e0e0e0;
  margin-bottom: 0.8rem;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--c5);
}

@media (max-width: 576px) {
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
}
</style>

