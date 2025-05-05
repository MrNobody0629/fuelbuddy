import { defineStore } from 'pinia';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
  }),
  actions: {
    async signup(email: string, password: string) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      this.user = res.user;
    },
    async login(email: string, password: string) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      this.user = res.user;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});
