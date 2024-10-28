<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <template v-if="type === 'textarea'">
      <textarea
        :id="id"
        :value="modelValue"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        @input="$emit('update:modelValue', $event.target.value)"
        rows="3"
      ></textarea>
    </template>
    <template v-else>
      <input
        :type="type"
        :id="id"
        :value="modelValue"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  label: string
  modelValue: string | number | Date
  type: string
}>()

defineEmits(['update:modelValue'])
</script>
