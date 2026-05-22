<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <el-select
      class="ui-el-select"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', String($event))"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </el-select>
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
export type SelectUIOption = {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    hint?: string
    placeholder?: string
    options: SelectUIOption[]
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: 'Select',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
