import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

const baseUrl = 'http://localhost:3000'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: {
    id: number
    name: string
  }
}

interface AuthState {
  token: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post(`${baseUrl}/auth/login`, {
          email,
          password,
        })
        this.token = response.data.access_token
        this.user = response.data.user

        // Set token and user in localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        router.replace('/dashboard')
      } catch (error) {
        console.error('Login failed:', error)
        alert('Invalid email or password')
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    },
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || 'null')

      if (token && user) {
        this.token = token
        this.user = user
      } else {
        this.logout()
      }
    },
  },
  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
    userRole: state => state.user?.role.name || '',
    fullName: state =>
      state.user ? `${state.user.first_name} ${state.user.last_name}` : '',
  },
})
