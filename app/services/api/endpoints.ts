export const API_ENDPOINTS = {
  device: {
    register: '/devices/register',
  },
  session: {
    start: '/session/start',
    current: '/session/current',
  },
  menu: {
    packages: '/packages',
    initial: '/menu/initial',
    refill: '/menu/refill',
  },
  orders: {
    initial: '/orders/initial',
    refill: '/orders/refill',
    active: '/orders/active',
  },
  printEvents: {
    list: '/print-events',
    acknowledge: (eventId: string) => `/print-events/${eventId}/ack`,
  },
  pos: {
    readiness: '/device/pos/readiness',
    tables: '/device/pos/tables',
  },
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
