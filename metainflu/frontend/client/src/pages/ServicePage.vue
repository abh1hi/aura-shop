<template>
  <div id="services-page" :style="cssVars" class="leading-relaxed">
    <!-- Custom Cursor -->
    <div id="custom-cursor" :class="{ 'expanded': cursorExpanded }" :style="{ left: cursor.x + 'px', top: cursor.y + 'px' }"></div>

    <!-- Navigation Bar -->
    <nav class="container mx-auto px-4 py-6 flex justify-between items-center z-10 relative">
      <a id="logo" href="index.html" class="text-2xl font-bold playfair" @mouseenter="expandCursor" @mouseleave="contractCursor">MetaBerry</a>
      <ul class="flex space-x-8 text-sm uppercase tracking-wide">
        <li><a href="about.html" class="hover:text-[var(--hover-color)] transition-colors" @mouseenter="expandCursor" @mouseleave="contractCursor">About</a></li>
        <li><a href="#services-list" class="hover:text-[var(--hover-color)] transition-colors" @mouseenter="expandCursor" @mouseleave="contractCursor">Solutions</a></li>
        <li><a href="index.html#contact" class="hover:text-[var(--hover-color)] transition-colors" @mouseenter="expandCursor" @mouseleave="contractCursor">Contact</a></li>
      </ul>
    </nav>

    <!-- Hero Section -->
    <section id="services-hero" class="relative overflow-hidden min-h-[50vh] flex flex-col justify-center items-center text-center p-8">
      <div class="grainy-background"></div>
      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="playfair text-6xl md:text-8xl font-black mb-6 leading-tight scramble-text">
          Our Solutions.
        </h1>
        <p class="text-xl md:text-2xl tracking-wide font-light animate-on-scroll">
          We bring your vision to life with timeless solutions for a future with history.
        </p>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services-list" class="container mx-auto px-4 py-20 relative">
      <div class="grainy-background"></div>
      <div class="relative z-10 text-center">
        <h2 class="playfair text-4xl md:text-5xl font-bold mb-16 animate-on-scroll" data-delay="0">Services</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div v-for="(service, index) in services" :key="index" class="bg-[var(--card-bg-color)] p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-on-scroll" :data-delay="index * 100" @mouseenter="expandCursor" @mouseleave="contractCursor">
            <h3 class="playfair text-3xl font-bold mb-4 scramble-text">{{ service.title }}</h3>
            <p class="text-md">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[var(--footer-bg-color)] text-[var(--footer-text-color)] py-12">
      <div class="container mx-auto px-4 flex flex-col items-center text-center">
        <div class="flex space-x-6 mb-6">
          <a href="#" class="hover:text-[var(--hover-color)] transition-colors text-sm" @mouseenter="expandCursor" @mouseleave="contractCursor">Privacy Policy</a>
          <a href="#" class="hover:text-[var(--hover-color)] transition-colors text-sm" @mouseenter="expandCursor" @mouseleave="contractCursor">Terms of Service</a>
          <a href="#" class="hover:text-[var(--hover-color)] transition-colors text-sm" @mouseenter="expandCursor" @mouseleave="contractCursor">Careers</a>
        </div>
        <p class="text-xs tracking-wide">&copy; 2024 MetaBerry. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';

const cursor = reactive({ x: 0, y: 0 });
const cursorExpanded = ref(false);

const services = ref([
  { title: 'Strategic Consulting', description: 'Transforming ideas into actionable plans with a focus on sustainable growth and future-proof strategy.' },
  { title: 'Digital Transformation', description: 'Integrating cutting-edge technology to streamline operations and enhance your digital presence.' },
  { title: 'Creative Direction', description: 'Crafting unique brand narratives and visual identities that resonate deeply with your audience.' },
  { title: 'Data Analytics', description: 'Unlocking insights from complex data to inform smarter decisions and drive business forward.' },
  { title: 'Emerging Tech', description: 'Staying ahead of the curve with solutions in AI, IoT, and blockchain for a truly innovative future.' },
  { title: 'Product Development', description: 'From concept to launch, we build products that are beautiful, functional, and user-centric.' },
]);

const palette = {
    bg: '#1a202c',
    text: '#e2e8f0',
    buttonBg: '#48bb78',
    buttonText: '#1a202c',
    hover: '#68d391',
    cardBg: '#2d3748',
    footerBg: '#121a24',
    footerText: '#cbd5e0',
    glow: '#48bb78',
};

const cssVars = computed(() => {
    return {
        '--bg-color': palette.bg,
        '--text-color': palette.text,
        '--button-bg-color': palette.buttonBg,
        '--button-text-color': palette.buttonText,
        '--hover-color': palette.hover,
        '--card-bg-color': palette.cardBg,
        '--footer-bg-color': palette.footerBg,
        '--footer-text-color': palette.footerText,
        '--glow-color': palette.glow,
    };
});

// Custom Cursor
const expandCursor = () => {
  cursorExpanded.value = true;
};
const contractCursor = () => {
  cursorExpanded.value = false;
};

// Text Scramble Effect
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:"<>?';
const applyScramble = (element) => {
    let originalText = element.textContent;
    let interval;
    
    const handleMouseEnter = () => {
        let count = 0;
        interval = setInterval(() => {
            element.textContent = originalText.split('').map((char, index) => {
                if (index < count) {
                    return originalText[index];
                }
                return characters[Math.floor(Math.random() * characters.length)];
            }).join('');
            count += 1;
            if (count > originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 50);
    };

    const handleMouseLeave = () => {
        clearInterval(interval);
        element.textContent = originalText;
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
};

// Intersection Observer for scroll animations with stagger
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
            } else {
                entry.target.classList.add('is-visible');
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

onMounted(() => {
    // Custom Cursor
    document.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    });

    // Apply scramble effect to specific elements
    document.querySelectorAll('.scramble-text').forEach(applyScramble);

    // Intersection Observer
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
});
</script>

<style scoped>
:root {
  --bg-color: #1a202c;
  --text-color: #e2e8f0;
  --button-bg-color: #48bb78;
  --button-text-color: #1a202c;
  --hover-color: #68d391;
  --card-bg-color: #2d3748;
  --footer-bg-color: #121a24;
  --footer-text-color: #cbd5e0;
  --glow-color: #48bb78;
}

body {
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    overflow-x: hidden;
    cursor: none;
    background-color: var(--bg-color);
    transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
}
.playfair {
    font-family: 'Playfair Display', serif;
}
.grainy-background {
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-size: cover;
    opacity: 0.07;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Animation for scroll-triggered elements */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Custom Cursor */
#custom-cursor {
    position: fixed;
    z-index: 9999;
    width: 1rem;
    height: 1rem;
    background-color: var(--button-bg-color);
    border-radius: 50%;
    pointer-events: none;
    transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease, background-color 0.5s ease;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px var(--glow-color); /* Added glow effect */
}
#custom-cursor.expanded {
    width: 3rem;
    height: 3rem;
    opacity: 0.3;
}

/* Neon glow animation for buttons */
.retro-button.neon-glow {
    box-shadow: 0 0 15px var(--glow-color);
    transition: box-shadow 0.3s ease-in-out;
}

/* Polymorphic shape animation */
.polymorph-shape {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);
    animation: morph 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
    backdrop-filter: blur(10px);
}

@keyframes morph {
    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(-50%, -50%) rotate(0deg); opacity: 0.3; }
    25% { border-radius: 40% 60% 70% 30% / 50% 70% 30% 50%; transform: translate(-50%, -50%) rotate(45deg); opacity: 0.4; }
    50% { border-radius: 70% 30% 50% 50% / 30% 50% 50% 70%; transform: translate(-50%, -50%) rotate(90deg); opacity: 0.5; }
    75% { border-radius: 30% 70% 60% 40% / 70% 40% 60% 30%; transform: translate(-50%, -50%) rotate(135deg); opacity: 0.4; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(-50%, -50%) rotate(180deg); opacity: 0.3; }
}
</style>
