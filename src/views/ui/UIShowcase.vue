<template>
  <div class="ui-showcase">
    <header class="ui-showcase__header">
      <div>
        <p class="ui-showcase__eyebrow">Portalomen UI Kit</p>
        <h1>Design System Showcase</h1>
      </div>

      <div class="ui-showcase__header-actions">
        <ButtonUI variant="ghost" @click="goDashboard">Dashboard</ButtonUI>
        <ButtonUI variant="primary">Create View</ButtonUI>
      </div>
    </header>

    <main class="ui-showcase__content">
      <SectionUI title="Buttons">
        <div class="ui-showcase__row">
          <ButtonUI variant="primary">Primary</ButtonUI>
          <ButtonUI variant="secondary">Secondary</ButtonUI>
          <ButtonUI variant="ghost">Ghost</ButtonUI>
          <ButtonUI variant="soft">Soft</ButtonUI>
          <ButtonUI variant="success">Success</ButtonUI>
          <ButtonUI variant="warning">Warning</ButtonUI>
          <ButtonUI variant="info">Info</ButtonUI>
          <ButtonUI variant="danger">Danger</ButtonUI>
          <ButtonUI loading>Loading</ButtonUI>
        </div>
      </SectionUI>

      <SectionUI title="Typography">
        <div class="ui-showcase__stack">
          <TypographyUI as="h1" variant="h1">Operational interface heading</TypographyUI>
          <TypographyUI as="h2" variant="h2">Reusable dashboard section</TypographyUI>
          <TypographyUI>
            Compact, predictable text styles for dashboards, CRMs, admin panels,
            trading terminals and analytics workspaces.
          </TypographyUI>
          <TypographyUI variant="code">useDashboardStore()</TypographyUI>
        </div>
      </SectionUI>

      <SectionUI title="Form controls">
        <div class="ui-showcase__grid">
          <InputUI
            v-model="search"
            label="Search"
            placeholder="Find customers, orders, documents"
            hint="Reusable text input"
          />

          <SelectUI
            v-model="workspace"
            label="Workspace"
            :options="workspaceOptions"
            hint="Native select wrapper"
          />

          <TextareaUI
            v-model="note"
            label="Internal note"
            placeholder="Add operator context"
            hint="Textarea primitive"
          />

          <div class="ui-showcase__panel">
            <CheckboxUI
              v-model="syncEnabled"
              label="Sync workspace state"
              description="Persists filters, layout and active widgets."
              card
            />

            <RadioGroupUI
              v-model="density"
              :options="densityOptions"
              horizontal
            />
          </div>
        </div>
      </SectionUI>

      <SectionUI title="Status and navigation">
        <div class="ui-showcase__stack">
          <div class="ui-showcase__row">
            <BadgeUI>Draft</BadgeUI>
            <BadgeUI variant="success">Active</BadgeUI>
            <BadgeUI variant="warning">Review</BadgeUI>
            <BadgeUI variant="danger">Blocked</BadgeUI>
            <BadgeUI variant="info">Synced</BadgeUI>
          </div>

          <TabsUI v-model="activeTab" :tabs="tabs" />
          <TabsUI v-model="activeTab" :tabs="tabs" variant="underline" />
          <PaginationUI v-model="page" :total="8" />
        </div>
      </SectionUI>

      <SectionUI title="Feedback and overlays">
        <div class="ui-showcase__stack">
          <div class="ui-showcase__grid">
            <AlertUI
              title="Deployment completed"
              description="The analytics workspace is ready for review."
              icon="i"
              variant="success"
            />

            <AlertUI
              title="Storage pressure"
              description="Two projects are above the recommended limit."
              icon="!"
              variant="warning"
              minimal
            />
          </div>

          <div class="ui-showcase__row">
            <DropdownUI :items="dropdownItems" align="right">
              <template #trigger>
                <ButtonUI variant="secondary">Actions</ButtonUI>
              </template>
            </DropdownUI>

            <TooltipUI text="Tooltips stay lightweight and composable" dark>
              <ButtonUI variant="ghost">Hover for tooltip</ButtonUI>
            </TooltipUI>

            <ButtonUI variant="primary" @click="modalOpen = true">Open modal</ButtonUI>
          </div>
        </div>
      </SectionUI>

      <SectionUI title="Disclosure">
        <AccordionUI
          v-model="openAccordion"
          :items="accordionItems"
          variant="separated"
        />
      </SectionUI>

      <SectionUI title="Progress, loading and identity">
        <div class="ui-showcase__dense-grid">
          <div class="ui-showcase__panel">
            <ProgressUI label="Quarter target" :value="72" show-value />
            <ProgressUI :value="48" variant="success" striped animated />
            <ProgressUI indeterminate variant="info" />
          </div>

          <div class="ui-showcase__skeleton-lines">
            <SkeletonUI variant="heading" shimmer />
            <SkeletonUI shimmer />
            <SkeletonUI width="84%" shimmer />
            <SkeletonUI variant="button" shimmer />
          </div>

          <div class="ui-showcase__row">
            <AvatarUI name="Alex Demo" status="online" ring />
            <AvatarUI name="Maria Smith" size="lg" status="away" />
            <AvatarUI name="Trading Bot" rounded status="busy" />
          </div>
        </div>
      </SectionUI>

      <div class="ui-showcase__split">
        <CardUI>
          <h2>Reusable Composition</h2>
          <p>
            UI components stay presentation-only. Feature modules provide data,
            behavior, API calls and persistence.
          </p>
        </CardUI>

        <CardUI flat>
          <h2>Layout Foundation</h2>
          <p>
            The same primitives can power CRM, mail, storage, analytics,
            admin tools and trading screens.
          </p>
        </CardUI>
      </div>
    </main>

    <ModalUI v-model="modalOpen" title="Reusable modal">
      Modal content is slot-based, so feature modules can bring forms, tables or
      confirmations without coupling the UI layer to business logic.

      <template #footer>
        <ButtonUI variant="ghost" @click="modalOpen = false">Cancel</ButtonUI>
        <ButtonUI variant="primary" @click="modalOpen = false">Apply</ButtonUI>
      </template>
    </ModalUI>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AccordionUI, { type AccordionUIItem } from '../../components/ui/AccordionUI.vue'
import AlertUI from '../../components/ui/AlertUI.vue'
import AvatarUI from '../../components/ui/AvatarUI.vue'
import BadgeUI from '../../components/ui/BadgeUI.vue'
import ButtonUI from '../../components/ui/ButtonUI.vue'
import CardUI from '../../components/ui/CardUI.vue'
import CheckboxUI from '../../components/ui/CheckboxUI.vue'
import DropdownUI, { type DropdownUIItem } from '../../components/ui/DropdownUI.vue'
import InputUI from '../../components/ui/InputUI.vue'
import ModalUI from '../../components/ui/ModalUI.vue'
import PaginationUI from '../../components/ui/PaginationUI.vue'
import ProgressUI from '../../components/ui/ProgressUI.vue'
import RadioGroupUI, { type RadioUIOption } from '../../components/ui/RadioGroupUI.vue'
import SectionUI from '../../components/ui/SectionUI.vue'
import SelectUI, { type SelectUIOption } from '../../components/ui/SelectUI.vue'
import SkeletonUI from '../../components/ui/SkeletonUI.vue'
import TabsUI, { type TabsUIItem } from '../../components/ui/TabsUI.vue'
import TextareaUI from '../../components/ui/TextareaUI.vue'
import TooltipUI from '../../components/ui/TooltipUI.vue'
import TypographyUI from '../../components/ui/TypographyUI.vue'

const search = ref('')
const note = ref('')
const workspace = ref('dashboard')
const activeTab = ref('overview')
const syncEnabled = ref(true)
const density = ref('comfortable')
const page = ref(3)
const modalOpen = ref(false)
const openAccordion = ref('architecture')

const workspaceOptions: SelectUIOption[] = [
  { label: 'Enterprise dashboard', value: 'dashboard' },
  { label: 'CRM workspace', value: 'crm' },
  { label: 'Analytics suite', value: 'analytics' }
]

const tabs: TabsUIItem[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Components', value: 'components' },
  { label: 'Layouts', value: 'layouts' }
]

const densityOptions: RadioUIOption[] = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' }
]

const dropdownItems: DropdownUIItem[] = [
  { value: 'group-main', label: 'Workspace', header: true },
  { value: 'duplicate', label: 'Duplicate view', icon: '+' },
  { value: 'export', label: 'Export CSV', icon: '↓' },
  { value: 'divider-1', divider: true },
  { value: 'delete', label: 'Delete view', icon: 'x', danger: true }
]

const accordionItems: AccordionUIItem[] = [
  {
    title: 'UI Kit responsibility',
    value: 'architecture',
    content: 'Presentation-only primitives: no dashboard store, API contracts or domain rules.'
  },
  {
    title: 'Reusable layout direction',
    value: 'layouts',
    content: 'The same controls can support CRM, mail, storage, analytics and admin surfaces.'
  },
  {
    title: 'Theme strategy',
    value: 'theme',
    content: 'Portalomen tokens define color, radius, typography and interaction states.'
  }
]

function goDashboard() {
  window.location.hash = '/'
}
</script>
