<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <el-input
      class="ui-el-input"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
      @update:model-value="emit('update:modelValue', String($event))"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
    </el-input>
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    hint?: string
    type?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
