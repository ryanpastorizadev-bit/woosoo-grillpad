export interface StepperBounds {
  min: number
  max: number
  step: number
}

export function getNextStepValue(value: number, direction: 'increment' | 'decrement', bounds: StepperBounds): number {
  const delta = direction === 'increment' ? bounds.step : -bounds.step
  return Math.min(bounds.max, Math.max(bounds.min, value + delta))
}
