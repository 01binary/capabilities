import type { CapabilityChartData, ChartAppearance } from '../types/capability'

export const defaultChart: CapabilityChartData = {
  title: 'Technical Capabilities',
  subtitle: 'Founder / Engineering',
  skills: [
    { id: 'mechanical', label: 'Mechanical Engineering', direction: 'up', value: 25, icon: 'settings' },
    { id: 'electrical', label: 'Electrical Engineering', direction: 'right', value: 20, icon: 'circuit-board' },
    { id: 'software', label: 'Software / Firmware', direction: 'down', value: 40, icon: 'code-2' },
    { id: 'fabrication', label: 'Fabrication', direction: 'left', value: 15, icon: 'wrench' },
  ],
}

export const defaultAppearance: ChartAppearance = {
  fillColor: '#17a8c4',
  outlineColor: '#087f9a',
  fillOpacity: 0.28,
  axisColor: '#aab5ba',
  textColor: '#243238',
  backgroundColor: '#f8faf8',
  showRings: true,
  showPercentages: false,
  showTitle: true,
}

export const presets: Record<string, CapabilityChartData['skills']> = {
  Balanced: defaultChart.skills.map((skill) => ({ ...skill, value: 25 })),
  'Software-heavy': defaultChart.skills.map((skill) => ({ ...skill, value: { mechanical: 15, electrical: 20, software: 50, fabrication: 15 }[skill.id] ?? skill.value })),
  'Hardware-heavy': defaultChart.skills.map((skill) => ({ ...skill, value: { mechanical: 35, electrical: 35, software: 15, fabrication: 15 }[skill.id] ?? skill.value })),
  'Fabrication-heavy': defaultChart.skills.map((skill) => ({ ...skill, value: { mechanical: 20, electrical: 15, software: 15, fabrication: 50 }[skill.id] ?? skill.value })),
}