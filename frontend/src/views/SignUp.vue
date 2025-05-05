<template>
  <div class="signup-container">
    <h2>Create an Account</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="error" class="error">
        <button
          @click="redirectToLogin"
          class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signupWithFirebase } from '../api/auth.ts';
import { auth } from '../firebase.ts';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
const toast = useToast();

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const signup = async () => {
  error.value = '';
  try {
    const result = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const token = await result.user.getIdToken();
    await signupWithFirebase(token);
    toast.success('Account created successfully!');
    router.push('/'); // redirect after signup
  } catch (err: any) {
    error.value = err.message;
    toast.error('Error creating account: ' + error.value);
  }
};
const redirectToLogin = () => {
  router.push('/login');
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
