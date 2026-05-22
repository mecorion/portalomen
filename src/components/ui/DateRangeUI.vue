<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <el-date-picker
      class="ui-date-range"
      :model-value="modelValue"
      type="daterange"
      value-format="YYYY-MM-DD"
      range-separator="to"
      start-placeholder="Start date"
      end-placeholder="End date"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', normalizeValue($event))"
    />
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: [string, string]
    label?: string
    hint?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => ['', ''],
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: [string, string]]
}>()

function normalizeValue(value: unknown): [string, string] {
  if (!Array.isArray(value)) {
    return ['', '']
  }

  return [String(value[0] ?? ''), String(value[1] ?? '')]
}
</script>
