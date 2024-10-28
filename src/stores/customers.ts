import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const baseUrl = 'http://localhost:3000'

interface Customer {
  id: number
  first_name: string
  last_name: string
  company_name: string
  email: string
  phone_number: string
  address: string
  lead_status: string
  interactions?: CustomerInteraction[]
}

interface CustomerInteraction {
  id: number
  type: string
  notes: string
  created_at: Date
}

interface CustomerState {
  customers: Customer[]
  totalCustomers: number
  totalLeads: number
}

export const useCustomersStore = defineStore('customers', {
  state: (): CustomerState => ({
    customers: [],
    totalCustomers: 0,
    totalLeads: 0,
  }),
  actions: {
    async fetchCustomers() {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${baseUrl}/customers`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        this.customers = response.data
      } catch (error) {
        console.error('Failed to fetch customers:', error)
        throw error
      }
    },
    async addCustomer(customerData: Omit<Customer, 'id' | 'interactions'>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.post(
          `${baseUrl}/customers`,
          customerData,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          },
        )
        this.customers.push(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to add customer:', error)
        throw error
      }
    },
    async updateCustomer(customerId: number, customerData: Partial<Customer>) {
      try {
        const authStore = useAuthStore()

        const updateData = {
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          company_name: customerData.company_name,
          email: customerData.email,
          phone_number: customerData.phone_number,
          address: customerData.address,
          lead_status: customerData.lead_status,
        }

        const response = await axios.patch(
          `${baseUrl}/customers/${customerId}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          },
        )

        const index = this.customers.findIndex(
          customer => customer.id === customerId,
        )
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...response.data }
        }
        return response.data
      } catch (error) {
        console.error('Failed to update customer:', error)
        throw error
      }
    },
    async deleteCustomer(customerId: number) {
      try {
        const authStore = useAuthStore()
        await axios.delete(`${baseUrl}/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        this.customers = this.customers.filter(
          customer => customer.id !== customerId,
        )
      } catch (error) {
        console.error('Failed to delete customer:', error)
        throw error
      }
    },
    async searchCustomers(query: string) {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(
          `${baseUrl}/customers/search?query=${query}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          },
        )
        this.customers = response.data
      } catch (error) {
        console.error('Failed to search customers:', error)
        throw error
      }
    },
    async filterCustomers(criteria: Partial<Customer>) {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${baseUrl}/customers/filter`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
          params: criteria,
        })
        this.customers = response.data
      } catch (error) {
        console.error('Failed to filter customers:', error)
        throw error
      }
    },
    async addInteraction(
      customerId: number,
      interactionData: Omit<CustomerInteraction, 'id' | 'created_at'>,
    ) {
      try {
        const authStore = useAuthStore()
        const response = await axios.post(
          `${baseUrl}/customers/${customerId}/interactions`,
          interactionData,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          },
        )
        const customerIndex = this.customers.findIndex(c => c.id === customerId)
        if (customerIndex !== -1) {
          if (!this.customers[customerIndex].interactions) {
            this.customers[customerIndex].interactions = []
          }
          this.customers[customerIndex].interactions.push(response.data)
        }
        return response.data
      } catch (error) {
        console.error('Failed to add interaction:', error)
        throw error
      }
    },
    async fetchCustomerCounts() {
      try {
        const authStore = useAuthStore()
        const [totalResponse, leadsResponse] = await Promise.all([
          axios.get(`${baseUrl}/customers/count`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }),
          axios.get(`${baseUrl}/customers/count-leads`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }),
        ])
        this.totalCustomers = totalResponse.data
        this.totalLeads = leadsResponse.data
      } catch (error) {
        console.error('Failed to fetch customer counts:', error)
        throw error
      }
    },
    async findOne(customerId: number) {
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${baseUrl}/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        })
        return response.data
      } catch (error) {
        console.error('Failed to fetch customer:', error)
        throw error
      }
    },
  },
})
