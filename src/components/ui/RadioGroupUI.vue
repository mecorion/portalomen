<template>
  <div
    class="ui-radio-group"
    :class="{ 'ui-radio-group--horizontal': horizontal }"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="ui-radio"
      :class="{ 'ui-radio--card': card, 'ui-radio--selected': option.value === modelValue }"
    >
      <input
        class="ui-radio__input"
        type="radio"
        :name="name"
        :value="option.value"
        :checked="option.value === modelValue"
        :disabled="option.disabled"
        @change="emit('update:modelValue', option.value)"
      />
      <span class="ui-radio__dot" />
      <span class="ui-radio__body">
        <span class="ui-radio__label">{{ option.label }}</span>
        <span v-if="option.description" class="ui-radio__description">
          {{ option.description }}
        </span>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
export type RadioUIOption = {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue: string
    options: RadioUIOption[]
    name?: string
    horizontal?: boolean
    card?: boolean
  }>(),
  {
    name: 'ui-radio-group',
    horizontal: false,
    card: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
