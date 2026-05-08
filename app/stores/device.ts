import type { DeviceRegistrationResponse } from '~/services/api/device'
import { defineStore } from 'pinia'
import { z } from 'zod'
import type { DeviceRegistrationResponse } from '~/services/api/device'

interface DeviceState {
  token: string | null
  deviceId: string | null
  deviceName: string | null
  tableId: string | null
  tableName: string | null
}

const DEVICE_STORAGE_KEY = 'grillpad:device'
const DeviceStateSchema = z.object({
  token: z.string().nullable(),
  deviceId: z.string().nullable(),
  deviceName: z.string().nullable().optional().default(null),
  tableId: z.string().nullable(),
  tableName: z.string().nullable(),
})

function persistDeviceState(state: DeviceState) {
  if (!import.meta.client)
    return
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(state))
}

export function parseDeviceState(raw: string): DeviceState {
  return DeviceStateSchema.parse(JSON.parse(raw))
}

export function mapRegistrationToDeviceState(payload: DeviceRegistrationResponse): DeviceState {
  return {
    token: payload.token,
    deviceId: payload.device.id,
    deviceName: payload.device.name ?? null,
    tableId: payload.table.id,
    tableName: payload.table.name,
  }
}

export const useDeviceStore = defineStore('device', {
  state: (): DeviceState => ({ token: null, deviceId: null, deviceName: null, tableId: null, tableName: null }),
  getters: { isRegistered: state => Boolean(state.token && state.deviceId && state.tableId) },
  actions: {
    setDevice(payload: DeviceState) {
      this.$patch(payload)
      persistDeviceState(this.$state)
    },
    setFromRegistration(payload: DeviceRegistrationResponse) {
      this.setDevice(mapRegistrationToDeviceState(payload))
    },
    restoreFromStorage() {
      if (!import.meta.client)
        return false
      const raw = localStorage.getItem(DEVICE_STORAGE_KEY)
      if (!raw)
        return false
      try {
        const parsed = parseDeviceState(raw)
        this.$patch(parsed)
        return true
      }
      catch {
        localStorage.removeItem(DEVICE_STORAGE_KEY)
        this.$reset()
        return false
      }
    },
    clearDevice() {
      this.$reset()
      persistDeviceState(this.$state)
    },
  },
})
