import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

interface Stat {
  label: string
  value: number
}

interface StatsState {
  stats: Stat[]
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    stats: [],
  }),
  actions: {
    async fetchStats() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get('http://localhost:3000/stats', {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.stats = response.data
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        throw error
      }
    },
  },
})
