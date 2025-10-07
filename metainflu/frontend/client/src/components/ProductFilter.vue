<template>
    <!-- Filter Sidebar - The sidebar element itself -->
    <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
        <!-- Overlay is only active when the sidebar is open to block content -->
        <div v-if="isOpen" class="filter-overlay" @click="$emit('close')"></div>

        <div class="sidebar-content">
            <div class="sidebar-header">
                <h3>Filters</h3>
                <!-- Close button for mobile -->
                <button class="close-btn" @click="$emit('close')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            
            <div class="filter-group">
                <h4>Category</h4>
                <div class="options-grid">
                    <!-- Note: In a real app, these values would be bound to model/state -->
                    <label><input type="radio" name="category" checked> All</label>
                    <label><input type="radio" name="category"> Tops</label>
                    <label><input type="radio" name="category"> Bottoms</label>
                    <label><input type="radio" name="category"> Outerwear</label>
                    <label><input type="radio" name="category"> Accessories</label>
                </div>
            </div>
            
            <div class="filter-group">
                <h4>Price Range</h4>
                <div class="options-grid">
                    <label><input type="checkbox"> $0 - $50</label>
                    <label><input type="checkbox"> $50 - $100</label>
                    <label><input type="checkbox"> $100 - $200</label>
                    <label><input type="checkbox"> $200+</label>
                </div>
            </div>

            <!-- This button also closes the filter panel -->
            <button class="apply-filters-btn" @click="$emit('close')">Apply Filters</button>
        </div>
    </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    }
});

defineEmits(['close']);
</script>

<style scoped>
.filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
}

/* --- Filter Sidebar Styling (Native Look) --- */
.sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 350px;
    height: 100%;
    z-index: 100;
    transform: translateX(100%);
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2);
    padding: 0;
    background-color: var(--bg-color);
    transition: transform 0.3s ease;
}

.sidebar-open {
    transform: translateX(0);
}

.sidebar-content {
    height: 100%;
    overflow-y: auto;
    padding: 3rem 1.5rem;
    border: none;
    box-shadow: none;
    background-color: white;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.sidebar-header h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--c5);
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    padding: 0;
    /* FIX: Remove outline */
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.filter-group {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--light-gray);
}

.filter-group h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.options-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.options-grid label {
    flex: 1 1 45%; 
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
    background-color: #fcfcfc;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.2s, border-color 0.2s;
    /* FIX: Remove outline */
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.options-grid input[type="checkbox"],
.options-grid input[type="radio"] {
    display: none;
}

/* Also ensure input siblings do not show outlines */
.options-grid label:focus-within {
    outline: none;
}

.options-grid input:checked + label,
.options-grid label:hover {
    border-color: var(--c5);
    background-color: var(--c5);
    color: white;
}

.apply-filters-btn {
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 12px;
    background-color: var(--c5);
    color: white;
    border: none;
    cursor: pointer;
    /* FIX: Remove outline */
    outline: none;
    -webkit-tap-highlight-color: transparent;
}
.apply-filters-btn:focus {
    outline: none;
}


/* Media Query for accessibility/larger filter panels */
@media (max-width: 600px) {
    .sidebar {
        max-width: 100%;
    }
}
</style>
