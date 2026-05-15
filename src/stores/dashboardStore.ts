import { defineStore } from 'pinia'

export type GroupType = 'day' | 'week' | 'month'

export type DashboardRow = {
  id: number
  date: string
  revenue: number
  profit: number
  orders: number
  averageCheck: number
  conversion: number
  category: string
  region: string
}

export type DashboardFilters = {
  category: string
  region: string
  period: [string, string] | null
  group: GroupType
  search: string
}

function parseDate(date: string): Date {
  const [day, month, year] = date.split('.').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU')
}

function getWeekKey(date: Date): string {
  const start = new Date(date)
  const day = start.getDay() || 7

  start.setDate(start.getDate() - day + 1)

  return `Неделя ${formatDate(start)}`
}

function getMonthKey(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  })
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    filters: {
      category: 'all',
      region: 'all',
      period: ['2024-05-01', '2024-05-31'],
      group: 'day',
      search: ''
    } as DashboardFilters,

    activeMetrics: ['revenue', 'profit', 'orders'] as ChartMetric[],

    rows: [
      {
        id: 1,
        date: '01.05.2024',
        revenue: 850000,
        profit: 230000,
        orders: 320,
        averageCheck: 2656,
        conversion: 2.35,
        category: 'Электроника',
        region: 'Алматы'
      },
      {
        id: 2,
        date: '02.05.2024',
        revenue: 720500,
        profit: 210300,
        orders: 280,
        averageCheck: 2573,
        conversion: 2.15,
        category: 'Бытовая техника',
        region: 'Алматы'
      },
      {
        id: 3,
        date: '03.05.2024',
        revenue: 910200,
        profit: 260450,
        orders: 340,
        averageCheck: 2677,
        conversion: 2.48,
        category: 'Электроника',
        region: 'Алматы'
      },
      {
        id: 4,
        date: '04.05.2024',
        revenue: 650300,
        profit: 180200,
        orders: 210,
        averageCheck: 2620,
        conversion: 1.95,
        category: 'Дом и сад',
        region: 'Алматы'
      },
      {
        id: 5,
        date: '05.05.2024',
        revenue: 1020400,
        profit: 310500,
        orders: 380,
        averageCheck: 2685,
        conversion: 2.65,
        category: 'Электроника',
        region: 'Алматы'
      },
      {
        id: 6,
        date: '06.05.2024',
        revenue: 780600,
        profit: 220100,
        orders: 300,
        averageCheck: 2602,
        conversion: 2.25,
        category: 'Бытовая техника',
        region: 'Алматы'
      },
      {
        id: 7,
        date: '07.05.2024',
        revenue: 890700,
        profit: 240800,
        orders: 330,
        averageCheck: 2699,
        conversion: 2.3,
        category: 'Электроника',
        region: 'Астана'
      },
      {
        id: 8,
        date: '08.05.2024',
        revenue: 670400,
        profit: 190700,
        orders: 250,
        averageCheck: 2682,
        conversion: 1.88,
        category: 'Дом и сад',
        region: 'Астана'
      },
      {
        id: 9,
        date: '09.05.2024',
        revenue: 940300,
        profit: 270600,
        orders: 360,
        averageCheck: 2612,
        conversion: 2.52,
        category: 'Электроника',
        region: 'Астана'
      },
      {
        id: 10,
        date: '10.05.2024',
        revenue: 710000,
        profit: 200000,
        orders: 270,
        averageCheck: 2632,
        conversion: 2.1,
        category: 'Бытовая техника',
        region: 'Астана'
      },
      {
        id: 11,
        date: '11.05.2024',
        revenue: 870600,
        profit: 250300,
        orders: 310,
        averageCheck: 2808,
        conversion: 2.4,
        category: 'Электроника',
        region: 'Астана'
      },
      {
        id: 12,
        date: '12.05.2024',
        revenue: 760200,
        profit: 210200,
        orders: 260,
        averageCheck: 2847,
        conversion: 2.18,
        category: 'Дом и сад',
        region: 'Астана'
      },
      {
        id: 13,
        date: '13.05.2024',
        revenue: 980500,
        profit: 280900,
        orders: 370,
        averageCheck: 2651,
        conversion: 2.58,
        category: 'Электроника',
        region: 'Астана'
      },
      {
        id: 14,
        date: '14.05.2024',
        revenue: 820400,
        profit: 230100,
        orders: 300,
        averageCheck: 2734,
        conversion: 2.2,
        category: 'Бытовая техника',
        region: 'Астана'
      },
      {
        id: 15,
        date: '15.05.2024',
        revenue: 600400,
        profit: 195000,
        orders: 240,
        averageCheck: 2688,
        conversion: 1.97,
        category: 'Дом и сад',
        region: 'Астана'
      }
    ] as DashboardRow[]
  }),

  getters: {
    totalRevenue(): number {
      return this.groupedRows.reduce(
        (sum, row) => sum + row.revenue,
        0
      )
    },

    totalProfit(): number {
      return this.groupedRows.reduce(
        (sum, row) => sum + row.profit,
        0
      )
    },

    totalOrders(): number {
      return this.groupedRows.reduce(
        (sum, row) => sum + row.orders,
        0
      )
    },

    averageConversion(): number {
      if (!this.groupedRows.length) {
        return 0
      }

      const total = this.groupedRows.reduce(
        (sum, row) => sum + row.conversion,
        0
      )

      return Number(
        (total / this.groupedRows.length).toFixed(2)
      )
    },

    filteredRows(state): DashboardRow[] {
      return state.rows.filter((row) => {
        const rowDate = parseDate(row.date)

        const categoryMatch =
          state.filters.category === 'all' ||
          row.category === state.filters.category

        const regionMatch =
          state.filters.region === 'all' ||
          row.region === state.filters.region

        const search = state.filters.search.trim().toLowerCase()

        const searchMatch =
          !search ||
          row.date.toLowerCase().includes(search) ||
          row.category.toLowerCase().includes(search) ||
          row.region.toLowerCase().includes(search)

        let periodMatch = true

        if (state.filters.period) {
          const [from, to] = state.filters.period

          const fromDate = new Date(from)
          const toDate = new Date(to)

          fromDate.setHours(0, 0, 0, 0)
          toDate.setHours(23, 59, 59, 999)

          periodMatch = rowDate >= fromDate && rowDate <= toDate
        }

        return categoryMatch && regionMatch && periodMatch && searchMatch
      })
    },

    groupedRows(): DashboardRow[] {
      if (this.filters.group === 'day') {
        return this.filteredRows
      }

      const map = new Map<string, DashboardRow>()

      this.filteredRows.forEach((row) => {
        const date = parseDate(row.date)

        const key =
          this.filters.group === 'week'
            ? getWeekKey(date)
            : getMonthKey(date)

        const existing = map.get(key)

        if (!existing) {
          map.set(key, {
            ...row,
            id: Date.now() + map.size,
            date: key
          })

          return
        }

        existing.revenue += row.revenue
        existing.profit += row.profit
        existing.orders += row.orders

        existing.averageCheck = Math.round(existing.revenue / existing.orders)

        existing.conversion = Number(
          ((existing.conversion + row.conversion) / 2).toFixed(2)
        )
      })

      return Array.from(map.values())
    },

    chartLabels(): string[] {
      return this.groupedRows.map((row) => {
        if (this.filters.group === 'day') {
          return row.date.slice(0, 5)
        }

        return row.date
      })
    },

    revenueData(): number[] {
      return this.groupedRows.map((row) => row.revenue)
    },

    profitData(): number[] {
      return this.groupedRows.map((row) => row.profit)
    },

    ordersData(): number[] {
      return this.groupedRows.map((row) => row.orders)
    }
  },

  actions: {

    setActiveMetrics(metrics: ChartMetric[]) {
      this.activeMetrics = metrics
    },

    setFilters(payload: Partial<DashboardFilters>) {
      this.filters = {
        ...this.filters,
        ...payload
      }
    },

    updateRow(id: number, payload: Partial<DashboardRow>) {
      const row = this.rows.find((item) => item.id === id)

      if (!row) {
        return
      }

      Object.assign(row, payload)
    },

    addRow() {
      const lastRow = this.rows[this.rows.length - 1]

      this.rows.push({
        id: Date.now(),
        date: lastRow?.date ?? '01.05.2024',
        revenue: 0,
        profit: 0,
        orders: 0,
        averageCheck: 0,
        conversion: 0,
        category: 'Электроника',
        region: 'Алматы'
      })
    },

    deleteRow(id: number) {
      this.rows = this.rows.filter((row) => row.id !== id)
    }
  }
})