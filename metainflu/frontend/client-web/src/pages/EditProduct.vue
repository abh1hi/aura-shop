<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="max-w-4xl mx-auto">
      <router-link to="/vendor-panel/products" class="text-gray-600 hover:text-blue-600 flex items-center mb-6">
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Products
      </router-link>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
      
      <div class="relative mb-4">
        <input type="text" v-model="searchQuery" placeholder="Search for a field to edit..." @keydown.esc="searchQuery = ''" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        <ul v-if="searchResults.length" class="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          <li v-for="field in searchResults" :key="field.name" @click="jumpToField(field)" class="px-4 py-3 cursor-pointer hover:bg-blue-50">
            {{ field.name }} <span class="text-xs text-gray-500 ml-2">in {{ field.tab }}</span>
          </li>
        </ul>
      </div>

      <div v-if="loading" class="text-center text-gray-500 py-8">Loading product details...</div>
      <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mb-6">Error: {{ error }}</div>
      <div v-else-if="product" class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button @click="activeTab = 'basic'" :class="[activeTab === 'basic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
              Basic Info
            </button>
            <button @click="activeTab = 'variants'" :class="[activeTab === 'variants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
              Variants
            </button>
            <button @click="activeTab = 'images'" :class="[activeTab === 'images' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
              Images
            </button>
            <button @click="activeTab = 'details'" :class="[activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
              Details
            </button>
            <button @click="activeTab = 'attributes'" :class="[activeTab === 'attributes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
              Attributes
            </button>
          </nav>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-6 mt-6">
          <!-- Basic Info Tab -->
          <div v-show="activeTab === 'basic'" id="basic-tab-content">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" id="name" required v-model="product.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="brand" class="block text-sm font-medium text-gray-700">Brand</label>
                <input type="text" id="brand" v-model="product.brand" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" rows="4" v-model="product.description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            <div>
              <label for="categories" class="block text-sm font-medium text-gray-700">Categories</label>
              <select id="categories" multiple v-model="product.categories" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              </select>
            </div>
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input type="text" id="tags" v-model="product.tags" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
          </div>

          <!-- Variants Tab -->
          <div v-show="activeTab === 'variants'" id="variants-tab-content">
            <div v-for="(variant, index) in product.variants" :key="index" class="border-t pt-4 mt-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Variant {{ index + 1 }}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label :for="`variant-sku-${index}`" class="block text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" :id="`variant-sku-${index}`" required v-model="variant.sku" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`variant-price-${index}`" class="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input type="number" :id="`variant-price-${index}`" required v-model.number="variant.price" min="0" step="0.01" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`variant-stock-${index}`" class="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" :id="`variant-stock-${index}`" required v-model.number="variant.stock" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
              </div>
              <button @click.prevent="removeVariant(index)" class="mt-2 text-red-500 hover:text-red-700 text-sm">Remove Variant</button>
            </div>
            <button @click.prevent="addVariant" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Variant</button>
          </div>

          <!-- Images Tab -->
          <div v-show="activeTab === 'images'" id="images-tab-content">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Product Images</h3>
            <div v-for="(image, index) in product.images" :key="index" class="border-t pt-4 mt-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label :for="`image-url-${index}`" class="block text-sm font-medium text-gray-700">URL</label>
                  <input type="text" :id="`image-url-${index}`" v-model="image.url" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`image-alt-${index}`" class="block text-sm font-medium text-gray-700">Alt Text</label>
                  <input type="text" :id="`image-alt-${index}`" v-model="image.altText" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`image-position-${index}`" class="block text-sm font-medium text-gray-700">Position</label>
                  <input type="number" :id="`image-position-${index}`" v-model.number="image.position" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`image-variant-${index}`" class="block text-sm font-medium text-gray-700">Assign to Variant (optional)</label>
                  <select :id="`image-variant-${index}`" v-model="image.variantSku" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option :value="null">General Product Image</option>
                    <option v-for="variant in product.variants" :key="variant.sku" :value="variant.sku">
                      Variant: {{ variant.sku || '(no SKU yet)' }}
                    </option>
                  </select>
                </div>
              </div>
              <button @click.prevent="removeImage(index)" class="mt-2 text-red-500 hover:text-red-700 text-sm">Remove Image</button>
            </div>
            <button @click.prevent="addImage" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Image</button>
          </div>

          <!-- Details Tab -->
          <div v-show="activeTab === 'details'" id="details-tab-content">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="modelNumber" class="block text-sm font-medium text-gray-700">Model Number</label>
                <input type="text" id="modelNumber" v-model="product.modelNumber" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="gtin" class="block text-sm font-medium text-gray-700">GTIN</label>
                <input type="text" id="gtin" v-model="product.gtin" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="pattern" class="block text-sm font-medium text-gray-700">Pattern</label>
                <input type="text" id="pattern" v-model="product.pattern" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="style" class="block text-sm font-medium text-gray-700">Style</label>
                <input type="text" id="style" v-model="product.style" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="ageGroup" class="block text-sm font-medium text-gray-700">Age Group</label>
                <input type="text" id="ageGroup" v-model="product.ageGroup" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                <input type="text" id="gender" v-model="product.gender" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="releaseYear" class="block text-sm font-medium text-gray-700">Release Year</label>
                <input type="text" id="releaseYear" v-model="product.releaseYear" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="season" class="block text-sm font-medium text-gray-700">Season</label>
                <input type="text" id="season" v-model="product.season" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="careInstructions" class="block text-sm font-medium text-gray-700">Care Instructions</label>
                <input type="text" id="careInstructions" v-model="product.careInstructions" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="warranty" class="block text-sm font-medium text-gray-700">Warranty</label>
                <input type="text" id="warranty" v-model="product.warranty" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="regionOfOrigin" class="block text-sm font-medium text-gray-700">Region of Origin</label>
                <input type="text" id="regionOfOrigin" v-model="product.regionOfOrigin" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="safetyWarnings" class="block text-sm font-medium text-gray-700">Safety Warnings</label>
                <input type="text" id="safetyWarnings" v-model="product.safetyWarnings" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700">Weight</label>
                <input type="number" id="weight" v-model.number="product.weight" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="expirationDate" class="block text-sm font-medium text-gray-700">Expiration Date</label>
                <input type="date" id="expirationDate" v-model="product.expirationDate" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>

              <!-- Dimensions -->
              <div class="sm:col-span-2" id="dimensions-section" v-if="product.dimensions">
                <h4 class="text-md font-medium text-gray-800">Dimensions</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  <div>
                    <label for="dim-length" class="block text-sm font-medium text-gray-700">Length</label>
                    <input type="number" id="dim-length" v-model.number="product.dimensions.length" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-width" class="block text-sm font-medium text-gray-700">Width</label>
                    <input type="number" id="dim-width" v-model.number="product.dimensions.width" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-height" class="block text-sm font-medium text-gray-700">Height</label>
                    <input type="number" id="dim-height" v-model.number="product.dimensions.height" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="dim-unit" class="block text-sm font-medium text-gray-700">Unit</label>
                    <input type="text" id="dim-unit" v-model="product.dimensions.unit" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>
              </div>

              <!-- Power -->
              <div class="sm:col-span-2" id="power-section" v-if="product.power">
                <h4 class="text-md font-medium text-gray-800">Power</h4>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label for="power-voltage" class="block text-sm font-medium text-gray-700">Voltage</label>
                    <input type="number" id="power-voltage" v-model.number="product.power.voltage" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="power-unit" class="block text-sm font-medium text-gray-700">Unit</label>
                    <input type="text" id="power-unit" v-model="product.power.unit" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <label for="sustainability" class="block text-sm font-medium text-gray-700">Sustainability (comma-separated)</label>
                <input type="text" id="sustainability" :value="product.sustainability && product.sustainability.join(', ')" @input="product.sustainability = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="certifications" class="block text-sm font-medium text-gray-700">Certifications (comma-separated)</label>
                <input type="text" id="certifications" :value="product.certifications && product.certifications.join(', ')" @input="product.certifications = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="ingredients" class="block text-sm font-medium text-gray-700">Ingredients (comma-separated)</label>
                <input type="text" id="ingredients" :value="product.ingredients && product.ingredients.join(', ')" @input="product.ingredients = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="inTheBox" class="block text-sm font-medium text-gray-700">In The Box (comma-separated)</label>
                <input type="text" id="inTheBox" :value="product.inTheBox && product.inTheBox.join(', ')" @input="product.inTheBox = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="bundleContents" class="block text-sm font-medium text-gray-700">Bundle Contents (comma-separated)</label>
                <input type="text" id="bundleContents" :value="product.bundleContents && product.bundleContents.join(', ')" @input="product.bundleContents = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
            </div>
          </div>

          <!-- Attributes Tab -->
          <div v-show="activeTab === 'attributes'" id="attributes-tab-content">
            <!-- Attributes -->
            <div id="attributes-section">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Attributes</h3>
              <div v-for="(attr, index) in product.attributes" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-4 mt-4">
                <div>
                  <label :for="`attr-name-${index}`" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" :id="`attr-name-${index}`" v-model="attr.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`attr-value-${index}`" class="block text-sm font-medium text-gray-700">Value</label>
                  <input type="text" :id="`attr-value-${index}`" v-model="attr.value" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <button @click.prevent="removeAttribute(index)" class="mt-2 text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addAttribute" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Attribute</button>
            </div>

            <!-- Array Attributes -->
            <div class="mt-6" id="array-attributes-section">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Array Attributes</h3>
              <div v-for="(attr, index) in product.arrayAttributes" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-4 mt-4">
                <div>
                  <label :for="`arr-attr-name-${index}`" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" :id="`arr-attr-name-${index}`" v-model="attr.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`arr-attr-values-${index}`" class="block text-sm font-medium text-gray-700">Values (comma-separated)</label>
                  <input type="text" :id="`arr-attr-values-${index}`" :value="attr.values.join(', ')" @input="attr.values = $event.target.value.split(',').map(s => s.trim())" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <button @click.prevent="removeArrayAttribute(index)" class="mt-2 text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addArrayAttribute" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Array Attribute</button>
            </div>
            
            <!-- Technical Specs -->
            <div class="mt-6" id="technical-specs-section">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Technical Specs</h3>
              <div v-for="(spec, index) in product.technicalSpecs" :key="index" class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-4 mt-4">
                <div>
                  <label :for="`spec-key-${index}`" class="block text-sm font-medium text-gray-700">Key</label>
                  <input type="text" :id="`spec-key-${index}`" v-model="spec.key" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label :for="`spec-value-${index}`" class="block text-sm font-medium text-gray-700">Value</label>
                  <input type="text" :id="`spec-value-${index}`" v-model="spec.value" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <button @click.prevent="removeTechnicalSpec(index)" class="mt-2 text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
              <button @click.prevent="addTechnicalSpec" class="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Add Technical Spec</button>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
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
    router.push('/vendor-panel/products');
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
