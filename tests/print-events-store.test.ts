import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePrintEventsStore } from '~/stores/print-events'

const mocks = vi.hoisted(() => {
  return {
    getPrintEvents: vi.fn(),
    ackPrintEvent: vi.fn(),
  }
})

vi.mock('~/services/api/print-events', () => ({
  getPrintEvents: mocks.getPrintEvents,
  ackPrintEvent: mocks.ackPrintEvent,
}))

describe('print events store behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mocks.getPrintEvents.mockReset()
    mocks.ackPrintEvent.mockReset()
  })

  it('refresh populates events from api', async () => {
    const store = usePrintEventsStore()
    mocks.getPrintEvents.mockResolvedValueOnce([
      {
        id: 'evt-1',
        orderId: 'ord-1',
        type: 'kitchen',
        status: 'pending',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ])

    await store.refresh('session-1')

    expect(store.events).toHaveLength(1)
    expect(store.events[0].id).toBe('evt-1')
    expect(store.lastError).toBeNull()
  })

  it('acknowledge updates existing event', async () => {
    const store = usePrintEventsStore()
    store.events = [{
      id: 'evt-1',
      orderId: 'ord-1',
      type: 'kitchen',
      status: 'pending',
      createdAt: '2026-01-01T00:00:00.000Z',
    }]
    mocks.ackPrintEvent.mockResolvedValueOnce({
      id: 'evt-1',
      orderId: 'ord-1',
      type: 'kitchen',
      status: 'acknowledged',
      createdAt: '2026-01-01T00:00:00.000Z',
      acknowledgedAt: '2026-01-01T00:01:00.000Z',
    })

    await store.acknowledge('evt-1')

    expect(store.events[0].status).toBe('acknowledged')
  })

  it('acknowledge inserts unknown returned event', async () => {
    const store = usePrintEventsStore()
    mocks.ackPrintEvent.mockResolvedValueOnce({
      id: 'evt-new',
      orderId: 'ord-2',
      type: 'bar',
      status: 'acknowledged',
      createdAt: '2026-01-01T00:02:00.000Z',
      acknowledgedAt: '2026-01-01T00:03:00.000Z',
    })

    await store.acknowledge('evt-new')

    expect(store.events[0].id).toBe('evt-new')
  })

  it('sets lastError on refresh failure', async () => {
    const store = usePrintEventsStore()
    mocks.getPrintEvents.mockRejectedValueOnce(new Error('refresh failed'))

    await store.refresh('session-1')

    expect(store.lastError).toBe('refresh failed')
  })
})
