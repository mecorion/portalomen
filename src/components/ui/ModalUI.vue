<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="ui-modal__backdrop"
      @click="close"
    />

    <div
      v-if="modelValue"
      class="ui-modal"
      :class="[`ui-modal--${size}`]"
      role="dialog"
      aria-modal="true"
      @keydown.esc="close"
    >
      <div class="ui-modal__content">
        <header v-if="title || $slots.header" class="ui-modal__header">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>

          <button
            class="ui-modal__close"
            type="button"
            aria-label="Close modal"
            @click="close"
          >
            x
          </button>
        </header>

        <div class="ui-modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="ui-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'md'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>
