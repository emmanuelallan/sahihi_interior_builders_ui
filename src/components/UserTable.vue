<template>
  <div class="space-y-6 p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
      <button
        v-if="isAdmin"
        @click="openAddUserModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Add New User
      </button>
    </div>

    <!-- Users Table -->
    <div v-if="canViewUsers" class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KRA PIN</th>
          <th v-if="isAdmin" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in usersStore.users" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">{{ user.email }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ getRoleName(user.role) }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ user.kra_pin }}
          </td>
          <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              v-if="isAdmin"
              @click="openEditUserModal(user)"
              class="text-indigo-600 hover:text-indigo-900 mr-2 transition-colors duration-200"
            >
              Edit
            </button>
            <button
              v-if="isAdmin"
              @click="confirmDeleteUser(user.id)"
              class="text-red-600 hover:text-red-900 transition-colors duration-200"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit User Modal -->
    <Modal v-if="showModal" @close="closeModal" :title="isEditMode ? 'Edit User' : 'Add New User'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="user-first-name"
            label="First Name"
            v-model="userForm.first_name"
            type="text"
            required
          />
          <FormField
            id="user-last-name"
            label="Last Name"
            v-model="userForm.last_name"
            type="text"
            required
          />
        </div>
        <FormField
          id="user-email"
          label="Email Address"
          v-model="userForm.email"
          type="email"
          required
        />
        <FormField
          id="user-kra-pin"
          label="KRA PIN"
          v-model="userForm.kra_pin"
          type="text"
          required
        />
        <FormSelect
          id="user-role"
          label="Role"
          :options="roleOptions"
          v-model="userForm.role"
          required
        />
        <div>
          <label for="kra-attachment" class="block text-sm font-medium text-gray-700">KRA Attachment</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            {{ isEditMode ? 'Update User' : 'Add User' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import Modal from '@/components/Modal.vue'
import FormField from '@/components/FormField.vue'
import FormSelect from '@/components/FormSelect.vue'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const showModal = ref(false)
const isEditMode = ref(false)
const userForm = ref({
  id: null as number | null,
  first_name: '',
  last_name: '',
  email: '',
  kra_pin: '',
  role: '',
  kra_attachment: null as File | null
})

const isAdmin = computed(() => authStore.userRole === 'ADMIN')
const canViewUsers = computed(() => isAdmin.value || authStore.userRole === 'PROJECT_MANAGER')

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'ENGINEER', label: 'Engineer' }
]

function getRoleName(role: { id: number, name: string }): string {
  return role.name
}

onMounted(async () => {
  if (canViewUsers.value) {
    try {
      await usersStore.fetchUsers()
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }
})

function openAddUserModal() {
  resetForm()
  showModal.value = true
  isEditMode.value = false
}

function openEditUserModal(user: any) {
  userForm.value = {
    ...user,
    role: user.role.name,
    kra_attachment: null
  }
  showModal.value = true
  isEditMode.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  userForm.value = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    kra_pin: '',
    role: '',
    kra_attachment: null
  }
}

async function handleSubmit() {
  try {
    const userData = {
      ...userForm.value,
      role: isEditMode.value ? { id: getRoleId(userForm.value.role), name: userForm.value.role } : userForm.value.role,
      password_hash: 'password', // This should be handled securely in a real application
    }
    if (isEditMode.value) {
      await usersStore.updateUser(userForm.value.id!, userData)
    } else {
      await usersStore.addUser(userData)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to submit user:', error)
  }
}

function getRoleId(roleName: string): number {
  const role = roleOptions.find(r => r.value === roleName)
  return role ? roleOptions.indexOf(role) + 1 : 0
}

function confirmDeleteUser(userId: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    usersStore.deleteUser(userId)
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    userForm.value.kra_attachment = target.files[0]
  }
}
</script>
