<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Manajemen User</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Tambah / Edit User</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-input v-model="email" label="Email" label-placement="floating"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="username" label="Username" label-placement="floating"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="password" label="Password" label-placement="floating" type="password"></ion-input>
          </ion-item>

          <ion-button expand="block" color="success" @click="saveUser">
            {{ editId ? 'Update' : 'Tambah' }}
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Daftar User</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item v-for="user in users" :key="user.id_data">
              <ion-label>
                <h2>{{ user.username }}</h2>
                <p>{{ user.email }}</p>
              </ion-label>
              <ion-button color="warning" @click="editUser(user)">Edit</ion-button>
              <ion-button color="danger" @click="deleteUser(user.id_data)">Hapus</ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonButton, IonLabel, IonList
} from "@ionic/vue";

const users = ref([]);
const email = ref("");
const username = ref("");
const password = ref("");
const editId = ref(null);

const API_URL = "http://localhost/crud-app/auth.php";

const fetchUsers = async () => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get" })
  });
  const data = await res.json();
  if (data.success) users.value = data.data;
};

const saveUser = async () => {
  const action = editId.value ? "update" : "create";
  const body = {
    action,
    id_data: editId.value,
    email: email.value,
    username: username.value,
    password: password.value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  alert(data.message);
  resetForm();
  fetchUsers();
};

const editUser = (user) => {
  editId.value = user.id_data;
  email.value = user.email;
  username.value = user.username;
  password.value = user.password;
};

const deleteUser = async (id) => {
  if (!confirm("Yakin mau hapus data ini?")) return;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id_data: id })
  });
  const data = await res.json();
  alert(data.message);
  fetchUsers();
};

const resetForm = () => {
  editId.value = null;
  email.value = "";
  username.value = "";
  password.value = "";
};

onMounted(fetchUsers);
</script>
