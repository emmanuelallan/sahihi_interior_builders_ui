<template>
  <div class="space-y-6 p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Customer Management</h2>
      <button
        @click="openAddCustomerModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
      >
        Add New Customer
      </button>
    </div>

    <!-- Customer Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold">Total Customers</h3>
        <p class="text-3xl font-bold">{{ customersStore.totalCustomers.count }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold">Total Leads</h3>
        <p class="text-3xl font-bold">{{ customersStore.totalLeads.count }}</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex space-x-4">
      <input
        v-model="searchQuery"
        @input="searchCustomers"
        type="text"
        placeholder="Search customers..."
        class="flex-grow p-2 border border-gray-300 rounded-md"
      />
      <FormSelect
        v-model="filterCriteria.lead_status"
        :options="leadStatusOptions"
        @change="filterCustomers"
        class="w-48"
      />
    </div>

    <!-- Customers Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Lead Status
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="customersStore.customers.length === 0">
            <td colspan="5" class="text-center py-4">No customers found.</td>
          </tr>
          <tr v-for="customer in customersStore.customers" :key="customer.id">
            <td class="px-6 py-4">
              {{ customer.first_name }} {{ customer.last_name }}
            </td>
            <td class="px-6 py-4">{{ customer.email }}</td>
            <td class="px-6 py-4">{{ customer.phone_number }}</td>
            <td class="px-6 py-4">{{ customer.lead_status }}</td>
            <td class="px-6 py-4 text-right">
              <button
                @click="openEditCustomerModal(customer)"
                class="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                Edit
              </button>
              <button
                @click="openInteractionsModal(customer)"
                class="text-green-600 hover:text-green-900 mr-2"
              >
                Interactions
              </button>
              <button
                @click="confirmDeleteCustomer(customer.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Customer Modal -->
    <Modal
      v-if="showCustomerModal"
      @close="closeCustomerModal"
      :title="isEditMode ? 'Edit Customer' : 'Add New Customer'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField
          id="first-name"
          label="First Name"
          v-model="customerForm.first_name"
          type="text"
          required
        />
        <FormField
          id="last-name"
          label="Last Name"
          v-model="customerForm.last_name"
          type="text"
          required
        />
        <FormField
          id="company-name"
          label="Company Name"
          v-model="customerForm.company_name"
          type="text"
        />
        <FormField
          id="email"
          label="Email"
          v-model="customerForm.email"
          type="email"
          required
        />
        <FormField
          id="phone-number"
          label="Phone Number"
          v-model="customerForm.phone_number"
          type="tel"
        />
        <FormField
          id="address"
          label="Address"
          v-model="customerForm.address"
          type="text"
        />
        <FormSelect
          id="lead-status"
          label="Lead Status"
          v-model="customerForm.lead_status"
          :options="leadStatusOptions"
          required
        />
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
          >
            {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- interactions Modal -->
    <Modal
      v-if="showInteractionsModal"
      @close="closeInteractionsModal"
      title="Customer Interactions"
    >
      <div v-if="selectedCustomer">
        <h3 class="text-lg font-semibold mb-4">
          {{ selectedCustomer.first_name }} {{ selectedCustomer.last_name }}
        </h3>
        <div class="space-y-4">
          <div
            v-for="interaction in selectedCustomer.interactions"
            :key="interaction.id"
            class="bg-gray-100 p-4 rounded-md"
          >
            <p class="font-semibold">{{ interaction.type }}</p>
            <p class="text-sm text-gray-600">
              {{ new Date(interaction.created_at).toLocaleString() }}
            </p>
            <p class="mt-2">{{ interaction.notes }}</p>
          </div>
        </div>
        <form @submit.prevent="addInteraction" class="mt-6 space-y-4">
          <FormSelect
            id="interaction-type"
            label="Interaction Type"
            v-model="interactionForm.type"
            :options="interactionTypes"
            required
          />
          <FormField
            id="interaction-notes"
            label="Notes"
            v-model="interactionForm.notes"
            type="textarea"
            required
          />
          <div class="flex justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Add Interaction
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import Modal from '@/components/Modal.vue'
import FormField from '@/components/FormField.vue'
import FormSelect from '@/components/FormSelect.vue'

const customersStore = useCustomersStore()
const showCustomerModal = ref(false)
const showInteractionsModal = ref(false)
const isEditMode = ref(false)
const customerForm = ref({
  id: 0,
  first_name: '',
  last_name: '',
  company_name: '',
  email: '',
  phone_number: '',
  address: '',
  lead_status: '',
})
const searchQuery = ref('')
const filterCriteria = ref({
  lead_status: '',
})
const selectedCustomer = ref(null)
const interactionForm = ref({
  type: '',
  notes: '',
})

const leadStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'converted', label: 'Converted' },
]

const interactionTypes = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
]

onMounted(async () => {
  await customersStore.fetchCustomers()
  await customersStore.fetchCustomerCounts()
})

const searchCustomers = async () => {
  if (searchQuery.value) {
    await customersStore.searchCustomers(searchQuery.value)
  } else {
    await customersStore.fetchCustomers()
  }
}

const filterCustomers = async () => {
  if (filterCriteria.value.lead_status) {
    await customersStore.filterCustomers(filterCriteria.value)
  } else {
    await customersStore.fetchCustomers()
  }
}

const openAddCustomerModal = () => {
  isEditMode.value = false
  customerForm.value = {
    id: 0,
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone_number: '',
    address: '',
    lead_status: 'new',
  }
  showCustomerModal.value = true
}

const openEditCustomerModal = (customer: any) => {
  isEditMode.value = true
  customerForm.value = { ...customer }
  showCustomerModal.value = true
}

const openInteractionsModal = (customer: any) => {
  selectedCustomer.value = customer
  showInteractionsModal.value = true
}

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await customersStore.updateCustomer(
        customerForm.value.id,
        customerForm.value,
      )
    } else {
      await customersStore.addCustomer(customerForm.value)
    }
    await customersStore.fetchCustomers()
    await customersStore.fetchCustomerCounts()
    closeCustomerModal()
  } catch (error) {
    console.error('Error while saving customer:', error)
  }
}

const addInteraction = async () => {
  try {
    await customersStore.addInteraction(
      selectedCustomer.value.id,
      interactionForm.value,
    )
    interactionForm.value = { type: '', notes: '' }
    const updatedCustomer = await customersStore.findOne(
      selectedCustomer.value.id,
    )
    selectedCustomer.value = updatedCustomer
  } catch (error) {
    console.error('Error while adding interaction:', error)
  }
}

const confirmDeleteCustomer = async (customerId: number) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    await customersStore.deleteCustomer(customerId)
    await customersStore.fetchCustomers()
    await customersStore.fetchCustomerCounts()
  }
}

const closeCustomerModal = () => {
  showCustomerModal.value = false
}

const closeInteractionsModal = () => {
  showInteractionsModal.value = false
  selectedCustomer.value = null
}
</script>
