<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="stat in filteredStats"
      :key="stat.label"
      class="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
            :is="stat.icon"
            class="w-12 h-12 rounded-full p-3"
            :class="stat.bgColor"
          />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ stat.label }}
            </dt>
            <dd>
              <div class="text-lg font-bold text-gray-900">
                {{ stat.value }}
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-green-600 font-semibold flex items-center">
            <ArrowUpIcon class="w-4 h-4 mr-1" />
            {{ stat.change }}%
          </span>
          <span class="text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStatsStore } from '@/stores/stats'
import {
  Users as UsersIcon,
  FolderKanban as ProjectsIcon,
  CircleDollarSign as RevenueIcon,
  BarChart as LeadsIcon,
  ArrowUp as ArrowUpIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()
const statsStore = useStatsStore()

onMounted(async () => {
  await statsStore.fetchStats()
})

const iconMap = {
  'Active Projects': ProjectsIcon,
  'Total Users': UsersIcon,
  'Total Revenue': RevenueIcon,
  'New Leads': LeadsIcon,
}

const colorMap = {
  'Active Projects': 'bg-blue-100 text-blue-600',
  'Total Users': 'bg-green-100 text-green-600',
  'Total Revenue': 'bg-purple-100 text-purple-600',
  'New Leads': 'bg-orange-100 text-orange-600',
}

const filteredStats = computed(() => {
  const stats = statsStore.stats.map(stat => ({
    ...stat,
    icon: iconMap[stat.label],
    bgColor: colorMap[stat.label],
    change: Math.floor(Math.random() * 20) + 1,
  }))

  if (authStore.userRole === 'ENGINEER') {
    return stats.filter(stat => stat.label === 'Active Projects')
  }
  return stats
})
</script>
