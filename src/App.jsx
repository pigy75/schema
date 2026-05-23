import { useState, useRef, useEffect, useCallback } from "react";

const PHASES = [
  { id: "current", label: "STATO ATTUALE" },
  { id: "phase1", label: "FASE 1 - Client su HP" },
  { id: "phase2", label: "FASE 2 - Rimozione Alcatel" },
  { id: "phase3", label: "FASE 3 - ESXi + LACP" },
];

const DEVICE_TYPES = {
  internet:  { color: "#334155", border: "#94a3b8", icon: "INET",  label: "INTERNET" },
  firewall:  { color: "#7c2d12", border: "#f97316", icon: "FW",    label: "SOPHOS XG" },
  alcatel:   { color: "#1e3a5f", border: "#3b82f6", icon: "SW",    label: "ALCATEL 6450" },
  hp:        { color: "#064e3b", border: "#10b981", icon: "SW",    label: "HP 1960" },
  esxi:      { color: "#3b0764", border: "#a855f7", icon: "ESXI",  label: "ESXI HOST" },
  server250: { color: "#1c1917", border: "#fbbf24", icon: "SRV",   label: ".250 AD+DHCP" },
  server251: { color: "#1c1917", border: "#fbbf24", icon: "SRV",   label: ".251 AD" },
  server32:  { color: "#1c1917", border: "#34d399", icon: "SRV",   label: ".32 GESTIONALE" },
  clients30: { color: "#1e293b", border: "#60a5fa", icon: "PC",    label: "CLIENT VLAN30" },
  clients31: { color: "#1e293b", border: "#818cf8", icon: "WIFI",  label: "WiFi VLAN31" },
  newdc:     { color: "#1c3a2a", border: "#6ee7b7", icon: "NEW",   label: "NUOVO DC/DNS" },
};

const NOTE_COLORS = { ok: "#10b981", warn: "#f59e0b", err: "#ef4444", info: "#3b82f6" };
const NOTE_ICONS  = { ok: "OK", warn: "!!", err: "XX", info: "--" };

const CONFIGS = {
  current: {
    nodes: [
      { id: "internet",  type: "internet",  x: 310, y: 20  },
      { id: "firewall",  type: "firewall",  x: 280, y: 120 },
      { id: "alcatel",   type: "alcatel",   x: 100, y: 250 },
      { id: "hp",        type: "hp",        x: 460, y: 250 },
      { id: "esxi",      type: "esxi",      x: 60,  y: 390 },
      { id: "server250", type: "server250", x: 20,  y: 520 },
      { id: "server251", type: "server251", x: 180, y: 520 },
      { id: "server32",  type: "server32",  x: 340, y: 520 },
      { id: "clients30", type: "clients30", x: 460, y: 390 },
      { id: "clients31", type: "clients31", x: 630, y: 390 },
    ],
    edges: [
      { from: "internet",  to: "firewall",  label: "WAN",       color: "#94a3b8" },
      { from: "firewall",  to: "alcatel",   label: "VLAN 1",    color: "#3b82f6" },
      { from: "firewall",  to: "hp",        label: "VLAN 30/31",color: "#10b981" },
      { from: "alcatel",   to: "hp",        label: "Trunk tmp", color: "#f59e0b", dashed: true },
      { from: "alcatel",   to: "esxi",      label: "VLAN 1",    color: "#a855f7" },
      { from: "esxi",      to: "server250", label: "",           color: "#fbbf24" },
      { from: "esxi",      to: "server251", label: "",           color: "#fbbf24" },
      { from: "esxi",      to: "server32",  label: "",           color: "#34d399" },
      { from: "hp",        to: "clients30", label: "VLAN 30",   color: "#60a5fa" },
      { from: "hp",        to: "clients31", label: "VLAN 31",   color: "#818cf8" },
    ],
    notes: [
      { text: "ESXi ancora su Alcatel - causa root sospetta", type: "warn" },
      { text: "Trunk temporaneo Alcatel/HP attivo",           type: "warn" },
      { text: "Client parzialmente gia su HP",                type: "ok"   },
      { text: ".250/.251 irraggiungibili a intermittenza",    type: "err"  },
    ],
  },
  phase1: {
    nodes: [
      { id: "internet",  type: "internet",  x: 310, y: 20  },
      { id: "firewall",  type: "firewall",  x: 280, y: 120 },
      { id: "alcatel",   type: "alcatel",   x: 80,  y: 250 },
      { id: "hp",        type: "hp",        x: 460, y: 250 },
      { id: "esxi",      type: "esxi",      x: 60,  y: 390 },
      { id: "server250", type: "server250", x: 20,  y: 520 },
      { id: "server251", type: "server251", x: 180, y: 520 },
      { id: "server32",  type: "server32",  x: 340, y: 520 },
      { id: "clients30", type: "clients30", x: 480, y: 390 },
      { id: "clients31", type: "clients31", x: 650, y: 390 },
    ],
    edges: [
      { from: "internet",  to: "firewall",  label: "WAN",         color: "#94a3b8" },
      { from: "firewall",  to: "alcatel",   label: "VLAN 1",      color: "#3b82f6" },
      { from: "firewall",  to: "hp",        label: "VLAN 30/31",  color: "#10b981" },
      { from: "alcatel",   to: "hp",        label: "Trunk tmp",   color: "#f59e0b", dashed: true },
      { from: "alcatel",   to: "esxi",      label: "VLAN 1",      color: "#a855f7" },
      { from: "esxi",      to: "server250", label: "",             color: "#fbbf24" },
      { from: "esxi",      to: "server251", label: "",             color: "#fbbf24" },
      { from: "esxi",      to: "server32",  label: "",             color: "#34d399" },
      { from: "hp",        to: "clients30", label: "VLAN 30 OK",  color: "#60a5fa" },
      { from: "hp",        to: "clients31", label: "VLAN 31 OK",  color: "#818cf8" },
    ],
    notes: [
      { text: "TUTTI i client fisicamente spostati su HP 1960", type: "ok"   },
      { text: "AP WiFi collegati su HP 1960",                   type: "ok"   },
      { text: "Verificare connettivita dopo ogni batch di cavi", type: "info" },
      { text: "ESXi ancora su Alcatel - da migrare",            type: "warn" },
    ],
  },
  phase2: {
    nodes: [
      { id: "internet",  type: "internet",  x: 310, y: 20  },
      { id: "firewall",  type: "firewall",  x: 280, y: 120 },
      { id: "hp",        type: "hp",        x: 300, y: 250 },
      { id: "esxi",      type: "esxi",      x: 160, y: 390 },
      { id: "server250", type: "server250", x: 20,  y: 520 },
      { id: "server251", type: "server251", x: 180, y: 520 },
      { id: "server32",  type: "server32",  x: 340, y: 520 },
      { id: "clients30", type: "clients30", x: 480, y: 390 },
      { id: "clients31", type: "clients31", x: 650, y: 390 },
    ],
    edges: [
      { from: "internet",  to: "firewall",  label: "WAN",          color: "#94a3b8" },
      { from: "firewall",  to: "hp",        label: "VLAN 1+30+31", color: "#10b981" },
      { from: "hp",        to: "esxi",      label: "VLAN 1",       color: "#a855f7" },
      { from: "esxi",      to: "server250", label: "",              color: "#fbbf24" },
      { from: "esxi",      to: "server251", label: "",              color: "#fbbf24" },
      { from: "esxi",      to: "server32",  label: "",              color: "#34d399" },
      { from: "hp",        to: "clients30", label: "VLAN 30",      color: "#60a5fa" },
      { from: "hp",        to: "clients31", label: "VLAN 31",      color: "#818cf8" },
    ],
    notes: [
      { text: "Alcatel 6450 dismesso",                      type: "ok"   },
      { text: "HP 1960 unico switch attivo",                type: "ok"   },
      { text: "Sophos gateway per tutte le VLAN",           type: "ok"   },
      { text: "ESXi su HP - pianificare LACP prossimo step",type: "info" },
    ],
  },
  phase3: {
    nodes: [
      { id: "internet",  type: "internet",  x: 310, y: 20  },
      { id: "firewall",  type: "firewall",  x: 280, y: 120 },
      { id: "hp",        type: "hp",        x: 300, y: 250 },
      { id: "esxi",      type: "esxi",      x: 140, y: 390 },
      { id: "server250", type: "server250", x: 10,  y: 520 },
      { id: "server251", type: "server251", x: 170, y: 520 },
      { id: "server32",  type: "server32",  x: 330, y: 520 },
      { id: "newdc",     type: "newdc",     x: 490, y: 520 },
      { id: "clients30", type: "clients30", x: 490, y: 390 },
      { id: "clients31", type: "clients31", x: 660, y: 390 },
    ],
    edges: [
      { from: "internet",  to: "firewall",  label: "WAN",          color: "#94a3b8" },
      { from: "firewall",  to: "hp",        label: "VLAN 1+30+31", color: "#10b981" },
      { from: "hp",        to: "esxi",      label: "LACP",         color: "#a855f7", bold: true },
      { from: "esxi",      to: "server250", label: "",              color: "#fbbf24" },
      { from: "esxi",      to: "server251", label: "",              color: "#fbbf24" },
      { from: "esxi",      to: "server32",  label: "",              color: "#34d399" },
      { from: "esxi",      to: "newdc",     label: "new VM",        color: "#6ee7b7" },
      { from: "hp",        to: "clients30", label: "VLAN 30",      color: "#60a5fa" },
      { from: "hp",        to: "clients31", label: "VLAN 31",      color: "#818cf8" },
    ],
    notes: [
      { text: "ESXi su HP 1960 con LACP (2 porte aggregate)",    type: "ok" },
      { text: "Nuovo DC/DNS su VM dedicata - DNS primario",       type: "ok" },
      { text: "Sophos: solo policy strettamente necessarie",      type: "ok" },
      { text: "Infrastruttura stabile e pronta per monitoring",   type: "ok" },
    ],
  },
};

function getCenter(node) { return { x: node.x + 72, y: node.y + 36 }; }

export default function App() {
  const [phase, setPhase] = useState("current");
  const [positions, setPositions] = useState({});
  const dragging = useRef(null);
  const svgRef = useRef(null);
  const config = CONFIGS[phase];
  const phaseIdx = PHASES.findIndex(p => p.id === phase);

  const getPos = useCallback(
    (node) => positions[phase + "_" + node.id] || { x: node.x, y: node.y },
    [phase, positions]
  );

  const onMouseDown = (e, id) => {
    e.preventDefault();
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const sp = pt.matrixTransform(svg.getScreenCTM().inverse());
    const cur = positions[phase + "_" + id] || config.nodes.find(n => n.id === id);
    dragging.current = { id, key: phase + "_" + id, ox: sp.x - cur.x, oy: sp.y - cur.y };
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const sp = pt.matrixTransform(svg.getScreenCTM().inverse());
      setPositions(prev => ({ ...prev, [dragging.current.key]: { x: sp.x - dragging.current.ox, y: sp.y - dragging.current.oy } }));
    };
    const up = () => { dragging.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const reset = () => setPositions(prev => {
    const n = { ...prev };
    config.nodes.forEach(nd => delete n[phase + "_" + nd.id]);
    return n;
  });

  return (
    <div style={{ background: "#060d1a", minHeight: "100vh", fontFamily: "monospace", color: "#e2e8f0", padding: "16px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#334155" }}>TECNOE - PIANO MIGRAZIONE RETE</div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#f1f5f9", margin: "4px 0" }}>Network Migration Diagram</div>
        <div style={{ fontSize: "10px", color: "#475569" }}>Trascina i nodi per riorganizzare la topologia</div>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        {PHASES.map((p, i) => (
          <button key={p.id} onClick={() => setPhase(p.id)} style={{ padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "monospace", fontSize: "10px", border: phase === p.id ? "1px solid #3b82f6" : "1px solid #1e293b", background: phase === p.id ? "#1e3a5f" : "#0a1628", color: phase === p.id ? "#93c5fd" : "#475569", fontWeight: phase === p.id ? "700" : "400" }}>
            {String(i+1).padStart(2,"0")} {p.label}
          </button>
        ))}
        <button onClick={reset} style={{ padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "monospace", fontSize: "10px", border: "1px solid #1e293b", background: "#0a1628", color: "#334155" }}>Reset</button>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "12px", alignItems: "center" }}>
        {PHASES.map((p, i) => <div key={p.id} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= phaseIdx ? "#3b82f6" : "#1e293b" }} />)}
        <span style={{ fontSize: "9px", color: "#334155", marginLeft: "6px" }}>{phaseIdx+1}/{PHASES.length}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "460px", background: "#04090f", borderRadius: "10px", border: "1px solid #0f172a" }}>
          <svg ref={svgRef} viewBox="0 0 800 620" style={{ width: "100%", display: "block" }}>
            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill="#334155" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {config.edges.map((edge, i) => {
              const fn = config.nodes.find(n => n.id === edge.from);
              const tn = config.nodes.find(n => n.id === edge.to);
              if (!fn || !tn) return null;
              const fp = getPos(fn), tp = getPos(tn);
              const fc = getCenter({...fn,...fp}), tc = getCenter({...tn,...tp});
              return (
                <g key={i}>
                  <line x1={fc.x} y1={fc.y} x2={tc.x} y2={tc.y}
                    stroke={edge.color} strokeWidth={edge.bold ? 3 : 1.5}
                    strokeDasharray={edge.dashed ? "7,4" : "none"}
                    strokeOpacity="0.8" markerEnd="url(#arr)" />
                  {edge.label && <text x={(fc.x+tc.x)/2} y={(fc.y+tc.y)/2-6} textAnchor="middle" fontSize="9" fill={edge.color} fontFamily="monospace" opacity="0.9">{edge.label}</text>}
                </g>
              );
            })}

            {config.nodes.map(node => {
              const pos = getPos(node);
              const t = DEVICE_TYPES[node.type];
              return (
                <g key={node.id} transform={"translate(" + pos.x + "," + pos.y + ")"} onMouseDown={e => onMouseDown(e, node.id)} style={{ cursor: "grab", userSelect: "none" }}>
                  <rect x="3" y="4" width="144" height="58" rx="8" fill="#000" opacity="0.4"/>
                  <rect x="0" y="0" width="144" height="58" rx="8" fill={t.color} stroke={t.border} strokeWidth="1.5" filter="url(#glow)"/>
                  <rect x="0" y="0" width="144" height="4" rx="8" fill={t.border} opacity="0.5"/>
                  <rect x="4" y="8" width="28" height="20" rx="4" fill={t.border} opacity="0.15"/>
                  <text x="18" y="22" textAnchor="middle" fontSize="8" fontWeight="700" fill={t.border} fontFamily="monospace">{t.icon}</text>
                  <text x="38" y="22" fontSize="9" fontWeight="700" fill={t.border} fontFamily="monospace">{t.label}</text>
                  <text x="38" y="36" fontSize="8" fill="#64748b" fontFamily="monospace">{
                    node.id === "alcatel" ? "AOS 6 - Stack 4x" :
                    node.id === "hp" ? "Stack 4x - Web GUI" :
                    node.id === "esxi" ? "VMware ESXi" :
                    node.id === "firewall" ? "GW + DHCP" :
                    node.id === "newdc" ? "DNS primario" :
                    node.id === "internet" ? "ISP" : ""
                  }</text>
                  <text x="38" y="50" fontSize="7" fill="#1e293b" fontFamily="monospace">{
                    node.id === "server250" ? "192.168.0.250" :
                    node.id === "server251" ? "192.168.0.251" :
                    node.id === "server32"  ? "192.168.0.32"  : ""
                  }</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ width: "210px", minWidth: "200px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ background: "#04090f", borderRadius: "10px", border: "1px solid #0f172a", padding: "14px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#334155", marginBottom: "10px" }}>NOTE - {PHASES[phaseIdx].label}</div>
            {config.notes.map((note, i) => (
              <div key={i} style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "9px", lineHeight: "1.5", paddingLeft: "8px", borderLeft: "2px solid " + NOTE_COLORS[note.type] }}>
                [{NOTE_ICONS[note.type]}] {note.text}
              </div>
            ))}
          </div>
          <div style={{ background: "#04090f", borderRadius: "10px", border: "1px solid #0f172a", padding: "14px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#334155", marginBottom: "10px" }}>LEGENDA</div>
            {[
              { color: "#94a3b8", label: "WAN" },
              { color: "#3b82f6", label: "VLAN 1 - Server" },
              { color: "#10b981", label: "VLAN 30/31 - Client" },
              { color: "#a855f7", label: "ESXi uplink" },
              { color: "#fbbf24", label: "VM - Server AD" },
              { color: "#34d399", label: "VM - Gestionale" },
              { color: "#f59e0b", label: "Trunk temporaneo", dashed: true },
              { color: "#6ee7b7", label: "Nuovo DC/DNS" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                <svg width="28" height="10">
                  <line x1="0" y1="5" x2="28" y2="5" stroke={item.color} strokeWidth="2" strokeDasharray={item.dashed ? "5,3" : "none"} />
                </svg>
                <span style={{ fontSize: "9px", color: "#475569" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
