``` mermaid
sequenceDiagram
    actor User
    participant Shop as Shop.vue
    participant ProdService as productService.js
    participant ProdCtrl as productController.js
    participant DB as MongoDB

    User->>Shop: Clicks Category Link (e.g., Cat ID: 123)
    activate Shop
    Shop->>Shop: selectCategory('123')
    Shop->>Shop: selectedCategoryId = '123'
    Shop->>Shop: fetchProducts('123')
    
    Shop->>ProdService: getProducts('123')
    ProdService->>ProdCtrl: GET /api/products?category=123
    
    activate ProdCtrl
    ProdCtrl->>ProdCtrl: categoryId = '123'
    ProdCtrl->>ProdCtrl: const filter = { categories: '123' }
    ProdCtrl->>DB: Product.find({ categories: '123' })
    DB-->>ProdCtrl: Filtered Product List
    deactivate ProdCtrl
    
    ProdCtrl-->>ProdService: Filtered Product List (200 OK)
    ProdService-->>Shop: allProducts state update (reactive)
    
    Shop->>Shop: Recalculate sortedProducts (Local Sort)
    Shop->>ProductCard: Rerender filtered grid
    deactivate Shop
```