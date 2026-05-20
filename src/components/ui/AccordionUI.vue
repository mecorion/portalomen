<template>
  <div
    class="ui-accordion"
    :class="[`ui-accordion--${variant}`]"
  >
    <div
      v-for="item in items"
      :key="item.value"
      class="ui-accordion__item"
    >
      <button
        class="ui-accordion__trigger"
        type="button"
        :aria-expanded="isOpen(item.value)"
        @click="toggle(item.value)"
      >
        <span>{{ item.title }}</span>
        <span class="ui-accordion__chevron">⌄</span>
      </button>

      <div
        v-show="isOpen(item.value)"
        class="ui-accordion__content"
      >
        <slot :name="item.value" :item="item">
          {{ item.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type AccordionUIItem = {
  title: string
  value: string
  content?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items: AccordionUIItem[]
    multiple?: boolean
    variant?: 'default' | 'flush' | 'separated'
  }>(),
  {
    modelValue: '',
    multiple: false,
    variant: 'default'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const openValues = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }

  return props.modelValue ? [props.modelValue] : []
})

function isOpen(value: string) {
  return openValues.value.includes(value)
}

function toggle(value: string) {
  if (!props.multiple) {
    emit('update:modelValue', isOpen(value) ? '' : value)
    return
  }

  emit(
    'update:modelValue',
    isOpen(value)
      ? openValues.value.filter((item) => item !== value)
      : [...openValues.value, value]
  )
}
</script>
