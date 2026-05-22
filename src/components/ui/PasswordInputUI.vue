<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <el-input
      class="ui-el-input"
      :model-value="modelValue"
      type="password"
      :placeholder="placeholder"
      :disabled="disabled"
      show-password
      clearable
      autocomplete="current-password"
      @update:model-value="emit('update:modelValue', String($event))"
    />
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    hint?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: 'Password',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
