<template>
  <div
    v-if="visible"
    class="ui-alert"
    :class="[`ui-alert--${variant}`, { 'ui-alert--minimal': minimal }]"
    role="status"
  >
    <div v-if="$slots.icon || icon" class="ui-alert__icon">
      <slot name="icon">{{ icon }}</slot>
    </div>

    <div class="ui-alert__content">
      <div v-if="title" class="ui-alert__title">{{ title }}</div>
      <div v-if="$slots.default || description" class="ui-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>

    <button
      v-if="closable"
      class="ui-alert__close"
      type="button"
      aria-label="Close alert"
      @click="close"
    >
      x
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    description?: string
    icon?: string
    variant?: 'info' | 'success' | 'warning' | 'danger'
    minimal?: boolean
    closable?: boolean
  }>(),
  {
    modelValue: true,
    variant: 'info',
    minimal: false,
    closable: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
  }
)

function close() {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}
</script>
