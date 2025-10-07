<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-main">
        <div class="footer-logo">AURA</div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Shop</h4>
            <router-link to="/shop">All Products</router-link>
            <router-link to="/shop?category=tops">Tops</router-link>
            <router-link to="/shop?category=bottoms">Bottoms</router-link>
            <router-link to="/shop?category=outerwear">Outerwear</router-link>
          </div>
          <div class="footer-column">
            <h4>About</h4>
            <router-link to="/about">Our Story</router-link>
            <router-link to="/sustainability">Sustainability</router-link>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <router-link to="/contact">Contact Us</router-link>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/shipping">Shipping & Returns</router-link>
          </div>
        </div>
        <div class="footer-subscribe">
          <h4>Stay in the Loop</h4>
          <p>Get updates on new arrivals and special offers.</p>
          <div class="subscribe-form">
            <input type="email" placeholder="Your email">
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} AURA. All Rights Reserved.</p>
        <div class="social-links">
          <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
          <a href="#" aria-label="Pinterest"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.28 4.52a9.4 9.4 0 0 0-13.28 0L4 8.52s-1.5 4.5 3 8.5c4.5 4 8.5 3 8.5 3l4-4.02a9.4 9.4 0 0 0 0-13.28z"></path><path d="M12 12a3 3 0 1 0 0-4.24 3 3 0 0 0 0 4.24z"></path><path d="M16 8a4 4 0 0 0-5.66 0"></path><path d="M12 16a4 4 0 0 0 0-5.66"></path></svg></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 4rem 0 2rem 0;
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-direction: column;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 700;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-column a {
  display: block;
  text-decoration: none;
  color: #555;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #000;
}

.footer-subscribe h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-subscribe p {
  color: #555;
  margin-bottom: 1rem;
}

.subscribe-form {
  display: flex;
}

.subscribe-form input {
  flex-grow: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px 0 0 8px;
  outline: none;
  -webkit-appearance: none;
}

.subscribe-form button {
  padding: 1rem 1.5rem;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  -webkit-appearance: none;
}

.footer-bottom {
  border-top: 1px solid #eee;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #777;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #777;
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-links a:hover {
  color: #000;
}

@media (max-width: 992px) {
  .footer-main {
    grid-template-columns: 1fr 1.5fr;
  }
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .subscribe-form {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
