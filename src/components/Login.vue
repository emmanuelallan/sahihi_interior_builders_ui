<template>
  <div class="container max-w-7xl mx-auto py-10 px-6">
    <div
      class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          class="mx-auto h-10 w-auto"
          src="@/assets/logo.svg"
          alt="Sahihi Interior Builders"
        />
        <h2
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Email address</label
            >
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="you@sahihi.com"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Password</label
              >
              <div class="text-sm">
                <RouterLink
                  to="/forgot-password"
                  class="font-semibold text-emerald-600 hover:text-emerald-500"
                  >Forgot password?</RouterLink
                >
              </div>
            </div>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <!-- Error message -->
        <p v-if="error" class="mt-4 text-center text-sm text-red-500">
          {{ error }}
        </p>

        <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <RouterLink
            to="/register"
            class="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
            >Contact Administrator</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const error = ref('')

    const login = async () => {
      try {
        await authStore.login(email.value, password.value)
      } catch {
        error.value = 'Invalid email or password'
      }
    }

    return { email, password, login, error }
  },
}
</script>
