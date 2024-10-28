<template>
  <div v-if="hasAccess">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  props: {
    roles: {
      type: Array as () => string[],
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore()
    const hasAccess = computed(() => props.roles.includes(authStore.userRole))
    return { hasAccess }
  },
})
</script>
