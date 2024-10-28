import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const baseUrl = 'http://localhost:3000'

interface Project {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_manager: {
    id: number
    first_name: string
    last_name: string
  }
  engineer: {
    id: number
    first_name: string
    last_name: string
  }
}

interface ProjectState {
  projects: Project[]
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
  }),
  actions: {
    async fetchProjects() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${baseUrl}/projects`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.projects = response.data
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        throw error
      }
    },
    async addProject(projectData: Omit<Project, 'id'>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.post(`${baseUrl}/projects`, projectData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.projects.push(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to add project:', error)
        throw error
      }
    },
    async updateProject(projectId: number, projectData: Partial<Project>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.patch(`${baseUrl}/projects/${projectId}`, projectData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        const index = this.projects.findIndex(project => project.id === projectId)
        if (index !== -1) {
          this.projects[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('Failed to update project:', error)
        throw error
      }
    },
    async deleteProject(projectId: number) {
      try {
        const authStore = useAuthStore()
        await axios.delete(`${baseUrl}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.projects = this.projects.filter(project => project.id !== projectId)
      } catch (error) {
        console.error('Failed to delete project:', error)
        throw error
      }
    },
  },
  getters: {
    getProjectById: (state) => (id: number) => state.projects.find(project => project.id === id),
    getProjectsByManager: (state) => (managerId: number) => state.projects.filter(project => project.project_manager.id === managerId),
    getProjectsByEngineer: (state) => (engineerId: number) => state.projects.filter(project => project.engineer.id === engineerId),
  },
})
