import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { derivePosReadiness, normalizeTableStatus } from '~/services/api/pos-context'
import { usePosContextStore } from '~/stores/pos-context'

const mocks = vi.hoisted(() => ({
  fetchPosReadiness: vi.fn(),
  fetchPosTables: vi.fn(),
}))

vi.mock('~/services/api/pos-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/services/api/pos-context')>()
  return {
    ...actual,
    fetchPosReadiness: mocks.fetchPosReadiness,
    fetchPosTables: mocks.fetchPosTables,
  }
})

// ---------------------------------------------------------------------------
// normalizeTableStatus
// ---------------------------------------------------------------------------

describe('normalizeTableStatus', () => {
  it.each([
    ['available', 'available'],
    ['occupied', 'occupied'],
    ['active', 'active'],
    ['reserved', 'reserved'],
    ['disabled', 'disabled'],
    ['unknown', 'unknown'],
    ['AVAILABLE', 'available'],
    ['OCCUPIED', 'occupied'],
  ])('normalizes %s → %s', (input, expected) => {
    expect(normalizeTableStatus(input)).toBe(expected)
  })

  it('returns unknown for unrecognized raw status', () => {
    expect(normalizeTableStatus('some_krypton_raw_value')).toBe('unknown')
    expect(normalizeTableStatus('')).toBe('unknown')
  })
})

// ---------------------------------------------------------------------------
// derivePosReadiness
// ---------------------------------------------------------------------------

describe('derivePosReadiness', () => {
  it('returns unknown when data is null', () => {
    expect(derivePosReadiness(null)).toBe('unknown')
  })

  it('returns blocked when posSessionOpen is false', () => {
    expect(derivePosReadiness({ posSessionOpen: false })).toBe('blocked')
  })

  it('returns blocked when terminal is not open', () => {
    expect(derivePosReadiness({
      posSessionOpen: true,
      terminal: { id: 't1', name: 'T1', status: 'closed' },
    })).toBe('blocked')
  })

  it('returns ready when session open and terminal open', () => {
    expect(derivePosReadiness({
      posSessionOpen: true,
      terminal: { id: 't1', name: 'T1', status: 'open' },
    })).toBe('ready')
  })

  it('returns ready when session open and no terminal info', () => {
    expect(derivePosReadiness({ posSessionOpen: true })).toBe('ready')
  })
})

// ---------------------------------------------------------------------------
// pos-context store
// ---------------------------------------------------------------------------

describe('pos-context store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mocks.fetchPosReadiness.mockReset()
    mocks.fetchPosTables.mockReset()
  })

  it('starts with unknown readiness state', () => {
    const store = usePosContextStore()
    expect(store.posReadinessState).toBe('unknown')
    expect(store.isReady).toBe(false)
    expect(store.isBlocked).toBe(false)
  })

  it('enableMock loads mock data and derives ready state', () => {
    const store = usePosContextStore()
    store.enableMock()

    expect(store.readiness).not.toBeNull()
    expect(store.tables.length).toBeGreaterThan(0)
    expect(store.posReadinessState).toBe('ready')
    expect(store.isReady).toBe(true)
    expect(store.isBlocked).toBe(false)
  })

  it('enableMock normalizes table statuses', () => {
    const store = usePosContextStore()
    store.enableMock()

    for (const table of store.tables) {
      const valid = ['available', 'occupied', 'active', 'reserved', 'disabled', 'unknown']
      expect(valid).toContain(table.normalizedStatus)
    }
  })

  it('refreshReadiness populates readiness from API', async () => {
    const store = usePosContextStore()
    mocks.fetchPosReadiness.mockResolvedValueOnce({
      posSessionId: 'pos-1',
      posSessionOpen: true,
      openedAt: '2026-01-01T10:00:00.000Z',
      terminal: { id: 't1', name: 'Terminal 1', status: 'open', blockingReason: null },
    })

    await store.refreshReadiness()

    expect(store.readiness?.posSessionId).toBe('pos-1')
    expect(store.posReadinessState).toBe('ready')
    expect(store.lastError).toBeNull()
  })

  it('refreshReadiness sets blocked when session is closed', async () => {
    const store = usePosContextStore()
    mocks.fetchPosReadiness.mockResolvedValueOnce({
      posSessionId: null,
      posSessionOpen: false,
    })

    await store.refreshReadiness()

    expect(store.posReadinessState).toBe('blocked')
    expect(store.isBlocked).toBe(true)
  })

  it('refreshReadiness sets lastError on failure', async () => {
    const store = usePosContextStore()
    mocks.fetchPosReadiness.mockRejectedValueOnce(new Error('network error'))

    await store.refreshReadiness()

    expect(store.lastError).toBe('network error')
    expect(store.posReadinessState).toBe('unknown')
  })

  it('refreshTables populates tables from API', async () => {
    const store = usePosContextStore()
    mocks.fetchPosTables.mockResolvedValueOnce([
      { id: '1', name: 'Table 1', rawStatus: 'available', normalizedStatus: 'available' },
      { id: '2', name: 'Table 2', rawStatus: 'occupied', normalizedStatus: 'occupied' },
    ])

    await store.refreshTables()

    expect(store.tables).toHaveLength(2)
    expect(store.tables[0]?.normalizedStatus).toBe('available')
    expect(store.lastError).toBeNull()
  })

  it('normalizedStatusFor returns unknown for missing table', () => {
    const store = usePosContextStore()
    expect(store.normalizedStatusFor('nonexistent')).toBe('unknown')
  })

  it('normalizedStatusFor returns correct status after load', async () => {
    const store = usePosContextStore()
    mocks.fetchPosTables.mockResolvedValueOnce([
      { id: '5', name: 'Table 5', rawStatus: 'reserved', normalizedStatus: 'reserved' },
    ])

    await store.refreshTables()

    expect(store.normalizedStatusFor('5')).toBe('reserved')
  })

  it('markTableOrderSent updates table status to active immediately', async () => {
    const store = usePosContextStore()
    store.enableMock()
    const tableId = store.tables[0]!.id

    await store.markTableOrderSent(tableId)

    expect(store.normalizedStatusFor(tableId)).toBe('active')
  })

  it('markTableOrderSent does nothing for unknown tableId', async () => {
    const store = usePosContextStore()
    store.enableMock()

    await expect(store.markTableOrderSent('nonexistent')).resolves.toBeUndefined()
  })

  it('refreshTables skips API call when useMock is true', async () => {
    const store = usePosContextStore()
    store.enableMock()

    await store.refreshTables()

    expect(mocks.fetchPosTables).not.toHaveBeenCalled()
  })

  it('refreshReadiness skips API call when useMock is true', async () => {
    const store = usePosContextStore()
    store.enableMock()

    await store.refreshReadiness()

    expect(mocks.fetchPosReadiness).not.toHaveBeenCalled()
  })

  it('clear resets state', () => {
    const store = usePosContextStore()
    store.enableMock()

    store.clear()

    expect(store.readiness).toBeNull()
    expect(store.tables).toHaveLength(0)
    expect(store.posReadinessState).toBe('unknown')
  })
})
