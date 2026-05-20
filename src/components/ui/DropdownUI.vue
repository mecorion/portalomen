<template>
  <div class="ui-dropdown" @keydown.esc="close">
    <div class="ui-dropdown__trigger" @click="toggle">
      <slot name="trigger" :open="open" />
    </div>

    <div
      v-if="open"
      class="ui-dropdown__menu"
      :class="[`ui-dropdown__menu--${align}`]"
    >
      <template v-for="item in items" :key="item.value">
        <div v-if="item.divider" class="ui-dropdown__divider" />
        <div v-else-if="item.header" class="ui-dropdown__header">
          {{ item.label }}
        </div>
        <button
          v-else
          class="ui-dropdown__item"
          :class="{ 'ui-dropdown__item--danger': item.danger }"
          type="button"
          :disabled="item.disabled"
          @click="select(item)"
        >
          <span v-if="item.icon" class="ui-dropdown__item-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type DropdownUIItem = {
  label?: string
  value: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  header?: boolean
}

withDefaults(
  defineProps<{
    items: DropdownUIItem[]
    align?: 'left' | 'right'
  }>(),
  {
    align: 'left'
  }
)

const emit = defineEmits<{
  select: [item: DropdownUIItem]
}>()

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function select(item: DropdownUIItem) {
  if (item.disabled) {
    return
  }

  emit('select', item)
  close()
}
</script>
