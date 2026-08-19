export function normalizeValues(values: number[]): number[] {
  const safeValues = values.map((value) => Math.max(0, value))
  const total = safeValues.reduce((sum, value) => sum + value, 0)
  if (total === 0) return safeValues
  const exact = safeValues.map((value) => (value / total) * 100)
  const rounded = exact.map((value) => Math.floor(value))
  let remainder = 100 - rounded.reduce((sum, value) => sum + value, 0)
  const order = exact.map((value, index) => ({ index, fraction: value - rounded[index] })).sort((a, b) => b.fraction - a.fraction)
  for (let index = 0; index < order.length && remainder > 0; index += 1) {
    rounded[order[index].index] += 1
    remainder -= 1
  }
  return rounded
}

export function rebalanceValues(values: number[], changedIndex: number, requestedValue: number): number[] {
  const nextValue = Math.max(0, Math.min(100, Math.round(requestedValue)))
  const remaining = 100 - nextValue
  const otherIndexes = values.map((_, index) => index).filter((index) => index !== changedIndex)
  const otherTotal = otherIndexes.reduce((sum, index) => sum + Math.max(0, values[index]), 0)
  const weights = otherIndexes.map((index) => otherTotal > 0 ? Math.max(0, values[index]) : 1)
  const weightTotal = weights.reduce((sum, value) => sum + value, 0)
  const exact = weights.map((weight) => weightTotal === 0 ? 0 : (weight / weightTotal) * remaining)
  const distributed = exact.map((value) => Math.floor(value))
  let remainder = remaining - distributed.reduce((sum, value) => sum + value, 0)
  const order = exact.map((value, index) => ({ index, fraction: value - distributed[index] })).sort((a, b) => b.fraction - a.fraction)
  for (let index = 0; index < order.length && remainder > 0; index += 1) {
    distributed[order[index].index] += 1
    remainder -= 1
  }
  const result = values.map(() => 0)
  result[changedIndex] = nextValue
  otherIndexes.forEach((index, position) => { result[index] = distributed[position] })
  return result
}