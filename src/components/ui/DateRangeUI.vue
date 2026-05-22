<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <span class="ui-date-range">
      <input
        :value="modelValue?.[0] ?? ''"
        class="ui-input__control"
        type="date"
        :disabled="disabled"
        @input="update(0, ($event.target as HTMLInputElement).value)"
      />
      <span class="ui-date-range__divider">to</span>
      <input
        :value="modelValue?.[1] ?? ''"
        class="ui-input__control"
        type="date"
        :disabled="disabled"
        @input="update(1, ($event.target as HTMLInputElement).value)"
      />
    </span>
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(
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

function update(index: 0 | 1, value: string) {
  const next: [string, string] = [...props.modelValue]
  next[index] = value
  emit('update:modelValue', next)
}
</script>
