<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <el-input
      class="ui-el-input ui-el-textarea"
      :model-value="modelValue"
      type="textarea"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
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
    rows?: number
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    rows: 4,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
