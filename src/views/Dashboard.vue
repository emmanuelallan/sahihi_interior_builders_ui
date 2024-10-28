<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, {{ `${authStore.user?.first_name} ${authStore.user?.last_name}` }}
      </h1>
      <p class="text-gray-500 text-sm mt-2">
        {{ currentDate }}
      </p>
    </div>

    <!-- Stats Overview -->
    <div>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
      <StatsOverview />
    </div>

    <!-- Main Content Area -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6">
        <div class="space-y-6">
          <!-- Conditional Title Based on Role -->
          <h3 class="text-lg font-medium text-gray-900">
            {{ authStore.userRole === 'ADMIN' ? 'Recent Users' : 'Your Assigned Projects' }}
          </h3>

          <UserTable />
          <ProjectsTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatsOverview from '@/components/StatsOverview.vue'
import UserTable from '@/components/UserTable.vue'
import ProjectsTable from '@/components/ProjectsTable.vue'

const authStore = useAuthStore()

// Computed Properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
