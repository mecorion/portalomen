<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <span class="ui-input">
      <span v-if="prefix" class="ui-input__prefix">{{ prefix }}</span>
      <input
        :value="modelValue"
        class="ui-input__control"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emitValue(($event.target as HTMLInputElement).value)"
      />
      <span v-if="suffix" class="ui-input__suffix">{{ suffix }}</span>
    </span>
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: number | null
    label?: string
    hint?: string
    placeholder?: string
    prefix?: string
    suffix?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    step: 1,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

function emitValue(value: string) {
  emit('update:modelValue', value === '' ? null : Number(value))
}
</script>
