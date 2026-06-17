import { useState } from 'react';

// ─── Node detail data ──────────────────────────────────────────────────────
const nodeInfo = {
  internet: { label: 'Internet', detail: 'ISP / WAN pubblico', color: '#64748b',
    notes: ['Punto di ingresso/uscita del traffico aziendale', 'IP pubblico statico o dinamico fornito da ISP'] },
  router: { label: 'Router ISP', detail: 'Modem/Router del provider', color: '#64748b',
    notes: ['Spesso in bridge mode se c\'è un firewall dedicato', 'Fornisce IP pubblico WAN al firewall'] },
  firewall: { label: 'Firewall', detail: 'Sophos XGS', color: '#dc2626',
    notes: ['Zone: WAN, LAN, DMZ, VPN', 'NAT, port forwarding, regole traffico', 'VPN SSL per utenti remoti', 'Syslog verso server centralizzato'] },
  switchPhys: { label: 'Switch Fisico', detail: 'Aruba 1930 / Alcatel 6450', color: '#ea580c',
    notes: ['Porte trunk verso firewall e host Proxmox', 'VLAN: 10=LAN, 20=Server, 30=Guest/IoT', 'STP attivo per prevenire loop'] },
  vswitch: { label: 'vSwitch (vmbr0)', detail: 'Bridge virtuale Proxmox', color: '#9333ea',
    notes: ['Collega NIC fisica alla rete virtuale delle VM', 'VLAN tagging passthrough dallo switch fisico', 'Una o più bridge per segmentazione (vmbr0, vmbr1...)'] },
  hypervisor: { label: 'Hypervisor', detail: 'Proxmox VE (Type 1)', color: '#7c3aed',
    notes: ['Gira su bare metal — gestisce CPU/RAM/storage delle VM', 'Cluster 2 nodi per ridondanza', 'Storage: local-lvm, NFS, PBS'] },
  vmAD: { label: 'VM — AD/DC', detail: 'Windows Server 2019/2022', color: '#2563eb',
    notes: ['Domain Controller — autenticazione utenti', 'DNS interno, GPO, FSMO roles'] },
  vmFile: { label: 'VM — File/App', detail: 'Server applicativo', color: '#2563eb',
    notes: ['Condivisioni di rete, applicativi gestionali', 'Backup giornaliero su PBS'] },
  client: { label: 'Client PC', detail: 'Windows 10/11 workstation', color: '#0891b2',
    notes: ['Join al dominio AD', 'BitLocker attivo (GDPR)', 'MFA per accesso M365'] },
  nas: { label: 'NAS', detail: 'Synology / QNAP', color: '#16a34a',
    notes: ['Storage condiviso SMB, integrato con AD', 'RAID 5/6 + snapshot locali', 'Target di replication per backup 3-2-1'] },
  pbs: { label: 'Backup Server', detail: 'Proxmox Backup Server', color: '#16a34a',
    notes: ['Backup incrementale con deduplication', 'Datastore dedicato per client', 'Restore testato mensilmente'] },
  zabbix: { label: 'Monitoring', detail: 'Zabbix', color: '#d97706',
    notes: ['Monitora server, switch (SNMP), firewall', 'Alert email su soglie critiche', 'Dashboard centralizzata'] },
  syslogSrv: { label: 'Syslog Server', detail: 'rsyslog / Graylog', color: '#d97706',
    notes: ['Riceve log da firewall, switch, server', 'Centralizzazione per audit e troubleshooting', 'Richiesto per conformità NIS2'] },
  m365: { label: 'Microsoft 365', detail: 'Cloud — Exchange/Teams/SharePoint', color: '#0284c7',
    notes: ['Tenant separato da AD on-prem (no Entra Connect)', 'MFA obbligatorio su tutti gli account', 'Accesso via Internet attraverso il firewall'] },
};

const layerInfo = {
  compliance: { label: 'GDPR + NIS2', color: '#ec4899',
    notes: ['Trasversale a tutta l\'infrastruttura', 'BitLocker, MFA, log accessi, backup testati', 'Incident response documentata'] },
};

// ─── SVG positions ──────────────────────────────────────────────────────────
function Box({ x, y, w, h, node, active, onClick }) {
  const info = nodeInfo[node];
  const isActive = active === node;
  return (
    <g onClick={() => onClick(node)} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={10}
        fill={isActive ? info.color : '#fff'}
        stroke={info.color} strokeWidth={isActive ? 0 : 2.5}
        style={{ transition: 'all .15s', filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,.25))' : 'drop-shadow(0 1px 3px rgba(0,0,0,.1))' }}
      />
      <text x={x + w/2} y={y + h/2 - 7} textAnchor="middle"
        fontSize="13" fontWeight="700" fill={isActive ? '#fff' : '#1e293b'}>
        {info.label}
      </text>
      <text x={x + w/2} y={y + h/2 + 11} textAnchor="middle"
        fontSize="10" fill={isActive ? '#ffffffcc' : '#64748b'}>
        {info.detail}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, dashed, label }) {
  const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#94a3b8" strokeWidth="2"
        strokeDasharray={dashed ? "5,4" : "0"}
        markerEnd="url(#arrowhead)" />
      {label && (
        <text x={midX} y={midY - 6} textAnchor="middle" fontSize="9" fill="#64748b" fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
}

export default function ArchitectureDiagram() {
  const [active, setActive] = useState('firewall');
  const info = nodeInfo[active];

  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 4 }}>
        🏗️ Architettura Logica — Flusso Completo
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        Clicca un elemento per i dettagli. Layout: Internet → Firewall → Switch → Virtualizzazione → VM
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Diagram */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 4px #0001', overflowX: 'auto' }}>
          <svg viewBox="0 0 1080 760" style={{ width: '100%', minWidth: 900, height: 'auto' }}>
            {/* Background zones */}
            <rect x="10" y="10" width="1060" height="120" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="4,3" />
            <text x="30" y="32" fontSize="11" fontWeight="700" fill="#94a3b8">ESTERNO</text>

            <rect x="10" y="150" width="1060" height="140" rx="14" fill="#fef2f2" stroke="#fecaca" strokeDasharray="4,3" />
            <text x="30" y="172" fontSize="11" fontWeight="700" fill="#dc2626">PERIMETRO DI SICUREZZA</text>

            <rect x="10" y="310" width="1060" height="130" rx="14" fill="#fff7ed" stroke="#fed7aa" strokeDasharray="4,3" />
            <text x="30" y="332" fontSize="11" fontWeight="700" fill="#ea580c">RETE LAN</text>

            <rect x="10" y="460" width="1060" height="190" rx="14" fill="#faf5ff" stroke="#e9d5ff" strokeDasharray="4,3" />
            <text x="30" y="482" fontSize="11" fontWeight="700" fill="#7c3aed">VIRTUALIZZAZIONE</text>

            <rect x="10" y="670" width="1060" height="80" rx="14" fill="#fdf2f8" stroke="#fbcfe8" strokeDasharray="4,3" />
            <text x="30" y="692" fontSize="11" fontWeight="700" fill="#9d174d">COMPLIANCE TRASVERSALE — GDPR + NIS2</text>

            {/* Layer: Esterno */}
            <Box x={40} y={50} w={150} h={60} node="internet" active={active} onClick={setActive} />
            <Box x={250} y={50} w={150} h={60} node="router" active={active} onClick={setActive} />
            <Box x={850} y={50} w={170} h={60} node="m365" active={active} onClick={setActive} />

            {/* Layer: Perimetro */}
            <Box x={440} y={195} w={170} h={70} node="firewall" active={active} onClick={setActive} />

            {/* Layer: LAN */}
            <Box x={440} y={350} w={170} h={70} node="switchPhys" active={active} onClick={setActive} />
            <Box x={850} y={350} w={170} h={60} node="client" active={active} onClick={setActive} />

            {/* Layer: Virtualizzazione */}
            <Box x={440} y={500} w={170} h={55} node="vswitch" active={active} onClick={setActive} />
            <Box x={440} y={575} w={170} h={55} node="hypervisor" active={active} onClick={setActive} />
            <Box x={680} y={500} w={150} h={55} node="vmAD" active={active} onClick={setActive} />
            <Box x={680} y={575} w={150} h={55} node="vmFile" active={active} onClick={setActive} />
            <Box x={40} y={500} w={150} h={55} node="nas" active={active} onClick={setActive} />
            <Box x={40} y={575} w={150} h={55} node="pbs" active={active} onClick={setActive} />
            <Box x={870} y={500} w={150} h={55} node="zabbix" active={active} onClick={setActive} />
            <Box x={870} y={575} w={150} h={55} node="syslogSrv" active={active} onClick={setActive} />

            {/* Arrows */}
            <Arrow x1={190} y1={80} x2={250} y2={80} />
            <Arrow x1={325} y1={110} x2={500} y2={195} label="WAN" />
            <Arrow x1={525} y1={265} x2={525} y2={350} label="trunk" />
            <Arrow x1={610} y1={385} x2={850} y2={380} dashed label="HTTPS/443" />
            <Arrow x1={525} y1={420} x2={525} y2={500} label="VLAN tag" />
            <Arrow x1={525} y1={555} x2={525} y2={575} />
            <Arrow x1={610} y1={527} x2={680} y2={527} />
            <Arrow x1={610} y1={602} x2={680} y2={602} />
            <Arrow x1={190} y1={527} x2={440} y2={620} dashed label="backup" />
            <Arrow x1={190} y1={602} x2={440} y2={610} dashed label="restore" />
            <Arrow x1={610} y1={510} x2={870} y2={527} dashed label="SNMP" />
            <Arrow x1={610} y1={245} x2={870} y2={602} dashed label="syslog" />
            <Arrow x1={935} y1={350} x2={935} y2={110} dashed label="Internet via FW" />

            {/* Legend dot */}
            <text x="30" y="745" fontSize="10" fill="#9d174d">↳ Si applica a: BitLocker (client), MFA (M365), log (syslog), backup testati, segmentazione VLAN</text>
          </svg>
        </div>

        {/* Detail panel */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px #0001', borderTop: `4px solid ${info.color}` }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>{info.label}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>{info.detail}</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {info.notes.map((n, i) => (
                <li key={i} style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4 }}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
