<template>
  <AppShellLayout title="Документация" content-class="docs-page">
    <div class="docs-layout">
      <aside class="docs-nav ui-card">
        <button
          v-for="section in portalomenDocs"
          :key="section.id"
          class="docs-nav__item"
          :class="{ 'docs-nav__item--active': activeSectionId === section.id }"
          type="button"
          @click="activeSectionId = section.id"
        >
          {{ section.title }}
        </button>
      </aside>

      <section class="docs-content ui-card">
        <header class="docs-content__header">
          <h2>{{ activeSection.title }}</h2>
          <p>{{ activeSection.description }}</p>
        </header>

        <div class="docs-content__blocks">
          <article
            v-for="(block, index) in activeSection.blocks"
            :key="`${activeSection.id}-${index}`"
            class="docs-block"
          >
            <template v-if="block.type === 'text'">
              <h3 v-if="block.title">{{ block.title }}</h3>
              <p v-for="paragraph in block.body" :key="paragraph">{{ paragraph }}</p>
            </template>

            <template v-else-if="block.type === 'list'">
              <h3>{{ block.title }}</h3>
              <ul>
                <li v-for="item in block.items" :key="item">{{ item }}</li>
              </ul>
            </template>

            <template v-else-if="block.type === 'code'">
              <h3>{{ block.title }}</h3>
              <pre><code>{{ block.code }}</code></pre>
            </template>
          </article>
        </div>
      </section>
    </div>
  </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'
import { portalomenDocs } from '../../docs/portalomenDocs'

const activeSectionId = ref(portalomenDocs[0]?.id ?? '')

const activeSection = computed(() => {
  return portalomenDocs.find((section) => section.id === activeSectionId.value) ?? portalomenDocs[0]
})
</script>
