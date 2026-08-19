import type { CapabilitySkill, SkillDirection } from '../types/capability'

export interface Point { x: number; y: number }

export const GEOMETRY = { center: 350, minRadius: 42, maxRadius: 184, axisRadius: 216, sampleCount: 96 }
const directionAngles: Record<SkillDirection, number> = { up: -Math.PI / 2, right: 0, down: Math.PI / 2, left: Math.PI }

function wrapAngle(angle: number): number { return ((angle + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI }
function smoothstep(t: number): number { return t * t * (3 - 2 * t) }
function anchorRadius(value: number): number {
  // Area grows with radius squared, so sqrt(value / 100) makes a 40% region
  // roughly twice the area of a 20% region before the modest floor is added.
  const areaAwareValue = Math.sqrt(Math.max(0, Math.min(100, value)) / 100)
  return GEOMETRY.minRadius + areaAwareValue * (GEOMETRY.maxRadius - GEOMETRY.minRadius)
}

export function capabilityRadiusAtAngle(angle: number, skills: CapabilitySkill[]): number {
  const anchors = (['up', 'right', 'down', 'left'] as SkillDirection[]).map((direction) => ({ angle: directionAngles[direction], radius: anchorRadius(skills.find((skill) => skill.direction === direction)?.value ?? 0) }))
  const normalizedAngle = wrapAngle(angle)
  for (let index = 0; index < anchors.length; index += 1) {
    const current = anchors[index]; const next = anchors[(index + 1) % anchors.length]
    const nextAngle = index === anchors.length - 1 ? next.angle + Math.PI * 2 : next.angle
    const currentAngle = current.angle < -Math.PI / 2 && index === 0 ? current.angle + Math.PI * 2 : current.angle
    const testAngle = normalizedAngle < currentAngle ? normalizedAngle + Math.PI * 2 : normalizedAngle
    if (testAngle >= currentAngle && testAngle <= nextAngle) {
      const t = smoothstep((testAngle - currentAngle) / (nextAngle - currentAngle))
      return current.radius + (next.radius - current.radius) * t
    }
  }
  return anchors[0].radius
}

export function generateCapabilityPoints(skills: CapabilitySkill[], centerX = GEOMETRY.center, centerY = GEOMETRY.center): Point[] {
  return Array.from({ length: GEOMETRY.sampleCount }, (_, index) => { const angle = (index / GEOMETRY.sampleCount) * Math.PI * 2; const radius = capabilityRadiusAtAngle(angle, skills); return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius } })
}

export function pointsToSmoothClosedPath(points: Point[]): string {
  if (points.length < 3) return ''
  const tension = 0.18; const pointAt = (index: number) => points[(index + points.length) % points.length]; const first = points[0]
  let path = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`
  for (let index = 0; index < points.length; index += 1) {
    const previous = pointAt(index - 1); const current = pointAt(index); const next = pointAt(index + 1); const afterNext = pointAt(index + 2)
    const control1 = { x: current.x + (next.x - previous.x) * tension, y: current.y + (next.y - previous.y) * tension }
    const control2 = { x: next.x - (afterNext.x - current.x) * tension, y: next.y - (afterNext.y - current.y) * tension }
    path += ` C ${control1.x.toFixed(2)} ${control1.y.toFixed(2)}, ${control2.x.toFixed(2)} ${control2.y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`
  }
  return `${path} Z`
}

export function generateCapabilityPath(skills: CapabilitySkill[]): string { return pointsToSmoothClosedPath(generateCapabilityPoints(skills)) }