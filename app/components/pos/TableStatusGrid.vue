<script setup lang="ts">
import type { TableRow, TableStatus } from '~/services/api/pos-context'
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<{
  tables: TableRow[]
  assignedTableId?: string | null
}>()

interface StatusConfig {
  label: string
  cell: string
  dot: string
}

const STATUS_CONFIG: Record<TableStatus, StatusConfig> = {
  available: {
    label: 'Available',
    cell: 'border-green-400/40 bg-green-400/10 text-green-200',
    dot: 'bg-green-400',
  },
  occupied: {
    label: 'Occupied',
    cell: 'border-red-400/40 bg-red-400/12 text-red-200',
    dot: 'bg-red-400',
  },
  active: {
    label: 'Active',
    cell: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
    dot: 'bg-amber-400',
  },
  reserved: {
    label: 'Reserved',
    cell: 'border-violet-400/40 bg-violet-400/10 text-violet-200',
    dot: 'bg-violet-400',
  },
  disabled: {
    label: 'Disabled',
    cell: 'border-white/8 bg-white/4 text-white/30',
    dot: 'bg-white/20',
  },
  unknown: {
    label: 'Unknown',
    cell: 'border-white/10 bg-transparent text-white/40',
    dot: 'bg-white/15',
  },
}

function configForStatus(status: string): StatusConfig {
  return STATUS_CONFIG[status as TableStatus] ?? STATUS_CONFIG.unknown
}

const sortedTables = computed(() =>
  [...props.tables].sort((a, b) => {
    const na = Number.parseInt(a.id, 10)
    const nb = Number.parseInt(b.id, 10)
    if (!Number.isNaN(na) && !Number.isNaN(nb))
      return na - nb
    return a.name.localeCompare(b.name)
  }),
)

const legendEntries = computed(() => {
  const seen = new Set<string>()
  const entries: Array<{ status: TableStatus, config: StatusConfig }> = []
  for (const s of ['available', 'occupied', 'active', 'reserved', 'disabled', 'unknown'] as TableStatus[]) {
    if (!seen.has(s)) {
      seen.add(s)
      entries.push({ status: s, config: STATUS_CONFIG[s] })
    }
  }
  return entries
})
</script>

<template>
  <div>
    <!-- Legend -->
    <div class="mb-3 flex flex-wrap gap-2">
      <span
        v-for="entry in legendEntries"
        :key="entry.status"
        class="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs"
        :class="entry.config.cell"
      >
        <span :class="cn('size-1.5 rounded-full', entry.config.dot)" aria-hidden="true" />
        {{ entry.config.label }}
      </span>
    </div>

    <!-- Grid -->
    <div
      class="grid gap-2"
      style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))"
      role="list"
      aria-label="Table status grid"
    >
      <div
        v-for="table in sortedTables"
        :key="table.id"
        class="relative flex min-h-[72px] flex-col items-center justify-center rounded-xl border p-2 text-center transition-all"
        :class="[
          configForStatus(table.normalizedStatus).cell,
          assignedTableId && table.id === assignedTableId ? 'ring-2 ring-[#f6b56d] ring-offset-1 ring-offset-[#252525]' : '',
        ]"
        role="listitem"
        :aria-label="`${table.name}: ${configForStatus(table.normalizedStatus).label}${assignedTableId === table.id ? ' (this device)' : ''}`"
      >
        <span
          :class="cn('mb-1 size-2 rounded-full', configForStatus(table.normalizedStatus).dot)"
          aria-hidden="true"
        />
        <p class="text-sm font-bold leading-tight">
          {{ table.name }}
        </p>
        <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {{ configForStatus(table.normalizedStatus).label }}
        </p>
        <span
          v-if="assignedTableId === table.id"
          class="absolute -right-1 -top-1 rounded-full bg-[#f6b56d] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-black"
          aria-hidden="true"
        >
          This
        </span>
      </div>
    </div>

    <p v-if="tables.length === 0" class="mt-4 text-center text-sm text-white/40">
      No table data available.
    </p>
  </div>
</template>
