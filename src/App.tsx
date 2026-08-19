import { Download, RotateCcw, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import './App.css'
import { AppearanceControls } from './components/AppearanceControls'
import { CapabilityChart } from './components/CapabilityChart'
import { JsonEditor } from './components/JsonEditor'
import { SkillControl } from './components/SkillControl'
import { defaultAppearance, defaultChart, presets } from './data/defaultChart'
import { normalizeValues, rebalanceValues } from './lib/normalizeValues'
import { exportSvg } from './lib/svgExport'
import type { CapabilityChartData, ChartAppearance } from './types/capability'

function App() {
  const [data, setData] = useState<CapabilityChartData>(defaultChart)
  const [appearance, setAppearance] = useState<ChartAppearance>(defaultAppearance)
  const [autoBalance, setAutoBalance] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const total = data.skills.reduce((sum, skill) => sum + skill.value, 0)

  const updateSkill = (index: number, patch: Partial<CapabilityChartData['skills'][number]>) => {
    setData((current) => {
      if (autoBalance && patch.value !== undefined) {
        const values = rebalanceValues(current.skills.map((skill) => skill.value), index, patch.value)
        return { ...current, skills: current.skills.map((skill, skillIndex) => ({ ...skill, ...(skillIndex === index ? patch : {}), value: values[skillIndex] })) }
      }
      return { ...current, skills: current.skills.map((skill, skillIndex) => skillIndex === index ? { ...skill, ...patch } : skill) }
    })
  }

  const normalize = () => {
    const values = normalizeValues(data.skills.map((skill) => skill.value))
    setData((current) => ({ ...current, skills: current.skills.map((skill, index) => ({ ...skill, value: values[index] })) }))
  }

  const applyPreset = (name: string) => {
    if (name in presets) setData((current) => ({ ...current, skills: presets[name].map((skill) => ({ ...skill })) }))
  }

  const reset = () => { setData(defaultChart); setAppearance(defaultAppearance); setAutoBalance(false) }

  return <main className="app-shell">
    <header className="topbar"><div className="brand-mark"><span className="brand-cross"><i /><i /></span><span>CAPABILITY / CHART</span></div><div className="topbar-meta"><span className="status-dot" /> Live SVG canvas <span className="version">v1.0</span></div></header>
    <div className="workspace">
      <aside className="editor-column">
        <div className="eyebrow"><Sparkles size={14} /> Technical profile builder</div><h1>Shape the<br /><em>signal.</em></h1><p className="intro">Map the distribution of technical expertise into a clear, export-ready visual.</p>
        <section className="panel-section subject-section"><label className="field-label" htmlFor="title">Chart title</label><input id="title" className="title-input" value={data.title} onChange={(event) => setData({ ...data, title: event.target.value })} /><label className="field-label" htmlFor="subtitle">Subtitle <span>Optional</span></label><input id="subtitle" value={data.subtitle} onChange={(event) => setData({ ...data, subtitle: event.target.value })} /></section>
        <section className="panel-section capability-section">
          <div className="section-heading"><span>Capabilities</span><span className={total === 100 ? 'total-ok' : 'total-warning'}>Total {total}%</span></div>
          <label className="auto-balance-toggle"><input type="checkbox" checked={autoBalance} onChange={(event) => setAutoBalance(event.target.checked)} /><span><strong>Auto-balance to 100%</strong><small>Adjusting one value redistributes the rest proportionally.</small></span></label>
          {data.skills.map((skill, index) => <SkillControl key={skill.id} skill={skill} onChange={(patch) => updateSkill(index, patch)} />)}
          {total !== 100 && <div className="validation-message">Values must total 100% before export.<button type="button" onClick={normalize} disabled={total === 0}>Normalize to 100%</button></div>}
        </section>
        <div className="utility-row"><label className="preset-select">Preset<select aria-label="Capability preset" defaultValue="" onChange={(event) => applyPreset(event.target.value)}><option value="">Try a preset</option>{Object.keys(presets).map((name) => <option key={name}>{name}</option>)}</select></label><button type="button" className="icon-button" title="Reset example data" aria-label="Reset example data" onClick={reset}><RotateCcw size={16} /></button></div>
        <AppearanceControls appearance={appearance} onChange={(patch) => setAppearance((current) => ({ ...current, ...patch }))} /><JsonEditor data={data} onApply={setData} /><button type="button" className="export-button" onClick={() => svgRef.current && exportSvg(svgRef.current, data.title)}><Download size={17} /> Export SVG</button>
      </aside>
      <section className="preview-column"><div className="preview-header"><div><span className="eyebrow">Live preview</span><h2>Distribution field</h2></div><span className="vector-badge">VECTOR / SVG</span></div><div className="chart-frame"><CapabilityChart data={data} appearance={appearance} svgRef={svgRef} /></div><div className="preview-footer"><span>4 directions / 96-point smooth spline</span><span>Updates in real time</span></div></section>
    </div>
  </main>
}

export default App