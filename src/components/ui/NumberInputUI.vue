<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <div class="ui-number-field">
      <span v-if="prefix" class="ui-number-field__addon">{{ prefix }}</span>
      <el-input-number
        class="ui-el-number"
        :model-value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        controls-position="right"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <span v-if="suffix" class="ui-number-field__addon">{{ suffix }}</span>
    </div>
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
</script>
