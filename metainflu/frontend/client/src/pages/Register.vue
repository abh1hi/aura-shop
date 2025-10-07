<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Join AURA to enjoy a seamless shopping experience.</p>
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required v-model="name">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required v-model="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password">
        </div>
        <button type="submit" class="auth-button">Create Account</button>
      </form>
      <p class="switch-auth">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async handleRegister() {
      try {
        const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
        };

        await authService.register(userData);
        console.log('Registration successful');
        
        // Redirect to login page after successful registration
        this.router.push('/login');
        
      } catch (error) {
        console.error('Registration failed:', error.message);
        // Here you could add logic to show an error message to the user
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f4f4f9;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.switch-auth {
  text-align: center;
  margin-top: 1.5rem;
}

.switch-auth a {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}
</style>