export function canSubmitInitialOrder(submitting: boolean, sessionId: string | null, packageId: string | null, itemCount: number) {
  return !submitting && Boolean(sessionId && packageId && itemCount > 0)
}

export function canSubmitRefillOrder(submitting: boolean, sessionId: string | null, initialOrderId: string | null, itemCount: number) {
  return !submitting && Boolean(sessionId && initialOrderId && itemCount > 0)
}
