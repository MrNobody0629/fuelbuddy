<template>
  <div class="signup-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
       <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
       <p v-if="error" class="text-red-500 text-sm mt-4 text-center">
        <button
          @click="redirectToSignup"
          class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </button>
       </p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signupWithFirebase } from '../api/auth.ts';
import { auth } from '../firebase.ts';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
const toast = useToast();

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    const token = await user.getIdToken();
    localStorage.setItem('auth_token', token);
    await signupWithFirebase(token);
    toast.success('Login successful!');
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
    toast.error(err.message || 'Error while login!');
    console.error(err);
  }
};

const redirectToSignup = () => {
  router.push('/signup');
};

</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
}
</style>
