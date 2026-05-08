export const DEVICE_API_PREFIX = '/api/v1/device'

export const deviceApiEndpoints = {
  register: `${DEVICE_API_PREFIX}/register`,
  startSession: `${DEVICE_API_PREFIX}/session/start`,
  restoreSession: `${DEVICE_API_PREFIX}/session/restore`,
  packages: `${DEVICE_API_PREFIX}/packages`,
  initialMenu: `${DEVICE_API_PREFIX}/menu/initial`,
  refillMenu: `${DEVICE_API_PREFIX}/menu/refill`,
  initialOrders: `${DEVICE_API_PREFIX}/orders`,
  refillOrders: `${DEVICE_API_PREFIX}/orders/refill`,
  activeOrder: `${DEVICE_API_PREFIX}/orders/active`,
  printEvents: `${DEVICE_API_PREFIX}/print-events`,
  ackPrintEvent: (printEventId: string) => `${DEVICE_API_PREFIX}/print-events/${printEventId}/ack`,
} as const

export type DeviceApiEndpointKey = keyof typeof deviceApiEndpoints
