import { curveCardinalClosed, line } from 'd3-shape'
import type { CapabilitySkill, SkillDirection } from '../types/capability'

export interface Point { x: number; y: number }

export const GEOMETRY = { center: 350, minRadius: 34, maxRadius: 202, axisRadius: 232 }
const directionOrder: SkillDirection[] = ['up', 'right', 'down', 'left']
const directionAngles: Record<SkillDirection, number> = { up: -Math.PI / 2, right: 0, down: Math.PI / 2, left: Math.PI }

function anchorRadius(value: number): number {
  // Area grows with radius squared, so sqrt(value / 100) keeps a 40% direction
  // approximately twice as visually important by area as a 20% direction.
  const areaAwareValue = Math.sqrt(Math.max(0, Math.min(100, value)) / 100)
  return GEOMETRY.minRadius + areaAwareValue * (GEOMETRY.maxRadius - GEOMETRY.minRadius)
}

export function capabilityRadiusAtAngle(angle: number, skills: CapabilitySkill[]): number {
  const normalizedAngle = ((angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  const direction = directionOrder.reduce((closest, candidate) => {
    const distance = Math.abs(Math.atan2(Math.sin(normalizedAngle - directionAngles[candidate]), Math.cos(normalizedAngle - directionAngles[candidate])))
    const closestDistance = Math.abs(Math.atan2(Math.sin(normalizedAngle - directionAngles[closest]), Math.cos(normalizedAngle - directionAngles[closest])))
    return distance < closestDistance ? candidate : closest
  }, 'up' as SkillDirection)
  return anchorRadius(skills.find((skill) => skill.direction === direction)?.value ?? 0)
}

export function generateCapabilityPoints(skills: CapabilitySkill[], centerX = GEOMETRY.center, centerY = GEOMETRY.center): Point[] {
  return directionOrder.map((direction) => {
    const radius = anchorRadius(skills.find((skill) => skill.direction === direction)?.value ?? 0)
    const angle = directionAngles[direction]
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }
  })
}

export function pointsToSmoothClosedPath(points: Point[]): string {
  if (points.length < 3) return ''
  // D3's cardinal-closed curve is the reference chart's rounded-stroke mode:
  // it uses the four real anchors and creates a broad, smooth closed spline.
  return line<Point>().x((point: Point) => point.x).y((point: Point) => point.y).curve(curveCardinalClosed.tension(0))(points) ?? ''
}

export function generateCapabilityPath(skills: CapabilitySkill[]): string {
  return pointsToSmoothClosedPath(generateCapabilityPoints(skills))
}