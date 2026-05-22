<template>
  <div
    class="ui-check"
    :class="{ 'ui-check--card': card, 'ui-check--checked': modelValue }"
  >
    <el-checkbox
      class="ui-el-checkbox"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', Boolean($event))"
    />
    <span class="ui-check__body">
      <span class="ui-check__label">{{ label }}</span>
      <span v-if="description" class="ui-check__description">
        {{ description }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    label: string
    description?: string
    disabled?: boolean
    card?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
    card: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
