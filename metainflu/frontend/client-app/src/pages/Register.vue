<template>
  <div class="auth-page bg-gray-50">
    <div class="auth-container">
      <div class="text-center">
        <h1 class="auth-title text-gray-900">Create Account</h1>
        <p class="auth-subtitle text-gray-600">Join AURA to enjoy a seamless shopping experience.</p>
      </div>
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name" class="sr-only">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required v-model="name" placeholder="Name" class="auth-input">
        </div>
        <div class="form-group">
          <label for="email" class="sr-only">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required v-model="email" placeholder="Email" class="auth-input">
        </div>
        <div class="form-group">
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password" placeholder="Password" class="auth-input">
        </div>
        <button type="submit" class="auth-button">Create Account</button>
      </form>
      <p class="switch-auth-text">
        Already have an account? <router-link to="/login" class="switch-auth-link">Sign in</router-link>
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
        
        
        // Redirect to login page after successful registration
        this.router.push('/login');
        
      } catch (error) {
        
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
  min-height: 100vh;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.auth-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.auth-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.auth-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.auth-input:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.auth-button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #8b5cf6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-top: 1rem;
}

.auth-button:hover {
  background-color: #7c3aed;
}

.switch-auth-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.switch-auth-link {
  font-weight: 600;
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.switch-auth-link:hover {
  color: #7c3aed;
}
</style>