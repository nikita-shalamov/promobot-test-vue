<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { fetchUsers, addUser, deleteUser, updateUser } from '../services/users.service';
import type { INewUser, IUser } from '../types/IUser';
import Notification from './Notification.vue';

const notification = ref();

const addUserStatus = ref<boolean>(false);
const users = ref<IUser[]>([]);
const newUser = reactive<INewUser>({
  username: '',
  phone: '',
  email: '',
  register_date: new Date(),
  code: 0,
  city: '',
});
const filter = ref('');
const editingUserId = ref<number | null>(null);

const loadUsers = async () => {
  try {
    users.value = await fetchUsers();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    notification.value.showNotification('Ошибка при загрузке пользователей.', 'error');
  }
};

const handleAddUser = async () => {
  if (!newUser.username || !newUser.phone || !newUser.email || !newUser.city) {
    notification.value.showNotification('Пожалуйста, заполните все обязательные поля!', 'error');
    return;
  }

  try {
    await addUser(newUser);
    loadUsers();
    resetNewUserForm();
    addUserStatus.value = false;
    notification.value.showNotification('Пользователь успешно добавлен!', 'success');
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    notification.value.showNotification('Ошибка при добавлении пользователя.', 'error');
  }
};

const handleDeleteUser = async (userId: number) => {
  try {
    await deleteUser(userId);
    users.value = users.value.filter((user) => user.id !== userId);
    notification.value.showNotification('Пользователь успешно удалён!', 'success');
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    notification.value.showNotification('Ошибка при удалении пользователя.', 'error');
  }
};

const handleUpdateUser = async (user: IUser) => {
  try {
    await updateUser(user);
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index] = { ...user };
    }
    // loadUsers();
    notification.value.showNotification('Пользователь успешно обновлён!', 'success');
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    notification.value.showNotification('Ошибка при обновлении пользователя.', 'error');
  }
};

const resetNewUserForm = () => {
  Object.keys(newUser).forEach((key) => {
    if (key === 'register_date') {
      newUser[key] = new Date();
    } else if (key === 'code') {
      newUser[key] = 0;
    } else {
      newUser[key as keyof INewUser] = '';
    }
  });
};

onMounted(() => {
  loadUsers();
});

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.username.toLowerCase().includes(filter.value.toLowerCase()),
  );
});
</script>

<template>
  <Notification ref="notification" />
  <div class="w-full h-auto p-4">
    <div class="mb-4 flex justify-between items-center">
      <input
        v-model="filter"
        type="text"
        placeholder="Фильтр по имени пользователя"
        class="border border-gray-300 rounded px-2 py-1 w-full max-w-[300px] h-fit outline-none"
      />
      <button
        @click="addUserStatus = true"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
      >
        Добавить пользователя
      </button>
    </div>

    <div class="w-full">
      <div>
        <div class="flex w-full justify-between">
          <span class="header-col">Имя пользователя</span>
          <span class="header-col">Телефон</span>
          <span class="header-col">Email</span>
          <span class="header-col">Дата регистрации</span>
          <span class="header-col max-w-[120px]">Код</span>
          <span class="header-col">Город</span>
          <span class="header-col max-w-[100px]"></span>
        </div>
      </div>
      <div v-if="addUserStatus">
        <div class="flex w-full justify-between">
          <div class="col">
            <input
              class="border-1 border-[#4aa6ff]"
              v-model="newUser.username"
              type="text"
              placeholder="Имя пользователя"
            />
          </div>
          <div class="col">
            <input
              type="text"
              placeholder="Телефон"
              v-model="newUser.phone"
              class="border-1 border-[#4aa6ff]"
            />
          </div>
          <div class="col">
            <input
              type="text"
              placeholder="Email"
              v-model="newUser.email"
              class="border-1 border-[#4aa6ff]"
            />
          </div>
          <div class="col">
            <input type="date" v-model="newUser.register_date" class="border-1 border-[#4aa6ff]" />
          </div>
          <div class="col max-w-[120px]">
            <input
              type="text"
              placeholder="Код"
              v-model="newUser.code"
              class="border-1 border-[#4aa6ff]"
            />
          </div>
          <div class="col">
            <input
              type="text"
              placeholder="Город"
              v-model="newUser.city"
              class="border-1 border-[#4aa6ff]"
            />
          </div>
          <div class="col max-w-[100px]">
            <div class="flex flex-nowrap px-4 py-3">
              <button @click="handleAddUser" class="bg-green-500 p-1 rounded hover:bg-green-600">
                <img src="/icons/check.svg" alt="" />
              </button>
              <button
                @click="
                  () => {
                    resetNewUserForm();
                    addUserStatus = !addUserStatus;
                  }
                "
                class="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
              >
                <img src="/icons/delete.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="flex w-full justify-between" v-for="user in filteredUsers" :key="user.id">
          <div class="col">
            <input
              :disabled="editingUserId !== user.id"
              v-model="user.username"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
                'border-[#4aa6ff/0]': editingUserId !== user.id,
              }"
            />
          </div>
          <div class="col">
            <input
              :disabled="editingUserId !== user.id"
              v-model="user.phone"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
              }"
            />
          </div>
          <div class="col">
            <input
              :disabled="editingUserId !== user.id"
              v-model="user.email"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
              }"
            />
          </div>
          <div class="col">
            <input
              v-if="editingUserId === user.id"
              type="date"
              v-model="user.register_date"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
              }"
            />
            <span v-else>
              {{ user.register_date ? new Date(user.register_date).toLocaleDateString() : 'N/A' }}
            </span>
          </div>
          <div class="col max-w-[120px]">
            <input
              :disabled="editingUserId !== user.id"
              v-model="user.code"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
              }"
            />
          </div>
          <div class="col">
            <input
              :disabled="editingUserId !== user.id"
              v-model="user.city"
              :class="{
                'border-1': editingUserId === user.id,
                'border-[#4aa6ff]': editingUserId === user.id,
              }"
            />
          </div>
          <div class="col max-w-[100px]">
            <div class="flex flex-nowrap px-4 py-3">
              <button
                v-if="editingUserId === user.id"
                @click="handleUpdateUser(user).then(() => (editingUserId = null))"
                class="bg-green-500 p-1 rounded hover:bg-green-600"
              >
                <img src="/icons/check.svg" alt="" />
              </button>
              <button
                v-else
                @click="editingUserId = user.id"
                class="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
              >
                <img src="/icons/edit.svg" alt="" />
              </button>
              <button
                @click="handleDeleteUser(user.id)"
                class="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
              >
                <img src="/icons/delete.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  z-index: 1000;
  font-weight: bold;
  animation: fadeInOut 3s forwards;
}
.notification.success {
  background-color: #4caf50;
}
.notification.error {
  background-color: #f44336;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10%,
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
.header-col {
  color: #7b8395;
  font-size: 12px;
  background: rgba(240, 242, 244, 0.5);
  padding: 16px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  border-right: 1px solid rgba(198, 209, 221, 0.5);
  border-bottom: 1px solid rgba(198, 209, 221, 0.5);
}

.col {
  background: white;
  color: #1f232e;
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  padding: 2px;
  width: 100%;
  border-right: 1px solid rgba(198, 209, 221, 0.5);
  border-bottom: 1px solid rgba(198, 209, 221, 0.5);
  input {
    width: 100%;
    height: 100%;
    outline: none;
    padding: 12px 16px;
    /* border: 1px solid; */
    /* border-color: rgba(0, 0, 0, 0); */
    border-radius: 4px;
  }
  span {
    display: block;
    padding: 14px 16px;
  }
}
</style>
