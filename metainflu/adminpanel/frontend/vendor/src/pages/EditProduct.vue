<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">Edit Product</h1>
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <router-link to="/products" class="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 active:bg-gray-400 cursor-pointer">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Products
        </router-link>
        <button @click="saveProduct" class="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 active:bg-opacity-80 cursor-pointer" :disabled="isSaving">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Search and Tabs -->
    <div class="relative mb-4">
      <input type="text" v-model="searchQuery" placeholder="Search for a field to edit..." @keydown.esc="searchQuery = ''" class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
      <svg class="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      <ul v-if="searchResults.length" class="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
        <li v-for="field in searchResults" :key="field.name" @click="jumpToField(field)" class="px-4 py-3 cursor-pointer hover:bg-blue-50">
          {{ field.name }} <span class="text-xs text-gray-500 ml-2">in {{ field.tab }}</span>
        </li>
      </ul>
    </div>

    <div v-if="loading" class="text-center text-text-secondary py-8">Loading product details...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-danger rounded-lg">Error: {{ error }}</div>
    
    <div v-else-if="product" class="bg-surface rounded-lg shadow-sm">
      <div class="border-b border-border">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button @click="activeTab = 'basic'" :class="[activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Basic Info
          </button>
          <button @click="activeTab = 'variants'" :class="[activeTab === 'variants' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Variants
          </button>
          <button @click="activeTab = 'images'" :class="[activeTab === 'images' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Images
          </button>
          <button @click="activeTab = 'details'" :class="[activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Details
          </button>
          <button @click="activeTab = 'attributes'" :class="[activeTab === 'attributes' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
            Attributes
          </button>
        </nav>
      </div>

      <form @submit.prevent="saveProduct" class="p-6 space-y-6">
        <!-- Basic Info Tab -->
        <div v-show="activeTab === 'basic'" id="basic-tab-content" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-text-primary">Product Name</label>
              <input type="text" id="name" required v-model="product.name" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div>
              <label for="brand" class="block text-sm font-medium text-text-primary">Brand</label>
              <input type="text" id="brand" v-model="product.brand" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
            </div>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-text-primary">Description</label>
            <textarea id="description" rows="4" v-model="product.description" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm"></textarea>
          </div>
          <div>
            <label for="categories" class="block text-sm font-medium text-text-primary">Categories</label>
            <select id="categories" multiple v-model="product.categories" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
            </select>
          </div>
          <div>
            <label for="tags" class="block text-sm font-medium text-text-primary">Tags (comma-separated)</label>
            <input type="text" id="tags" v-model="product.tags" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
          </div>
        </div>

        <!-- Variants Tab -->
        <div v-show="activeTab === 'variants'" id="variants-tab-content" class="space-y-6">
          <div v-for="(variant, index) in product.variants" :key="index" class="border-t border-border pt-4">
            <h3 class="text-lg font-medium text-text-primary mb-2">Variant {{ index + 1 }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label :for="`variant-sku-${index}`" class="block text-sm font-medium text-text-primary">SKU</label>
                <input type="text" :id="`variant-sku-${index}`" required v-model="variant.sku" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label :for="`variant-price-${index}`" class="block text-sm font-medium text-text-primary">Price ($)</label>
                <input type="number" :id="`variant-price-${index}`" required v-model.number="variant.price" min="0" step="0.01" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label :for="`variant-stock-${index}`" class="block text-sm font-medium text-text-primary">Stock</label>
                <input type="number" :id="`variant-stock-${index}`" required v-model.number="variant.stock" min="0" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
            </div>
            <button @click.prevent="removeVariant(index)" class="mt-2 text-danger hover:text-red-700 text-sm">Remove Variant</button>
          </div>
          <button @click.prevent="addVariant" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Variant</button>
        </div>

        <!-- Images Tab -->
        <div v-show="activeTab === 'images'" id="images-tab-content" class="space-y-6">
          <h3 class="text-lg font-medium text-text-primary mb-2">Product Images</h3>
          <div v-for="(image, index) in product.images" :key="index" class="border-t border-border pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label :for="`image-url-${index}`" class="block text-sm font-medium text-text-primary">URL</label>
                <input type="text" :id="`image-url-${index}`" v-model="image.url" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label :for="`image-alt-${index}`" class="block text-sm font-medium text-text-primary">Alt Text</label>
                <input type="text" :id="`image-alt-${index}`" v-model="image.altText" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label :for="`image-position-${index}`" class="block text-sm font-medium text-text-primary">Position</label>
                <input type="number" :id="`image-position-${index}`" v-model.number="image.position" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label :for="`image-variant-${index}`" class="block text-sm font-medium text-text-primary">Assign to Variant (optional)</label>
                <select :id="`image-variant-${index}`" v-model="image.variantSku" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  <option :value="null">General Product Image</option>
                  <option v-for="variant in product.variants" :key="variant.sku" :value="variant.sku">
                    Variant: {{ variant.sku || '(no SKU yet)' }}
                  </option>
                </select>
              </div>
            </div>
            <button @click.prevent="removeImage(index)" class="mt-2 text-danger hover:text-red-700 text-sm">Remove Image</button>
          </div>
          <button @click.prevent="addImage" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Image</button>
        </div>

        <!-- Details Tab -->
        <div v-show="activeTab === 'details'" id="details-tab-content" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="modelNumber" class="block text-sm font-medium text-text-primary">Model Number</label>
                <input type="text" id="modelNumber" v-model="product.modelNumber" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="gtin" class="block text-sm font-medium text-text-primary">GTIN</label>
                <input type="text" id="gtin" v-model="product.gtin" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="pattern" class="block text-sm font-medium text-text-primary">Pattern</label>
                <input type="text" id="pattern" v-model="product.pattern" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="style" class="block text-sm font-medium text-text-primary">Style</label>
                <input type="text" id="style" v-model="product.style" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="ageGroup" class="block text-sm font-medium text-text-primary">Age Group</label>
                <input type="text" id="ageGroup" v-model="product.ageGroup" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="gender" class="block text-sm font-medium text-text-primary">Gender</label>
                <input type="text" id="gender" v-model="product.gender" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="releaseYear" class="block text-sm font-medium text-text-primary">Release Year</label>
                <input type="text" id="releaseYear" v-model="product.releaseYear" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="season" class="block text-sm font-medium text-text-primary">Season</label>
                <input type="text" id="season" v-model="product.season" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="careInstructions" class="block text-sm font-medium text-text-primary">Care Instructions</label>
                <input type="text" id="careInstructions" v-model="product.careInstructions" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="warranty" class="block text-sm font-medium text-text-primary">Warranty</label>
                <input type="text" id="warranty" v-model="product.warranty" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="regionOfOrigin" class="block text-sm font-medium text-text-primary">Region of Origin</label>
                <input type="text" id="regionOfOrigin" v-model="product.regionOfOrigin" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="safetyWarnings" class="block text-sm font-medium text-text-primary">Safety Warnings</label>
                <input type="text" id="safetyWarnings" v-model="product.safetyWarnings" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="weight" class="block text-sm font-medium text-text-primary">Weight</label>
                <input type="number" id="weight" v-model.number="product.weight" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="expirationDate" class="block text-sm font-medium text-text-primary">Expiration Date</label>
                <input type="date" id="expirationDate" v-model="product.expirationDate" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>

              <!-- Dimensions -->
              <div class="sm:col-span-2" id="dimensions-section" v-if="product.dimensions">
                <h4 class="text-md font-medium text-text-primary">Dimensions</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  <div>
                    <label for="dim-length" class="block text-sm font-medium text-text-primary">Length</label>
                    <input type="number" id="dim-length" v-model.number="product.dimensions.length" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-width" class="block text-sm font-medium text-text-primary">Width</label>
                    <input type="number" id="dim-width" v-model.number="product.dimensions.width" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-height" class="block text-sm font-medium text-text-primary">Height</label>
                    <input type="number" id="dim-height" v-model.number="product.dimensions.height" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-unit" class="block text-sm font-medium text-text-primary">Unit</label>
                    <input type="text" id="dim-unit" v-model="product.dimensions.unit" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                </div>
              </div>

              <!-- Power -->
              <div class="sm:col-span-2" id="power-section" v-if="product.power">
                <h4 class="text-md font-medium text-text-primary">Power</h4>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label for="power-voltage" class="block text-sm font-medium text-text-primary">Voltage</label>
                    <input type="number" id="power-voltage" v-model.number="product.power.voltage" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                  <div>
                    <label for="power-unit" class="block text-sm font-medium text-text-primary">Unit</label>
                    <input type="text" id="power-unit" v-model="product.power.unit" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <label for="sustainability" class="block text-sm font-medium text-text-primary">Sustainability (comma-separated)</label>
                <input type="text" id="sustainability" :value="product.sustainability && product.sustainability.join(', ')" @input="product.sustainability = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="certifications" class="block text-sm font-medium text-text-primary">Certifications (comma-separated)</label>
                <input type="text" id="certifications" :value="product.certifications && product.certifications.join(', ')" @input="product.certifications = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="ingredients" class="block text-sm font-medium text-text-primary">Ingredients (comma-separated)</label>
                <input type="text" id="ingredients" :value="product.ingredients && product.ingredients.join(', ')" @input="product.ingredients = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="inTheBox" class="block text-sm font-medium text-text-primary">In The Box (comma-separated)</label>
                <input type="text" id="inTheBox" :value="product.inTheBox && product.inTheBox.join(', ')" @input="product.inTheBox = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
              <div>
                <label for="bundleContents" class="block text-sm font-medium text-text-primary">Bundle Contents (comma-separated)</label>
                <input type="text" id="bundleContents" :value="product.bundleContents && product.bundleContents.join(', ')" @input="product.bundleContents = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
              </div>
            </div>
        </div>

        <!-- Attributes Tab -->
        <div v-show="activeTab === 'attributes'" id="attributes-tab-content" class="space-y-6">
            <!-- Attributes -->
            <div id="attributes-section">
              <h3 class="text-lg font-medium text-text-primary mb-2">Attributes</h3>
              <div v-for="(attr, index) in product.attributes" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border pt-4">
                <div>
                  <label :for="`attr-name-${index}`" class="block text-sm font-medium text-text-primary">Name</label>
                  <input type="text" :id="`attr-name-${index}`" v-model="attr.name" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div>
                  <label :for="`attr-value-${index}`" class="block text-sm font-medium text-text-primary">Value</label>
                  <input type="text" :id="`attr-value-${index}`" v-model="attr.value" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <button @click.prevent="removeAttribute(index)" class="mt-2 text-danger hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addAttribute" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Attribute</button>
            </div>

            <!-- Array Attributes -->
            <div class="mt-6" id="array-attributes-section">
              <h3 class="text-lg font-medium text-text-primary mb-2">Array Attributes</h3>
              <div v-for="(attr, index) in product.arrayAttributes" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border pt-4">
                <div>
                  <label :for="`arr-attr-name-${index}`" class="block text-sm font-medium text-text-primary">Name</label>
                  <input type="text" :id="`arr-attr-name-${index}`" v-model="attr.name" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div>
                  <label :for="`arr-attr-values-${index}`" class="block text-sm font-medium text-text-primary">Values (comma-separated)</label>
                  <input type="text" :id="`arr-attr-values-${index}`" :value="attr.values.join(', ')" @input="attr.values = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <button @click.prevent="removeArrayAttribute(index)" class="mt-2 text-danger hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addArrayAttribute" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Array Attribute</button>
            </div>
            
            <!-- Technical Specs -->
            <div class="mt-6" id="technical-specs-section">
              <h3 class="text-lg font-medium text-text-primary mb-2">Technical Specs</h3>
              <div v-for="(spec, index) in product.technicalSpecs" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border pt-4">
                <div>
                  <label :for="`spec-key-${index}`" class="block text-sm font-medium text-text-primary">Key</label>
                  <input type="text" :id="`spec-key-${index}`" v-model="spec.key" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div>
                  <label :for="`spec-value-${index}`" class="block text-sm font-medium text-text-primary">Value</label>
                  <input type="text" :id="`spec-value-${index}`" v-model="spec.value" class="mt-1 block w-full px-3 py-2 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <button @click.prevent="removeTechnicalSpec(index)" class="mt-2 text-danger hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addTechnicalSpec" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Technical Spec</button>
            </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vendorService from '../services/vendorService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const isSaving = ref(false);
const activeTab = ref('basic');
const searchQuery = ref('');

const fieldRegistry = ref([
    { name: 'Product Name', tab: 'basic', selector: '#name' },
    { name: 'Brand', tab: 'basic', selector: '#brand' },
    { name: 'Description', tab: 'basic', selector: '#description' },
    { name: 'Categories', tab: 'basic', selector: '#categories' },
    { name: 'Tags', tab: 'basic', selector: '#tags' },
    { name: 'Variants', tab: 'variants', selector: '#variants-tab-content' },
    { name: 'SKU', tab: 'variants', selector: '[id^=variant-sku]' },
    { name: 'Price', tab: 'variants', selector: '[id^=variant-price]' },
    { name: 'Stock', tab: 'variants', selector: '[id^=variant-stock]' },
    { name: 'Images', tab: 'images', selector: '#images-tab-content' },
    { name: 'Model Number', tab: 'details', selector: '#modelNumber' },
    { name: 'GTIN', tab: 'details', selector: '#gtin' },
    { name: 'Pattern', tab: 'details', selector: '#pattern' },
    { name: 'Style', tab: 'details', selector: '#style' },
    { name: 'Age Group', tab: 'details', selector: '#ageGroup' },
    { name: 'Gender', tab: 'details', selector: '#gender' },
    { name: 'Release Year', tab: 'details', selector: '#releaseYear' },
    { name: 'Season', tab: 'details', selector: '#season' },
    { name: 'Care Instructions', tab: 'details', selector: '#careInstructions' },
    { name: 'Warranty', tab: 'details', selector: '#warranty' },
    { name: 'Region of Origin', tab: 'details', selector: '#regionOfOrigin' },
    { name: 'Safety Warnings', tab: 'details', selector: '#safetyWarnings' },
    { name: 'Weight', tab: 'details', selector: '#weight' },
    { name: 'Expiration Date', tab: 'details', selector: '#expirationDate' },
    { name: 'Dimensions', tab: 'details', selector: '#dimensions-section' },
    { name: 'Power', tab: 'details', selector: '#power-section' },
    { name: 'Sustainability', tab: 'details', selector: '#sustainability' },
    { name: 'Certifications', tab: 'details', selector: '#certifications' },
    { name: 'Ingredients', tab: 'details', selector: '#ingredients' },
    { name: 'In The Box', tab: 'details', selector: '#inTheBox' },
    { name: 'Bundle Contents', tab: 'details', selector: '#bundleContents' },
    { name: 'Attributes', tab: 'attributes', selector: '#attributes-section' },
    { name: 'Array Attributes', tab: 'attributes', selector: '#array-attributes-section' },
    { name: 'Technical Specs', tab: 'attributes', selector: '#technical-specs-section' },
]);

const searchResults = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return fieldRegistry.value.filter(field =>
    field.name.toLowerCase().includes(lowerCaseQuery)
  );
});

const jumpToField = (field) => {
  activeTab.value = field.tab;
  searchQuery.value = ''; // Clear search to hide dropdown

  nextTick(() => {
    const el = document.querySelector(field.selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      let focusableEl = el;
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
          focusableEl = el.querySelector('input, textarea, select');
      }
      if (focusableEl) {
          focusableEl.focus();
      }

      // Highlight effect
      el.style.transition = 'all 0.2s ease-in-out';
      el.style.outline = '2px solid #3b82f6'; // Tailwind's blue-500
      el.style.borderRadius = '4px';
      
      setTimeout(() => {
        el.style.outline = '';
      }, 2500);
    }
  });
};


const fetchProductDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [productData, categoriesData] = await Promise.all([
      productService.getProductById(route.params.id),
      categoryService.getCategories(),
    ]);

    // Initialize fields to avoid errors on v-model for nested or array properties
    productData.name = productData.name || '';
    productData.description = productData.description || '';
    productData.brand = productData.brand || '';
    productData.modelNumber = productData.modelNumber || '';
    productData.gtin = productData.gtin || '';
    productData.categories = productData.categories || [];
    productData.attributes = productData.attributes || [];
    productData.arrayAttributes = productData.arrayAttributes || [];
    productData.variants = productData.variants || [];
    productData.images = productData.images || [];
    productData.weight = productData.weight || null;
    productData.dimensions = productData.dimensions || { length: null, width: null, height: null, unit: '' };
    productData.pattern = productData.pattern || '';
    productData.style = productData.style || '';
    productData.ageGroup = productData.ageGroup || '';
    productData.gender = productData.gender || '';
    productData.releaseYear = productData.releaseYear || '';
    productData.season = productData.season || '';
    productData.careInstructions = productData.careInstructions || '';
    productData.warranty = productData.warranty || '';
    productData.sustainability = productData.sustainability || [];
    productData.certifications = productData.certifications || [];
    productData.power = productData.power || { voltage: null, unit: 'V' };
    productData.technicalSpecs = productData.technicalSpecs || [];
    productData.ingredients = productData.ingredients || [];
    productData.expirationDate = productData.expirationDate ? new Date(productData.expirationDate).toISOString().split('T')[0] : null;
    productData.safetyWarnings = productData.safetyWarnings || '';
    productData.inTheBox = productData.inTheBox || [];
    productData.bundleContents = productData.bundleContents || [];
    productData.regionOfOrigin = productData.regionOfOrigin || '';
    
    if (Array.isArray(productData.tags)) {
      productData.tags = productData.tags.join(', ');
    } else {
      productData.tags = productData.tags || '';
    }

    product.value = productData;
    categories.value = categoriesData;
  } catch (err) {
    console.error('Error fetching product details:', err);
    error.value = err.message || 'Could not load product details.';
  } finally {
    loading.value = false;
  }
};

const saveProduct = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    const productData = { ...product.value };

    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map(s => s.trim()).filter(s => s);
    }

    productData.variants = productData.variants.map(variant => ({
      ...variant,
      price: typeof variant.price === 'number' ? variant.price : 0,
      stock: typeof variant.stock === 'number' ? variant.stock : 0,
    }));
    
    await vendorService.updateProduct(product.value._id, productData);
    router.push('/products');
  } catch (err) {
    console.error('Error saving product:', err);
    error.value = err.message || 'Failed to save product.';
  } finally {
    isSaving.value = false;
  }
};

const addVariant = () => {
  if (!product.value.variants) {
    product.value.variants = [];
  }
  product.value.variants.push({ sku: '', price: 0, stock: 0, attributes: [], images: [], status: 'active', regionAvailability: [] });
};

const removeVariant = (index) => {
  product.value.variants.splice(index, 1);
};

const addImage = () => {
  if (!product.value.images) {
    product.value.images = [];
  }
  product.value.images.push({ url: '', altText: '', position: product.value.images.length + 1, variantSku: null });
};

const removeImage = (index) => {
  product.value.images.splice(index, 1);
};

const addAttribute = () => {
  if (!product.value.attributes) {
    product.value.attributes = [];
  }
  product.value.attributes.push({ name: '', value: '' });
};

const removeAttribute = (index) => {
  product.value.attributes.splice(index, 1);
};

const addArrayAttribute = () => {
  if (!product.value.arrayAttributes) {
    product.value.arrayAttributes = [];
  }
  product.value.arrayAttributes.push({ name: '', values: [] });
};

const removeArrayAttribute = (index) => {
  product.value.arrayAttributes.splice(index, 1);
};

const addTechnicalSpec = () => {
  if (!product.value.technicalSpecs) {
    product.value.technicalSpecs = [];
  }
  product.value.technicalSpecs.push({ key: '', value: '' });
};

const removeTechnicalSpec = (index) => {
  product.value.technicalSpecs.splice(index, 1);
};

onMounted(fetchProductDetails);
</script>
