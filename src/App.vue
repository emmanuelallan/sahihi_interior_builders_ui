<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = async () => {
  await authStore.logout()
  await router.push('/')
}
</script>

<template>
  <header class="flex items-center container mx-auto justify-between h-16 px-4 lg:px-8 border-b border-gray-200">
    <RouterLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center font-bold uppercase py-2 px-5 rounded-full">
      Sahihi Interior Builders
    </RouterLink>

    <nav class="flex space-x-4">
      <RouterLink
        :to="isAuthenticated ? '/' : '/login'"
        class="px-4 py-2 text-sm font-medium rounded hover:bg-slate-100 transition"
      >
        {{ isAuthenticated ? 'CRM' : 'Login' }}
      </RouterLink>

      <button
        v-if="isAuthenticated"
        @click="logout"
        class="px-4 py-2 text-sm font-medium rounded hover:bg-slate-100 transition"
      >
        Logout
      </button>
    </nav>
  </header>

  <main class="bg-gray-50 min-h-base">
    <RouterView />
  </main>
</template>
