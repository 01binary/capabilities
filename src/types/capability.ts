export type SkillDirection = 'up' | 'right' | 'down' | 'left'

export interface CapabilitySkill {
  id: string
  label: string
  direction: SkillDirection
  value: number
  icon: string
}

export interface CapabilityChartData {
  title: string
  subtitle: string
  skills: CapabilitySkill[]
}

export interface ChartAppearance {
  fillColor: string
  outlineColor: string
  fillOpacity: number
  axisColor: string
  textColor: string
  backgroundColor: string
  showRings: boolean
  showPercentages: boolean
  showTitle: boolean
}