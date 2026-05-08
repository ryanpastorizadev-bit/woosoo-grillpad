import { describe, expect, it } from 'vitest'
import { mergePrintEvents } from '~/stores/print-events'

describe('print events store helpers', () => {
  it('inserts new print events at the front', () => {
    const result = mergePrintEvents([
      { id: 'old', orderId: 'o1', status: 'queued', acknowledgedAt: null, createdAt: null, updatedAt: null },
    ], { id: 'new', orderId: 'o1', status: 'printed', acknowledgedAt: null, createdAt: null, updatedAt: null })

    expect(result.map(event => event.id)).toEqual(['new', 'old'])
  })

  it('replaces an existing event by id', () => {
    const result = mergePrintEvents([
      { id: 'same', orderId: 'o1', status: 'queued', acknowledgedAt: null, createdAt: null, updatedAt: null },
    ], { id: 'same', orderId: 'o1', status: 'printed', acknowledgedAt: null, createdAt: null, updatedAt: null })

    expect(result).toEqual([
      { id: 'same', orderId: 'o1', status: 'printed', acknowledgedAt: null, createdAt: null, updatedAt: null },
    ])
  })
})
