<template>
  <div class="ui-filter-bar">
    <div v-if="$slots.default" class="ui-filter-bar__controls">
      <slot />
    </div>
    <div v-if="$slots.actions" class="ui-filter-bar__actions">
      <slot name="actions" />
    </div>
  </div>
</template>
