import { defineStore } from 'pinia'

export type DashboardRow = {
  id: number
  date: string
  revenue: number
  profit: number
  orders: number
  averageCheck: number
  conversion: number
  category: string
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    rows: [
      {
        id: 1,
        date: '01.05.2024',
        revenue: 850000,
        profit: 230000,
        orders: 320,
        averageCheck: 2656,
        conversion: 2.35,
        category: 'Электроника'
      },
      {
        id: 2,
        date: '02.05.2024',
        revenue: 720500,
        profit: 210300,
        orders: 280,
        averageCheck: 2573,
        conversion: 2.15,
        category: 'Бытовая техника'
      },
      {
        id: 3,
        date: '03.05.2024',
        revenue: 910200,
        profit: 260450,
        orders: 340,
        averageCheck: 2677,
        conversion: 2.48,
        category: 'Электроника'
      },
      {
        id: 4,
        date: '04.05.2024',
        revenue: 650300,
        profit: 180200,
        orders: 210,
        averageCheck: 2620,
        conversion: 1.95,
        category: 'Дом и сад'
      },
      {
        id: 5,
        date: '05.05.2024',
        revenue: 1020400,
        profit: 310500,
        orders: 380,
        averageCheck: 2685,
        conversion: 2.65,
        category: 'Электроника'
      },
      {
        id: 6,
        date: '06.05.2024',
        revenue: 780600,
        profit: 220100,
        orders: 300,
        averageCheck: 2602,
        conversion: 2.25,
        category: 'Бытовая техника'
      },
      {
        id: 7,
        date: '07.05.2024',
        revenue: 890700,
        profit: 240800,
        orders: 330,
        averageCheck: 2699,
        conversion: 2.3,
        category: 'Электроника'
      },
      {
        id: 8,
        date: '08.05.2024',
        revenue: 670400,
        profit: 190700,
        orders: 250,
        averageCheck: 2682,
        conversion: 1.88,
        category: 'Дом и сад'
      },
      {
        id: 9,
        date: '09.05.2024',
        revenue: 940300,
        profit: 270600,
        orders: 360,
        averageCheck: 2612,
        conversion: 2.52,
        category: 'Электроника'
      },
      {
        id: 10,
        date: '10.05.2024',
        revenue: 710000,
        profit: 200000,
        orders: 270,
        averageCheck: 2632,
        conversion: 2.1,
        category: 'Бытовая техника'
      },
      {
        id: 11,
        date: '11.05.2024',
        revenue: 870600,
        profit: 250300,
        orders: 310,
        averageCheck: 2808,
        conversion: 2.4,
        category: 'Электроника'
      },
      {
        id: 12,
        date: '12.05.2024',
        revenue: 760200,
        profit: 210200,
        orders: 260,
        averageCheck: 2847,
        conversion: 2.18,
        category: 'Дом и сад'
      },
      {
        id: 13,
        date: '13.05.2024',
        revenue: 980500,
        profit: 280900,
        orders: 370,
        averageCheck: 2651,
        conversion: 2.58,
        category: 'Электроника'
      },
      {
        id: 14,
        date: '14.05.2024',
        revenue: 820400,
        profit: 230100,
        orders: 300,
        averageCheck: 2734,
        conversion: 2.2,
        category: 'Бытовая техника'
      },
      {
        id: 15,
        date: '15.05.2024',
        revenue: 600400,
        profit: 195000,
        orders: 240,
        averageCheck: 2688,
        conversion: 1.97,
        category: 'Дом и сад'
      }
    ] as DashboardRow[]
  }),

  getters: {
    chartLabels: (state) => {
      return state.rows.map((row) => row.date.slice(0, 5))
    },

    revenueData: (state) => {
      return state.rows.map((row) => row.revenue)
    },

    profitData: (state) => {
      return state.rows.map((row) => row.profit)
    },

    ordersData: (state) => {
      return state.rows.map((row) => row.orders)
    }
  },

  actions: {
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
        category: 'Электроника'
      })
    },

    deleteRow(id: number) {
      this.rows = this.rows.filter((row) => row.id !== id)
    }
  }
})