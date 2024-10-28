<template>
  <div class="space-y-6 p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Project Management</h2>
      <button
        v-if="isAdmin"
        @click="openAddProjectModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Add New Project
      </button>
    </div>

    <!-- Projects Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dates
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Project Manager
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Engineer
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="project in filteredProjects" :key="project.id">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ project.name }}
              </div>
              <div class="text-xs text-gray-500">{{ project.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="statusBadgeClass(project.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ project.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(project.start_date) }} -
              {{ formatDate(project.end_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ project.project_manager.first_name }}
              {{ project.project_manager.last_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ project.engineer.first_name }} {{ project.engineer.last_name }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                v-if="canEditProject"
                @click="openEditProjectModal(project)"
                class="text-indigo-600 hover:text-indigo-900 mr-2 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                v-if="isAdmin"
                @click="confirmDeleteProject(project.id)"
                class="text-red-600 hover:text-red-900 transition-colors duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Project Modal -->
    <Modal
      v-if="showModal"
      @close="closeModal"
      :title="isEditMode ? 'Edit Project' : 'Add New Project'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField
          id="project-name"
          label="Project Name"
          v-model="projectForm.name"
          type="text"
          required
        />
        <FormField
          id="project-description"
          label="Description"
          v-model="projectForm.description"
          type="textarea"
        />
        <FormField
          id="project-start-date"
          label="Start Date"
          v-model="projectForm.start_date"
          type="date"
          required
        />
        <FormField
          id="project-end-date"
          label="End Date"
          v-model="projectForm.end_date"
          type="date"
          required
        />
        <FormSelect
          v-if="isAdmin"
          id="project-manager"
          label="Project Manager"
          :options="projectManagerOptions"
          v-model="projectForm.project_manager"
          required
        />
        <FormSelect
          v-if="isAdmin"
          id="project-engineer"
          label="Engineer"
          :options="engineerOptions"
          v-model="projectForm.engineer"
          required
        />
        <FormSelect
          id="project-status"
          label="Status"
          :options="statusOptions"
          v-model="projectForm.status"
          required
        />
        <div class="flex justify-end mt-4 gap-2">
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            {{ isEditMode ? 'Update Project' : 'Add Project' }}
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
import { useProjectsStore } from '@/stores/projects'
import { useUsersStore } from '@/stores/users'
import Modal from '@/components/Modal.vue'
import FormField from '@/components/FormField.vue'
import FormSelect from '@/components/FormSelect.vue'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const usersStore = useUsersStore()

const showModal = ref(false)
const isEditMode = ref(false)
const projectForm = ref({
  id: null as number | null,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'Pending',
  project_manager: null as number | null,
  engineer: null as number | null,
})

const isAdmin = computed(() => authStore.userRole === 'ADMIN')
const canAddProject = computed(() => isAdmin.value)
const canEditProject = computed(
  () => isAdmin.value || authStore.userRole === 'PROJECT_MANAGER',
)

const projectManagers = computed(() =>
  usersStore.users.filter(user => user.role.name === 'PROJECT_MANAGER'),
)
const engineers = computed(() =>
  usersStore.users.filter(user => user.role.name === 'ENGINEER'),
)

const projectManagerOptions = computed(() =>
  projectManagers.value.map(pm => ({
    value: pm.id,
    label: `${pm.first_name} ${pm.last_name}`,
  })),
)

const engineerOptions = computed(() =>
  engineers.value.map(eng => ({
    value: eng.id,
    label: `${eng.first_name} ${eng.last_name}`,
  })),
)

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

const filteredProjects = computed(() => {
  return projectsStore.projects
})

onMounted(async () => {
  try {
    await projectsStore.fetchProjects()
    await usersStore.fetchUsers()
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
  }
})

function openAddProjectModal() {
  resetForm()
  showModal.value = true
  isEditMode.value = false
}

function openEditProjectModal(project: any) {
  projectForm.value = {
    ...project,
    project_manager: project.project_manager.id,
    engineer: project.engineer.id,
  }
  showModal.value = true
  isEditMode.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  projectForm.value = {
    id: null,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
    project_manager: null,
    engineer: null,
  }
}

async function handleSubmit() {
  try {
    if (isEditMode.value) {
      await projectsStore.updateProject(
        projectForm.value.id!,
        projectForm.value,
      )
    } else {
      await projectsStore.addProject(projectForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to submit project:', error)
  }
}

function confirmDeleteProject(projectId: number) {
  if (confirm('Are you sure you want to delete this project?')) {
    projectsStore.deleteProject(projectId)
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}
</script>
