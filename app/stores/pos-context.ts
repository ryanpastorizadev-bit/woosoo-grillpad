import type { PosReadinessResponse, PosReadinessState, TableRow, TableStatus } from '~/services/api/pos-context'
import { defineStore } from 'pinia'
import {
  derivePosReadiness,
  fetchPosReadiness,
  fetchPosTables,
  MOCK_POS_READINESS,
  MOCK_TABLES,
  normalizeTableStatus,
} from '~/services/api/pos-context'

interface PosContextState {
  readiness: PosReadinessResponse | null
  tables: TableRow[]
  loading: boolean
  lastError: string | null
  useMock: boolean
}

export const usePosContextStore = defineStore('pos-context', {
  state: (): PosContextState => ({
    readiness: null,
    tables: [],
    loading: false,
    lastError: null,
    useMock: false,
  }),

  getters: {
    posReadinessState(state): PosReadinessState {
      return derivePosReadiness(state.readiness)
    },

    isReady(): boolean {
      return this.posReadinessState === 'ready'
    },

    isBlocked(): boolean {
      return this.posReadinessState === 'blocked'
    },

    tableById(state) {
      return (id: string): TableRow | undefined =>
        state.tables.find(t => t.id === id)
    },

    normalizedStatusFor() {
      return (id: string): TableStatus => {
        const table = this.tableById(id)
        if (!table)
          return 'unknown'
        return normalizeTableStatus(table.normalizedStatus)
      }
    },
  },

  actions: {
    enableMock() {
      this.useMock = true
      this.readiness = MOCK_POS_READINESS
      this.tables = MOCK_TABLES.map(t => ({
        ...t,
        normalizedStatus: normalizeTableStatus(t.normalizedStatus),
      }))
      this.lastError = null
    },

    async refreshReadiness() {
      if (this.useMock)
        return
      this.loading = true
      this.lastError = null
      try {
        this.readiness = await fetchPosReadiness()
      }
      catch (error) {
        this.lastError = error instanceof Error ? error.message : 'Unable to load POS readiness.'
      }
      finally {
        this.loading = false
      }
    },

    async refreshTables() {
      if (this.useMock)
        return
      this.loading = true
      this.lastError = null
      try {
        const rows = await fetchPosTables()
        this.tables = rows.map(t => ({
          ...t,
          normalizedStatus: normalizeTableStatus(t.normalizedStatus),
        }))
      }
      catch (error) {
        this.lastError = error instanceof Error ? error.message : 'Unable to load table statuses.'
      }
      finally {
        this.loading = false
      }
    },

    async refresh() {
      await Promise.all([this.refreshReadiness(), this.refreshTables()])
    },

    /**
     * Called after an order is submitted. Updates the assigned table's
     * normalized status to `active` to reflect order-sent state and
     * then re-fetches table data from the backend.
     */
    async markTableOrderSent(tableId: string) {
      const index = this.tables.findIndex(t => t.id === tableId)
      if (index >= 0) {
        this.tables[index] = { ...this.tables[index]!, normalizedStatus: 'active' }
      }
      if (!this.useMock) {
        await this.refreshTables()
      }
    },

    clear() {
      this.readiness = null
      this.tables = []
      this.loading = false
      this.lastError = null
    },
  },
})
