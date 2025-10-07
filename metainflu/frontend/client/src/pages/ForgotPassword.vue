<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Forgot Password</h1>
      <p class="auth-subtitle">Enter your email to reset your password.</p>
      <form class="auth-form" @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required v-model="email">
        </div>
        <button type="submit" class="auth-button">Reset Password</button>
      </form>
      <p class="switch-auth">
        Remembered your password? <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
    };
  },
  methods: {
    handleForgotPassword() {
      // Handle forgot password logic here
      console.log('Forgot password for:', this.email);
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
