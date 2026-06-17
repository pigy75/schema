import { useState, useEffect } from 'react'
import { modules, STATUS, STATUS_COLORS, AREA_COLORS, referenceCards } from './SistemistData'
import ArchitectureDiagram from './ArchitectureDiagram'

const STORAGE_KEY = 'sistemista-junior-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch {}
}

// ── Roadmap Node ──────────────────────────────────────────────────────────────
function ModuleNode({ mod, status, onStatusChange, onClick, active }) {
  const sc = STATUS_COLORS[status]
  const ac = AREA_COLORS[mod.area]
  return (
    <div
      onClick={() => onClick(mod.id)}
      className="cursor-pointer select-none"
      style={{ width: 160 }}
    >
      <div style={{
        border: `2px solid ${active ? '#0f172a' : sc.border}`,
        borderRadius: 12,
        background: sc.bg,
        padding: '10px 12px',
        boxShadow: active ? '0 0 0 3px #0f172a33' : '0 2px 6px #0001',
        transition: 'all .15s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{mod.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, background: ac.bg,
            color: ac.text, border: `1px solid ${ac.border}`,
            borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap'
          }}>{ac.label}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', lineHeight: 1.3, marginBottom: 4 }}>
          {mod.label}
        </div>
        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 8, lineHeight: 1.4 }}>
          {mod.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
          <select
            value={status}
            onChange={e => { e.stopPropagation(); onStatusChange(mod.id, e.target.value) }}
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: 10, border: 'none', background: 'transparent',
              color: sc.text, fontWeight: 600, cursor: 'pointer', outline: 'none',
              flex: 1, padding: 0
            }}
          >
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

// ── Reference Card ────────────────────────────────────────────────────────────
function RefCard({ card }) {
  const [activeSection, setActiveSection] = useState(0)
  if (!card) return null
  const section = card.sections[activeSection]
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{card.icon}</span>
        <h2 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>{card.title}</h2>
      </div>
      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {card.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveSection(i)} style={{
            padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: activeSection === i ? '#1e40af' : '#e2e8f0',
            color: activeSection === i ? '#fff' : '#475569',
            transition: 'all .15s'
          }}>{s.title}</button>
        ))}
      </div>
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#1e3a6e' }}>
              {['Concetto', 'Definizione', 'Esempio / Comando', 'Note'].map(h => (
                <th key={h} style={{
                  padding: '9px 12px', color: '#fff', textAlign: 'left',
                  fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                <td style={{
                  padding: '8px 12px', fontWeight: 700, color: '#1e40af',
                  borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap', verticalAlign: 'top'
                }}>{row.concept}</td>
                <td style={{ padding: '8px 12px', color: '#334155', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                  {row.definition}
                </td>
                <td style={{
                  padding: '8px 12px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top'
                }}>
                  <code style={{
                    background: '#f1f5f9', padding: '2px 6px', borderRadius: 4,
                    fontSize: 12, color: '#0f172a', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
                  }}>{row.example}</code>
                </td>
                <td style={{
                  padding: '8px 12px', color: '#64748b', fontSize: 12,
                  borderBottom: '1px solid #e2e8f0', verticalAlign: 'top', fontStyle: 'italic'
                }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ progress }) {
  const total = modules.length
  const done = modules.filter(m => progress[m.id] === 'done').length
  const doing = modules.filter(m => progress[m.id] === 'doing').length
  const pct = Math.round((done / total) * 100)
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 16, boxShadow: '0 1px 4px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>Progresso complessivo</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1e40af' }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#3b82f6,#22c55e)', borderRadius: 4, transition: 'width .4s' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
        <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ {done} completati</span>
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>⟳ {doing} in corso</span>
        <span style={{ color: '#94a3b8' }}>○ {total - done - doing} da iniziare</span>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [activeModule, setActiveModule] = useState('networking')
  const [view, setView] = useState('roadmap') // 'roadmap' | 'cards'

  useEffect(() => { saveProgress(progress) }, [progress])

  const handleStatus = (id, status) => setProgress(p => ({ ...p, [id]: status }))
  const getStatus = id => progress[id] || 'todo'

  const areaGroups = {
    core: modules.filter(m => m.area === 'core'),
    professional: modules.filter(m => m.area === 'professional'),
    compliance: modules.filter(m => m.area === 'compliance'),
  }

  const activeCard = referenceCards[activeModule]

  return (
    <div style={{
      minHeight: '100vh', background: '#f1f5f9',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: '#1e3a6e', color: '#fff',
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: '0 2px 8px #0003'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>🎓 Sistemista Junior</div>
          <div style={{ fontSize: 11, color: '#93c5fd', marginTop: 2 }}>
            Percorso formativo pratico — Lab: Proxmox · Sophos · Alcatel/Aruba · M365
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['roadmap','🗺️ Roadmap'],['cards','📋 Reference Cards'],['arch','🏗️ Architettura']].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: view === v ? '#fff' : 'rgba(255,255,255,.15)',
              color: view === v ? '#1e3a6e' : '#fff',
              transition: 'all .15s'
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        <ProgressBar progress={progress} />

        {view === 'roadmap' ? (
          <>
            {/* Roadmap */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px #0001' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 16, color: '#1e293b' }}>
                📍 Roadmap — clicca un modulo per vedere la reference card
              </h2>
              {Object.entries(areaGroups).map(([area, mods]) => (
                <div key={area} style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: AREA_COLORS[area].bg, border: `1px solid ${AREA_COLORS[area].border}`,
                    color: AREA_COLORS[area].text, borderRadius: 6, padding: '3px 10px',
                    fontWeight: 700, fontSize: 12, marginBottom: 12
                  }}>
                    {AREA_COLORS[area].label}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {mods.map(mod => (
                      <ModuleNode
                        key={mod.id}
                        mod={mod}
                        status={getStatus(mod.id)}
                        onStatusChange={handleStatus}
                        onClick={id => { setActiveModule(id); setView('cards') }}
                        active={activeModule === mod.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div style={{
              marginTop: 16, background: '#fff', borderRadius: 10,
              padding: '12px 16px', display: 'flex', gap: 24, flexWrap: 'wrap',
              boxShadow: '0 1px 4px #0001', fontSize: 12
            }}>
              <strong style={{ color: '#1e293b' }}>Legenda stato:</strong>
              {Object.entries(STATUS_COLORS).map(([k, c]) => (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, color: c.text }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
                  {STATUS[k]}
                </span>
              ))}
              <span style={{ color: '#64748b', marginLeft: 'auto' }}>
                💡 Usa il dropdown su ogni modulo per aggiornare lo stato — si salva automaticamente
              </span>
            </div>
          </>
        ) : view === 'cards' ? (
          <>
            {/* Cards view */}
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Sidebar */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 4px #0001' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Moduli</div>
                  {Object.entries(areaGroups).map(([area, mods]) => (
                    <div key={area} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: AREA_COLORS[area].text, marginBottom: 4, textTransform: 'uppercase' }}>
                        {AREA_COLORS[area].label}
                      </div>
                      {mods.map(mod => {
                        const st = getStatus(mod.id)
                        const sc = STATUS_COLORS[st]
                        const hasCard = !!referenceCards[mod.id]
                        return (
                          <div
                            key={mod.id}
                            onClick={() => hasCard && setActiveModule(mod.id)}
                            style={{
                              padding: '7px 10px', borderRadius: 8, marginBottom: 2,
                              cursor: hasCard ? 'pointer' : 'default',
                              background: activeModule === mod.id ? '#dbeafe' : 'transparent',
                              border: activeModule === mod.id ? '1px solid #3b82f6' : '1px solid transparent',
                              display: 'flex', alignItems: 'center', gap: 6,
                              opacity: hasCard ? 1 : 0.5
                            }}
                          >
                            <span style={{ fontSize: 14 }}>{mod.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: activeModule === mod.id ? 700 : 400, color: '#1e293b', flex: 1 }}>
                              {mod.label}
                            </span>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              {/* Card content */}
              <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px #0001', minWidth: 0 }}>
                {activeCard
                  ? <RefCard key={activeModule} card={activeCard} />
                  : <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>
                      Seleziona un modulo dalla sidebar
                    </div>
                }
              </div>
            </div>
          </>
        ) : view === 'arch' ? (
          <ArchitectureDiagram />
        ) : null}
      </div>
    </div>
  )
}
