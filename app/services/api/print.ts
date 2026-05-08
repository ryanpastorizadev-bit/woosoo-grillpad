import { z } from 'zod'
import { deviceApiEndpoints } from '~/services/api/endpoints'
import {
  PrintEventSchema,
  PrintEventsResponseSchema,
  type ApiPrintEvent,
} from '~/services/api/schemas'

export async function getPrintEvents(): Promise<ApiPrintEvent[]> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.printEvents)

  if (Array.isArray(response)) return parse(z.array(PrintEventSchema), response)
  return parse(PrintEventsResponseSchema, response).events
}

export async function ackPrintEvent(printEventId: string): Promise<ApiPrintEvent> {
  const { api, parse } = useApi()
  const response = await api(deviceApiEndpoints.ackPrintEvent(printEventId), {
    method: 'POST',
  })

  return parse(PrintEventSchema, response)
}
