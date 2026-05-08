export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const device = useDeviceStore()
  const session = useSessionStore()
  const activeOrder = useActiveOrderStore()
  const printEvents = usePrintEventsStore()
  const realtime = useRealtimeStore()

  let socket: WebSocket | null = null

  function disconnect() {
    if (socket) {
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      socket.close()
      socket = null
    }
    realtime.unbindSession()
  }

  async function syncSessionState(sessionId: string) {
    await Promise.all([
      activeOrder.refresh(sessionId),
      printEvents.refresh(sessionId),
    ])
  }

  function connect(sessionId: string) {
    if (!device.token)
      return
    const changed = realtime.bindSession(sessionId)
    if (!changed && socket)
      return

    disconnect()

    realtime.markConnecting(sessionId)
    const basePath = `${config.public.reverb.scheme}://${config.public.reverb.host}:${config.public.reverb.port}`
    const url = `${basePath}/ws?session_id=${encodeURIComponent(sessionId)}&device_id=${encodeURIComponent(device.deviceId || '')}`
    socket = new WebSocket(url)

    socket.onopen = async () => {
      realtime.markConnected()
      await syncSessionState(sessionId)
    }

    socket.onmessage = async (event) => {
      let payload: { type?: string } = {}
      try {
        payload = JSON.parse(event.data as string)
      }
      catch {
        return
      }

      const shouldRefresh = ['order_created', 'order_refilled', 'print_event_created', 'print_event_updated'].includes(payload.type || '')
      if (!shouldRefresh)
        return
      await syncSessionState(sessionId)
    }

    socket.onerror = () => {
      realtime.markDisconnected()
    }

    socket.onclose = () => {
      realtime.markDisconnected()
      socket = null
    }
  }

  watch(
    () => ({ isRegistered: device.isRegistered, sessionId: session.sessionId, isActive: session.isActive }),
    ({ isRegistered, sessionId, isActive }) => {
      if (!isRegistered || !sessionId || !isActive) {
        disconnect()
        activeOrder.clear()
        printEvents.clear()
        return
      }

      connect(sessionId)
    },
    { immediate: true, deep: true },
  )
})
