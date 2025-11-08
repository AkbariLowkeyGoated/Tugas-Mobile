import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'UserTable',
  setup() {
    const users = ref([]);
    const name = ref('');
    const email = ref('');
    const editId = ref(null);
    const API_URL = 'http://localhost/Api.php';

    // 🔹 Ambil semua data user
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_URL);
        users.value = res.data;
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };

    // 🔹 Tambah atau update user
    const saveUser = async () => {
      try {
        if (!name.value || !email.value) {
          alert('Nama dan Email wajib diisi!');
          return;
        }

        if (editId.value) {
          // Update data
          await axios.put(`${API_URL}?id=${editId.value}`, {
            name: name.value,
            email: email.value
          });
          alert('Data berhasil diperbarui!');
        } else {
          // Tambah data baru
          await axios.post(API_URL, {
            name: name.value,
            email: email.value
          });
          alert('Data berhasil ditambahkan!');
        }

        // Reset form
        name.value = '';
        email.value = '';
        editId.value = null;
        fetchUsers();
      } catch (err) {
        console.error('Gagal menyimpan data:', err);
      }
    };

    // 🔹 Hapus user
    const deleteUser = async (id) => {
      if (confirm('Yakin ingin menghapus data ini?')) {
        try {
          await axios.delete(`${API_URL}?id=${id}`);
          alert('Data berhasil dihapus!');
          fetchUsers();
        } catch (err) {
          console.error('Gagal menghapus data:', err);
        }
      }
    };

    // 🔹 Isi form untuk edit
    const editUser = (user) => {
      name.value = user.name;
      email.value = user.email;
      editId.value = user.id;
    };

    // Jalankan saat komponen pertama kali muncul
    onMounted(fetchUsers);

    return {
      users,
      name,
      email,
      editId,
      saveUser,
      deleteUser,
      editUser
    };
  },

  template: `
    <div class="container mt-4">
      <h2 class="text-center mb-3">Manajemen User</h2>

      <form @submit.prevent="saveUser" class="mb-3">
        <div>
          <input v-model="name" placeholder="Nama" class="form-control mb-2" />
          <input v-model="email" placeholder="Email" class="form-control mb-2" />
        </div>
        <button class="btn btn-primary">
          {{ editId ? 'Update Data' : 'Tambah Data' }}
        </button>
      </form>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="editUser(user)" class="btn btn-warning btn-sm me-2">Edit</button>
              <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};
