``` mermaid

graph TD
    %% Node IDs for clarity
    A([App.vue Admin])
    B(AdminProducts)
    C(AdminLogin)
    D(AdminCategories)
    E[adminService]
    F[authService Admin]
    G([App.vue Vendor])
    H(AddProduct)
    I(ManageProducts)
    J(VendorLanding)
    K[vendorService]
    L[categoryService]
    M[authService Vendor]
    N[adminRoutes]
    O[vendorRoutes]
    P[productRoutes]
    Q[Authentication]
    R[Authorization]
    S[adminController]
    T[vendorController]
    U[productController]
    V(User.js)
    W(Product.js)
    X(Category.js)

    %% Grouping and Layering (Minimal Indentation)
    subgraph Admin Panel
        subgraph Admin Components
            A
            B
            C
            D
        end
        subgraph Admin Services
            E
            F
        end
    end

    subgraph Vendor Panel
        subgraph Vendor Components
            G
            H
            I
            J
        end
        subgraph Vendor Services
            K
            L
            M
        end
    end

    subgraph Backend Services
        subgraph Routes
            N
            O
            P
        end
        subgraph Middleware
            Q
            R
        end
        subgraph Controllers
            S
            T
            U
        end
        subgraph Models
            V
            W
            X
        end
    end

    %% Define Connections (Edges)
    %% Admin Panel Internal
    A --> B
    A --> C
    A --> D
    B --> E
    D --> E
    C --> F
    
    %% Vendor Panel Internal
    G --> H
    G --> I
    G --> J
    H --> K
    I --> K
    H --> L
    J --> M
    
    %% Frontend to Backend
    E --> N
    K --> O
    L --> P
    F --> Q
    M --> Q
    
    %% Backend Flow
    N --> Q
    O --> Q
    P --> Q
    Q --> R
    R --> S
    R --> T
    R --> U
    
    %% Controllers to Models
    S --> V
    T --> V
    T --> W
    U --> W
    U --> X
    ```