<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Close</span>✕
        </button>
      </div>
      <div class="mt-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  },
})
</script>
