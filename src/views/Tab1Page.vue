<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Masuk ke Akun</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Username</ion-label>
            <ion-input v-model="username" placeholder="Masukkan username"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              type="password"
              v-model="password"
              placeholder="Masukkan password"
            ></ion-input>
          </ion-item>

          <ion-button
            expand="block"
            color="primary"
            class="ion-margin-top"
            @click="loginUser"
          >
            LOGIN
          </ion-button>

          <p v-if="errorMessage" style="color: red; text-align: center;">
            {{ errorMessage }}
          </p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue'
import router from '@/router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function loginUser() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Username dan password wajib diisi'
    return
  }

  try {
    const response = await fetch('http://localhost/crud-app/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.token)
      errorMessage.value = ''
      router.push('/tabs/login') // arahkan ke halaman usertable
    } else {
      errorMessage.value = data.message || 'Login gagal'
    }
  } catch (err) {
    errorMessage.value = 'Gagal terhubung ke server'
  }
}
</script>
