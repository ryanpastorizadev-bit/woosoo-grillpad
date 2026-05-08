import { z } from 'zod'
import { API_ENDPOINTS } from './endpoints'

// ---------------------------------------------------------------------------
// Normalized status types
// ---------------------------------------------------------------------------

export const TABLE_STATUSES = ['available', 'occupied', 'active', 'reserved', 'disabled', 'unknown'] as const
export type TableStatus = typeof TABLE_STATUSES[number]

export const POS_READINESS_STATES = ['ready', 'blocked', 'unknown'] as const
export type PosReadinessState = typeof POS_READINESS_STATES[number]

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const TerminalSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  blockingReason: z.string().nullable().optional(),
})

const PosReadinessResponseSchema = z.object({
  posSessionId: z.string().nullable().optional(),
  posSessionOpen: z.boolean(),
  openedAt: z.string().nullable().optional(),
  terminal: TerminalSchema.nullable().optional(),
})

const TableRowSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  rawStatus: z.string(),
  normalizedStatus: z.string(),
})

export type PosReadinessResponse = z.infer<typeof PosReadinessResponseSchema>
export type TableRow = z.infer<typeof TableRowSchema>

// ---------------------------------------------------------------------------
// Status normalization helpers
// ---------------------------------------------------------------------------

const KNOWN_STATUSES = new Set<string>(TABLE_STATUSES)

export function normalizeTableStatus(raw: string): TableStatus {
  const lower = raw.toLowerCase()
  if (KNOWN_STATUSES.has(lower))
    return lower as TableStatus
  return 'unknown'
}

export function derivePosReadiness(data: PosReadinessResponse | null): PosReadinessState {
  if (!data)
    return 'unknown'
  if (!data.posSessionOpen)
    return 'blocked'
  if (data.terminal && data.terminal.status.toLowerCase() !== 'open')
    return 'blocked'
  return 'ready'
}

// ---------------------------------------------------------------------------
// Mock data (used while backend is unavailable)
// ---------------------------------------------------------------------------

export const MOCK_POS_READINESS: PosReadinessResponse = {
  posSessionId: 'mock-pos-session-001',
  posSessionOpen: true,
  openedAt: new Date().toISOString(),
  terminal: {
    id: 'term-1',
    name: 'Terminal 1',
    status: 'open',
    blockingReason: null,
  },
}

export const MOCK_TABLES: TableRow[] = [
  { id: '1', name: 'Table 1', rawStatus: 'available', normalizedStatus: 'available' },
  { id: '2', name: 'Table 2', rawStatus: 'occupied', normalizedStatus: 'occupied' },
  { id: '3', name: 'Table 3', rawStatus: 'active', normalizedStatus: 'active' },
  { id: '4', name: 'Table 4', rawStatus: 'reserved', normalizedStatus: 'reserved' },
  { id: '5', name: 'Table 5', rawStatus: 'disabled', normalizedStatus: 'disabled' },
  { id: '6', name: 'Table 6', rawStatus: 'unknown', normalizedStatus: 'unknown' },
  { id: '7', name: 'Table 7', rawStatus: 'available', normalizedStatus: 'available' },
  { id: '8', name: 'Table 8', rawStatus: 'occupied', normalizedStatus: 'occupied' },
  { id: '9', name: 'Table 9', rawStatus: 'active', normalizedStatus: 'active' },
  { id: '10', name: 'Table 10', rawStatus: 'available', normalizedStatus: 'available' },
  { id: '11', name: 'Table 11', rawStatus: 'reserved', normalizedStatus: 'reserved' },
  { id: '12', name: 'Table 12', rawStatus: 'available', normalizedStatus: 'available' },
]

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchPosReadiness(): Promise<PosReadinessResponse> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.pos.readiness)
  return parse(PosReadinessResponseSchema, response)
}

export async function fetchPosTables(): Promise<TableRow[]> {
  const { api, parse } = useApi()
  const response = await api(API_ENDPOINTS.pos.tables)
  return parse(z.array(TableRowSchema), response)
}
