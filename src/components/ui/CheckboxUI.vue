<template>
  <label
    class="ui-check"
    :class="{ 'ui-check--card': card }"
  >
    <input
      class="ui-check__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="ui-check__box" />
    <span class="ui-check__body">
      <span class="ui-check__label">{{ label }}</span>
      <span v-if="description" class="ui-check__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    label: string
    description?: string
    disabled?: boolean
    card?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
    card: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
