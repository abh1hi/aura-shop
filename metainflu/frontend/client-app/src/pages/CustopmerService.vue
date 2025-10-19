<!-- File: src/views/CustomerService.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Customer Service</h1>
            </div>
        </section>

        <section class="section container faq-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-item" v-for="(item, index) in faqItems" :key="index">
                <div class="faq-question" @click="toggleFaq(index)">
                    <h3>{{ item.question }}</h3>
                    <span>{{ activeFaq === index ? '-' : '+' }}</span>
                </div>
                <div class="faq-answer" :style="{ maxHeight: activeFaq === index ? '200px' : '0' }">
                    <p>{{ item.answer }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeFaq = ref(null);

const faqItems = ref([
    {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of purchase. Items must be in their original condition with tags attached. Please visit our returns page for more details."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order has shipped, you will receive an email with a tracking number. You can use this number to track your order on the carrier's website."
    }
]);

const toggleFaq = (index) => {
    if (activeFaq.value === index) {
        activeFaq.value = null;
    } else {
        activeFaq.value = index;
    }
};
</script>

<style scoped>
.container {
    max-width: 1000px;
}
.faq-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
}

.faq-item {
    border-bottom: 1px solid var(--light-gray);
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    cursor: pointer;
}

.faq-question h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
}
.faq-question span {
    font-size: 1.5rem;
    color: var(--c5);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out;
}

.faq-answer p {
    padding: 0 0 1.5rem 0;
    margin: 0;
    line-height: 1.8;
}
</style>

