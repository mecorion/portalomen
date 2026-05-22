<template>
  <el-radio-group
    class="ui-radio-group"
    :class="{ 'ui-radio-group--horizontal': horizontal }"
    :model-value="modelValue"
    :name="name"
    @update:model-value="emit('update:modelValue', String($event))"
  >
    <el-radio
      v-for="option in options"
      :key="option.value"
      class="ui-radio"
      :class="{ 'ui-radio--card': card, 'ui-radio--selected': option.value === modelValue }"
      :value="option.value"
      :disabled="option.disabled"
    >
      <span class="ui-radio__body">
        <span class="ui-radio__label">{{ option.label }}</span>
        <span v-if="option.description" class="ui-radio__description">
          {{ option.description }}
        </span>
      </span>
    </el-radio>
  </el-radio-group>
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
