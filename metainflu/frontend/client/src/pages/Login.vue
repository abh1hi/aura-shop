<!-- File: frontend/client/src/pages/Login.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Login</h1>
            </div>
        </section>

        <section class="section container">
            <div class="auth-container">
                <h2>Welcome Back</h2>
                <p>Sign in to your account to continue.</p>
                <form class="auth-form" @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" autocomplete="email" required v-model="email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password">
                    </div>
                     <div class="form-actions">
                        <a href="#" class="forgot-password">Forgot password?</a>
                        <button type="submit" class="cta-button">Sign In</button>
                    </div>
                </form>
                <p class="switch-auth">
                    Don't have an account? <router-link to="/register">Create one</router-link>
                </p>
            </div>
        </section>
    </div>
</template>

<script>
import authService from '../services/authService';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const userData = {
          email: this.email,
          password: this.password,
        };
        const response = await authService.login(userData);
        console.log('Login successful:', response);
        
        globalState.isLoggedIn = true;
        globalState.user = response;
        
        this.router.push('/');
      } catch (error) {
        console.error('Login failed:', error.message);
        // Here you could add logic to show an error message to the user
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
    max-width: 500px;
    margin: 0 auto;
    background-color: #fff;
    padding: 3rem;
    border-radius: 12px;
    border: 1px solid var(--light-gray);
    text-align: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.auth-container h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--c5);
}

.auth-container p {
    color: #555;
    margin-bottom: 2.5rem;
}

.auth-form {
    text-align: left;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.form-group input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: var(--c5);
    box-shadow: 0 0 0 3px rgba(154, 82, 255, 0.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 2rem;
}

.forgot-password {
    font-size: 0.9rem;
    color: var(--c5);
    text-decoration: none;
    margin-right: auto;
    transition: color 0.3s;
}
.forgot-password:hover {
    color: var(--c6);
}

.switch-auth {
    margin-top: 2rem;
    font-size: 1rem;
}

.switch-auth a {
    color: var(--c5);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s;
}
.switch-auth a:hover {
    color: var(--c6);
}
</style>
