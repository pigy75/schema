import { useState } from "react";
const PHASES = [
  { id: "current", label: "STATO ATTUALE" },
  { id: "phase1", label: "FASE 1 - Client su HP" },
  { id: "phase2", label: "FASE 2 - Rimozione Alcatel" },
  { id: "phase3", label: "FASE 3 - ESXi + LACP" },
];
export default function App() {
  const [phase, setPhase] = useState("current");
  return (
    <div style={{ background: "#060d1a", minHeight: "100vh", fontFamily: "monospace", color: "#e2e8f0", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: "22px", fontWeight: "800", color: "#f1f5f9", marginBottom: "8px" }}>TecnoE - Network Migration Diagram</div>
      <div style={{ fontSize: "11px", color: "#475569", marginBottom: "24px" }}>Seleziona una fase per visualizzare la topologia</div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        {PHASES.map(p => (
          <button key={p.id} onClick={() => setPhase(p.id)} style={{ padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontFamily: "monospace", fontSize: "11px", border: phase === p.id ? "1px solid #3b82f6" : "1px solid #1e293b", background: phase === p.id ? "#1e3a5f" : "#0a1628", color: phase === p.id ? "#93c5fd" : "#475569" }}>{p.label}</button>
        ))}
      </div>
      <div style={{ color: "#64748b", fontSize: "13px" }}>Fase attiva: <strong style={{ color: "#93c5fd" }}>{PHASES.find(p => p.id === phase)?.label}</strong></div>
      <div style={{ marginTop: "32px", padding: "16px", border: "1px solid #1e293b", borderRadius: "8px", color: "#334155", fontSize: "11px" }}>Diagramma drag and drop - deploy v2 in arrivo</div>
    </div>
  );
}
