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

      <SectionUI title="Filters and typed fields">
        <div class="ui-showcase__stack">
          <FilterBarUI>
            <SearchInputUI
              v-model="filterSearch"
              label="Search"
              placeholder="Search by user, order, ticket"
            />

            <SelectUI
              v-model="filterStatus"
              label="Status"
              :options="statusOptions"
            />

            <NumberInputUI
              v-model="minRevenue"
              label="Min revenue"
              prefix="$"
              :step="1000"
            />

            <DateRangeUI
              v-model="dateRange"
              label="Period"
            />

            <template #actions>
              <ButtonUI variant="ghost">Reset</ButtonUI>
              <ButtonUI variant="primary">Apply</ButtonUI>
            </template>
          </FilterBarUI>

          <div class="ui-showcase__grid">
            <InputUI
              v-model="email"
              type="email"
              label="Email"
              placeholder="user@company.com"
              hint="Native email field"
            />

            <PasswordInputUI
              v-model="password"
              label="Password"
              placeholder="Enter password"
              hint="Toggleable password field"
            />

            <NumberInputUI
              v-model="quantity"
              label="Quantity"
              suffix="items"
              :min="0"
            />

            <InputUI
              v-model="phone"
              type="tel"
              label="Phone"
              placeholder="+1 555 000 0000"
            />
          </div>

          <div class="ui-showcase__row">
            <FilterChipUI label="Status" value="Active" />
            <FilterChipUI label="Region" value="Europe" />
            <FilterChipUI label="Revenue" value=">= $25k" />
            <FilterChipUI label="Period" value="May 2026" />
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
import DateRangeUI from '../../components/ui/DateRangeUI.vue'
import DropdownUI, { type DropdownUIItem } from '../../components/ui/DropdownUI.vue'
import FilterBarUI from '../../components/ui/FilterBarUI.vue'
import FilterChipUI from '../../components/ui/FilterChipUI.vue'
import InputUI from '../../components/ui/InputUI.vue'
import ModalUI from '../../components/ui/ModalUI.vue'
import NumberInputUI from '../../components/ui/NumberInputUI.vue'
import PaginationUI from '../../components/ui/PaginationUI.vue'
import PasswordInputUI from '../../components/ui/PasswordInputUI.vue'
import ProgressUI from '../../components/ui/ProgressUI.vue'
import RadioGroupUI, { type RadioUIOption } from '../../components/ui/RadioGroupUI.vue'
import SearchInputUI from '../../components/ui/SearchInputUI.vue'
import SectionUI from '../../components/ui/SectionUI.vue'
import SelectUI, { type SelectUIOption } from '../../components/ui/SelectUI.vue'
import SkeletonUI from '../../components/ui/SkeletonUI.vue'
import TabsUI, { type TabsUIItem } from '../../components/ui/TabsUI.vue'
import TextareaUI from '../../components/ui/TextareaUI.vue'
import TooltipUI from '../../components/ui/TooltipUI.vue'
import TypographyUI from '../../components/ui/TypographyUI.vue'

const search = ref('')
const note = ref('')
const filterSearch = ref('enterprise')
const filterStatus = ref('active')
const minRevenue = ref<number | null>(25000)
const dateRange = ref<[string, string]>(['2026-05-01', '2026-05-22'])
const email = ref('admin@portalomen.dev')
const password = ref('portalomen')
const quantity = ref<number | null>(12)
const phone = ref('')
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

const statusOptions: SelectUIOption[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Blocked', value: 'blocked' }
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
