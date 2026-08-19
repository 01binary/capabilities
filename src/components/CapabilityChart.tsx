import { CircuitBoard, Code2, Settings, Wrench, type LucideProps } from 'lucide-react'
import type { ComponentType, RefObject } from 'react'
import type { CapabilityChartData, ChartAppearance, SkillDirection } from '../types/capability'
import { GEOMETRY, generateCapabilityPath } from '../lib/capabilityGeometry'

const iconMap: Record<string, ComponentType<LucideProps>> = { settings: Settings, 'circuit-board': CircuitBoard, 'code-2': Code2, wrench: Wrench }
const positions: Record<SkillDirection, { x: number; labelY: number; anchor: 'start' | 'middle' | 'end'; iconX: number; iconY: number; percentY: number }> = {
  up: { x: 350, labelY: 82, anchor: 'middle', iconX: 338, iconY: 94, percentY: 130 },
  right: { x: 576, labelY: 386, anchor: 'middle', iconX: 564, iconY: 398, percentY: 432 },
  down: { x: 350, labelY: 612, anchor: 'middle', iconX: 338, iconY: 624, percentY: 658 },
  left: { x: 124, labelY: 386, anchor: 'middle', iconX: 112, iconY: 398, percentY: 432 },
}
interface CapabilityChartProps { data: CapabilityChartData; appearance: ChartAppearance; svgRef: RefObject<SVGSVGElement | null> }

export function CapabilityChart({ data, appearance, svgRef }: CapabilityChartProps) {
  const path = generateCapabilityPath(data.skills); const total = data.skills.reduce((sum, skill) => sum + skill.value, 0)
  return <svg ref={svgRef} className="capability-chart" viewBox="0 0 700 700" role="img" aria-labelledby="chart-title chart-description" style={{ background: appearance.backgroundColor }}>
    <title id="chart-title">{data.title}</title><desc id="chart-description">Technical capability distribution: {data.skills.map((skill) => `${skill.label} ${skill.value}%`).join(', ')}.</desc>
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6" fill="none" stroke={appearance.axisColor} strokeWidth="1.2" /></marker></defs>
    {appearance.showTitle && <g fill={appearance.textColor} textAnchor="middle"><text x="350" y="34" className="svg-title">{data.title}</text>{data.subtitle && <text x="350" y="54" className="svg-subtitle">{data.subtitle}</text>}</g>}
    {appearance.showRings && [0.25, 0.5, 0.75, 1].map((scale) => <circle key={scale} cx={GEOMETRY.center} cy={GEOMETRY.center} r={GEOMETRY.maxRadius * scale} fill="none" stroke={appearance.axisColor} strokeOpacity="0.18" strokeWidth="1" />)}
    <g stroke={appearance.axisColor} strokeWidth="1.5" strokeOpacity="0.7" markerEnd="url(#arrow)"><line x1={GEOMETRY.center - GEOMETRY.axisRadius} y1={GEOMETRY.center} x2={GEOMETRY.center + GEOMETRY.axisRadius} y2={GEOMETRY.center} /><line x1={GEOMETRY.center + GEOMETRY.axisRadius} y1={GEOMETRY.center} x2={GEOMETRY.center - GEOMETRY.axisRadius} y2={GEOMETRY.center} /><line x1={GEOMETRY.center} y1={GEOMETRY.center + GEOMETRY.axisRadius} x2={GEOMETRY.center} y2={GEOMETRY.center - GEOMETRY.axisRadius} /><line x1={GEOMETRY.center} y1={GEOMETRY.center - GEOMETRY.axisRadius} x2={GEOMETRY.center} y2={GEOMETRY.center + GEOMETRY.axisRadius} /></g>
    <path d={path} fill={appearance.fillColor} fillOpacity={appearance.fillOpacity} stroke={appearance.outlineColor} strokeWidth="2.5" strokeLinejoin="round" /><circle cx={GEOMETRY.center} cy={GEOMETRY.center} r="4" fill={appearance.outlineColor} /><circle cx={GEOMETRY.center} cy={GEOMETRY.center} r="10" fill="none" stroke={appearance.outlineColor} strokeOpacity="0.5" />
    {data.skills.map((skill) => { const Icon = iconMap[skill.icon] ?? Wrench; const position = positions[skill.direction]; return <g key={skill.id} fill={appearance.textColor} stroke={appearance.textColor}><text x={position.x} y={position.labelY} textAnchor={position.anchor} className="svg-label" stroke="none">{skill.label}</text><Icon x={position.iconX} y={position.iconY} size={24} strokeWidth={1.7} aria-hidden="true" />{appearance.showPercentages && <text x={position.x} y={position.percentY} textAnchor={position.anchor} className="svg-percent" stroke="none">{skill.value}%</text>}</g> })}
    <text x="350" y="680" textAnchor="middle" className="svg-total" fill={appearance.textColor} opacity={total === 100 ? 0 : 0.75} stroke="none">Total {total}%</text>
  </svg>
}