import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpdateStore } from '~/stores/update'

describe('update store behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('throws when applying without handler', () => {
    const store = useUpdateStore()
    store.markUpdateAvailable()

    expect(() => store.applyUpdate()).toThrow('Update apply handler is not registered.')
  })

  it('invokes apply handler when update is available', () => {
    const store = useUpdateStore()
    const handler = vi.fn()
    store.registerApplyHandler(handler)
    store.markUpdateAvailable()

    store.applyUpdate()

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does nothing when no update is available', () => {
    const store = useUpdateStore()
    const handler = vi.fn()
    store.registerApplyHandler(handler)

    store.applyUpdate()

    expect(handler).not.toHaveBeenCalled()
  })
})
