<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      {
        'ui-button--block': block,
        'ui-button--icon-only': iconOnly
      }
    ]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ui-button__loader" />
    <span v-if="$slots.icon && !loading" class="ui-button__icon">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" class="ui-button__label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    iconOnly?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    block: false,
    iconOnly: false,
    disabled: false,
    loading: false
  }
)
</script>
