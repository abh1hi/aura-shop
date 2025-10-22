sequenceDiagram
    actor User
    participant C_LoginVue as "Component (Login.vue)"
    participant S_AuthService as "Service (authService.js)"
    participant Browser
    participant BackendServer as "Backend (server.js)"

    User->>C_LoginVue: Enters email & password
    User->>C_LoginVue: Clicks "Sign In" button
    C_LoginVue->>C_LoginVue: handleLogin(email, password)
    C_LoginVue->>S_AuthService: login({email, password})
    S_AuthService->>BackendServer: POST /api/auth/login (sends credentials)
    
    activate BackendServer
    BackendServer->>BackendServer: Verify credentials (DB lookup)
    BackendServer-->>S_AuthService: 200 OK (returns user data + token)
    deactivate BackendServer
    
    S_AuthService->>Browser: localStorage.setItem('user', data)
    S_AuthService-->>C_LoginVue: Returns user data
    
    activate C_LoginVue
    C_LoginVue->>C_LoginVue: Update globalState (isLoggedIn, user)
    C_LoginVue->>C_LoginVue: router.push('/')
    deactivate C_LoginVue
    
    C_LoginVue-->>User: Redirects to Homepage