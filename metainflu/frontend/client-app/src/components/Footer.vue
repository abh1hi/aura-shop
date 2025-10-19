<template>
  <footer class="bg-black text-white py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo and Social -->
        <div class="flex flex-col items-center md:items-start">
          <router-link to="/" class="text-3xl font-bold text-white mb-4">AURA</router-link>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-gold-500 transition-colors"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.324a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg></a>
            <a href="#" class="text-gray-400 hover:text-gold-500 transition-colors"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.42.23-2.124.084.606 1.882 2.359 3.256 4.44 3.294-1.776 1.39-4.021 2.212-6.466 2.212-.42 0-.833-.024-1.239-.074 2.289 1.471 5.016 2.329 7.941 2.329 9.525 0 14.737-7.898 14.737-14.737 0-.225-.005-.448-.015-.67.998-.722 1.864-1.62 2.56-2.648z"/></svg></a>
            <a href="#" class="text-gray-400 hover:text-gold-500 transition-colors"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.18 19.17c-1.17.61-2.44.94-3.77.94-3.31 0-6-2.69-6-6s2.69-6 6-6c1.33 0 2.59.33 3.77.94l-1.18 1.18c-.81-.34-1.71-.52-2.59-.52-2.21 0-4 1.79-4 4s1.79 4 4 4c.88 0 1.78-.18 2.59-.52l1.18 1.18zM12 14a2 2 0 100-4 2 2 0 000 4zm6-2a6 6 0 10-12 0 6 6 0 0012 0z"/></svg></a>
          </div>
        </div>

        <!-- Links -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 col-span-2">
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
            <ul class="mt-4 space-y-4">
              <li><router-link to="/shop" class="text-base text-gray-300 hover:text-white">All Products</router-link></li>
              <li><router-link to="/shop?category=tops" class="text-base text-gray-300 hover:text-white">Tops</router-link></li>
              <li><router-link to="/shop?category=bottoms" class="text-base text-gray-300 hover:text-white">Bottoms</router-link></li>
              <li><router-link to="/shop?category=outerwear" class="text-base text-gray-300 hover:text-white">Outerwear</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul class="mt-4 space-y-4">
              <li><router-link to="/about" class="text-base text-gray-300 hover:text-white">Our Story</router-link></li>
              <li><router-link to="/sustainability" class="text-base text-gray-300 hover:text-white">Sustainability</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul class="mt-4 space-y-4">
              <li><router-link to="/contact" class="text-base text-gray-300 hover:text-white">Contact Us</router-link></li>
              <li><router-link to="/faq" class="text-base text-gray-300 hover:text-white">FAQ</router-link></li>
              <li><router-link to="/shipping" class="text-base text-gray-300 hover:text-white">Shipping & Returns</router-link></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} AURA. All Rights Reserved.</p>
        <div class="flex items-center mt-4 md:mt-0">
          <p class="text-sm text-gray-400">Made with ❤️ in NYC</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed for this pure presentation component
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>
