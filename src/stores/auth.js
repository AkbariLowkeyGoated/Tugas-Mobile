javascript
// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Cek LocalStorage untuk mempertahankan state setelah refresh
  const tokenFromStorage = localStorage.getItem('auth_token');
  
  const isAuthenticated = ref(!!tokenFromStorage);
  const user = ref(null); // Ganti dengan logika pengambilan data user jika ada
  const token = ref(tokenFromStorage);

  function setAuth(data) {
    isAuthenticated.value = true;
    // user.value = data.user; // Aktifkan jika backend mengembalikan data user
    token.value = data.token;
    localStorage.setItem('auth_token', data.token);
  }

  function clearAuth() {
    isAuthenticated.value = false;
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
  }

  return {
    isAuthenticated,
    user,
    token,
    setAuth,
    clearAuth,
  };
});