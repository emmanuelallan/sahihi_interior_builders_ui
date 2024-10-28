import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const baseUrl = 'http://localhost:3000'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  kra_pin: string
  role: {
    id: number
    name: string
  }
}

interface UserState {
  users: User[]
}

export const useUsersStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${baseUrl}/users`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.users = response.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      }
    },
    async addUser(userData: Omit<User, 'id'>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.post(`${baseUrl}/users`, userData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.users.push(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to add user:', error)
        throw error
      }
    },
    async updateUser(userId: number, userData: Partial<User>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.patch(`${baseUrl}/users/${userId}`, userData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        const index = this.users.findIndex(user => user.id === userId)
        if (index !== -1) {
          this.users[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      }
    },
    async deleteUser(userId: number) {
      try {
        const authStore = useAuthStore()
        await axios.delete(`${baseUrl}/users/${userId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw error
      }
    },
  },
  getters: {
    getUserById: (state) => (id: number) => state.users.find(user => user.id === id),
  },
})
