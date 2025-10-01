<template>
  <div id="app">
    <Header />
    <main>
      <!-- 
        In a real Vue app, you would use Vue Router here 
        to render the different pages. For this conversion,
        we are showing the Home page by default.
      -->
      <Home />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Home from './pages/Home.vue';
// To display other pages, you would import them like this:
// import About from './views/About.vue';
</script>

<style>
/* Global styles from the original HTML files */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
    --c1: #FFB2E6;
    --c2: #F7AEF8;
    --c3: #E382F9;
    --c4: #B388EB;
    --c5: #9A52FF;
    --c6: #8447FF;
    --c7: #72DDF7;
    --bg-color: #FDFBFF;
    --text-color: #333333;
    --light-gray: #f4f4f4;
}

body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    width: 90%;
    max-width: 1400px;
    margin: 0 auto;
}

.section {
    padding: 6rem 0;
}

.section-title {
    font-size: 2.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 4rem;
    color: var(--text-color);
}

.cta-button {
    background-color: var(--c5);
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.3s;
    display: inline-block;
}

.cta-button:hover {
    background-color: var(--c6);
    transform: translateY(-3px);
}

.page-header {
    padding: 6rem 0;
    background-color: var(--light-gray);
    text-align: center;
}

.page-header h1 {
    font-size: 3.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

@media (max-width: 992px) {
    .section {
        padding: 4rem 0;
    }
}

@media (max-width: 768px) {
    .section-title {
        font-size: 2.2rem;
    }
     .page-header h1 {
        font-size: 2.5rem;
    }
}
</style>
