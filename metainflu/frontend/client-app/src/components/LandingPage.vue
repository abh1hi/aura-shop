<template>
  <div class="relative min-h-screen text-white overflow-hidden">
    <!-- Video Background -->
    <video autoplay loop muted class="absolute z-0 w-auto min-w-full min-h-full max-w-none">
      <source src="/videos/hero-fashion.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Overlay -->
    <div class="absolute z-10 inset-0 bg-black opacity-50"></div>

    <!-- Hero Section -->
    <section class="relative z-20 flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 class="text-6xl font-extrabold mb-4 tracking-wider uppercase">Define Your Style</h1>
      <p class="text-lg mb-8">Discover curated collections from the world's top designers.</p>
      <router-link to="/shop" class="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gold-500 hover:text-white transition-colors duration-300">
        Shop Now
      </router-link>
    </section>

    <!-- Services Section -->
    <section class="relative z-20 bg-black bg-opacity-50 py-20 px-6">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-12 text-white">Why Choose Aura?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div class="p-8 bg-gray-800 bg-opacity-50 rounded-xl transform hover:scale-105 transition-transform duration-300">
                    <div class="text-gold-500 mb-4">
                        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M16 5h4M18 17v4M17 19h4M12 9a3 3 0 100-6 3 3 0 000 6zm-7 11a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-semibold mb-3 text-white">Exclusive Collections</h3>
                    <p class="text-gray-300">Handpicked items from emerging and established designers.</p>
                </div>
                <div class="p-8 bg-gray-800 bg-opacity-50 rounded-xl transform hover:scale-105 transition-transform duration-300">
                    <div class="text-gold-500 mb-4">
                        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-semibold mb-3 text-white">Personal Styling</h3>
                    <p class="text-gray-300">Our expert stylists are here to help you create the perfect look.</p>
                </div>
                <div class="p-8 bg-gray-800 bg-opacity-50 rounded-xl transform hover:scale-105 transition-transform duration-300">
                    <div class="text-gold-500 mb-4">
                        <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-semibold mb-3 text-white">Seamless Experience</h3>
                    <p class="text-gray-300">Enjoy a smooth and luxurious shopping journey from start to finish.</p>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script setup>
// No script needed for this pure presentation component
</script>

<style scoped>
/* Scoped styles if needed */
</style>
