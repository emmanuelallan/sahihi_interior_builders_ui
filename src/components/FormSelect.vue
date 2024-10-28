<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <select
      :id="id"
      :value="modelValue"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>Select an option</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  id: string
  label: string
  modelValue: string | number | null
  options: Array<{ value: string | number; label: string }>
}>()

defineEmits(['update:modelValue'])
</script>
