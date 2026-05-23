import { useState, useRef, useEffect } from "react";

const PHASES = [
  { id: "current", label: "STATO ATTUALE" },
  { id: "phase1",  label: "FASE 1 - Client su HP" },
  { id: "phase2",  label: "FASE 2 - Rimozione Alcatel" },
  { id: "phase3",  label: "FASE 3 - ESXi + LACP" },
];

const DEVICE_COLORS = {
  internet: { bg:"#334155", border:"#94a3b8" },
  firewall: { bg:"#7c2d12", border:"#f97316" },
  switch:   { bg:"#1e3a5f", border:"#3b82f6" },
  switch2:  { bg:"#064e3b", border:"#10b981" },
  server:   { bg:"#1c1917", border:"#fbbf24" },
  server2:  { bg:"#1c1917", border:"#34d399" },
  clients:  { bg:"#1e293b", border:"#60a5fa" },
  clients2: { bg:"#1e293b", border:"#818cf8" },
  newdc:    { bg:"#1c3a2a", border:"#6ee7b7" },
  esxi:     { bg:"#3b0764", border:"#a855f7" },
};

const DN = {
  current:[
    {id:"internet", label:"INTERNET",     sub:"ISP",               ip:"",              colorKey:"internet",x:310,y:20 },
    {id:"firewall", label:"SOPHOS XG",    sub:"GW + DHCP",         ip:"",              colorKey:"firewall",x:280,y:120},
    {id:"alcatel",  label:"ALCATEL 6450", sub:"AOS 6 Stack 4x",    ip:"",              colorKey:"switch",  x:100,y:250},
    {id:"hp",       label:"HP 1960",      sub:"Stack 4x Web GUI",  ip:"",              colorKey:"switch2", x:460,y:250},
    {id:"esxi",     label:"ESXI HOST",    sub:"VMware ESXi",       ip:"",              colorKey:"esxi",    x:60, y:390},
    {id:"s250",     label:".250 AD+DHCP", sub:"Domain Controller", ip:"192.168.0.250", colorKey:"server",  x:20, y:520},
    {id:"s251",     label:".251 AD",      sub:"Domain Controller", ip:"192.168.0.251", colorKey:"server",  x:180,y:520},
    {id:"s32",      label:".32 GESTIONALE",sub:"App Server",       ip:"192.168.0.32",  colorKey:"server2", x:340,y:520},
    {id:"cli30",    label:"CLIENT VLAN30",sub:"192.168.100.0/24",  ip:"",              colorKey:"clients", x:460,y:390},
    {id:"cli31",    label:"WiFi VLAN31",  sub:"192.168.101.0/24",  ip:"",              colorKey:"clients2",x:630,y:390},
  ],
  phase1:[
    {id:"internet", label:"INTERNET",     sub:"ISP",               ip:"",              colorKey:"internet",x:310,y:20 },
    {id:"firewall", label:"SOPHOS XG",    sub:"GW + DHCP",         ip:"",              colorKey:"firewall",x:280,y:120},
    {id:"alcatel",  label:"ALCATEL 6450", sub:"AOS 6 Stack 4x",    ip:"",              colorKey:"switch",  x:80, y:250},
    {id:"hp",       label:"HP 1960",      sub:"Stack 4x Web GUI",  ip:"",              colorKey:"switch2", x:460,y:250},
    {id:"esxi",     label:"ESXI HOST",    sub:"VMware ESXi",       ip:"",              colorKey:"esxi",    x:60, y:390},
    {id:"s250",     label:".250 AD+DHCP", sub:"Domain Controller", ip:"192.168.0.250", colorKey:"server",  x:20, y:520},
    {id:"s251",     label:".251 AD",      sub:"Domain Controller", ip:"192.168.0.251", colorKey:"server",  x:180,y:520},
    {id:"s32",      label:".32 GESTIONALE",sub:"App Server",       ip:"192.168.0.32",  colorKey:"server2", x:340,y:520},
    {id:"cli30",    label:"CLIENT VLAN30",sub:"192.168.100.0/24",  ip:"",              colorKey:"clients", x:480,y:390},
    {id:"cli31",    label:"WiFi VLAN31",  sub:"192.168.101.0/24",  ip:"",              colorKey:"clients2",x:650,y:390},
  ],
  phase2:[
    {id:"internet", label:"INTERNET",     sub:"ISP",               ip:"",              colorKey:"internet",x:310,y:20 },
    {id:"firewall", label:"SOPHOS XG",    sub:"GW + DHCP",         ip:"",              colorKey:"firewall",x:280,y:120},
    {id:"hp",       label:"HP 1960",      sub:"Stack 4x Web GUI",  ip:"",              colorKey:"switch2", x:300,y:250},
    {id:"esxi",     label:"ESXI HOST",    sub:"VMware ESXi",       ip:"",              colorKey:"esxi",    x:160,y:390},
    {id:"s250",     label:".250 AD+DHCP", sub:"Domain Controller", ip:"192.168.0.250", colorKey:"server",  x:20, y:520},
    {id:"s251",     label:".251 AD",      sub:"Domain Controller", ip:"192.168.0.251", colorKey:"server",  x:180,y:520},
    {id:"s32",      label:".32 GESTIONALE",sub:"App Server",       ip:"192.168.0.32",  colorKey:"server2", x:340,y:520},
    {id:"cli30",    label:"CLIENT VLAN30",sub:"192.168.100.0/24",  ip:"",              colorKey:"clients", x:480,y:390},
    {id:"cli31",    label:"WiFi VLAN31",  sub:"192.168.101.0/24",  ip:"",              colorKey:"clients2",x:650,y:390},
  ],
  phase3:[
    {id:"internet", label:"INTERNET",     sub:"ISP",               ip:"",              colorKey:"internet",x:310,y:20 },
    {id:"firewall", label:"SOPHOS XG",    sub:"GW + DHCP",         ip:"",              colorKey:"firewall",x:280,y:120},
    {id:"hp",       label:"HP 1960",      sub:"Stack 4x Web GUI",  ip:"",              colorKey:"switch2", x:300,y:250},
    {id:"esxi",     label:"ESXI HOST",    sub:"VMware ESXi",       ip:"",              colorKey:"esxi",    x:140,y:390},
    {id:"s250",     label:".250 AD+DHCP", sub:"Domain Controller", ip:"192.168.0.250", colorKey:"server",  x:10, y:520},
    {id:"s251",     label:".251 AD",      sub:"Domain Controller", ip:"192.168.0.251", colorKey:"server",  x:170,y:520},
    {id:"s32",      label:".32 GESTIONALE",sub:"App Server",       ip:"192.168.0.32",  colorKey:"server2", x:330,y:520},
    {id:"newdc",    label:"NUOVO DC/DNS", sub:"DNS primario",      ip:"",              colorKey:"newdc",   x:490,y:520},
    {id:"cli30",    label:"CLIENT VLAN30",sub:"192.168.100.0/24",  ip:"",              colorKey:"clients", x:490,y:390},
    {id:"cli31",    label:"WiFi VLAN31",  sub:"192.168.101.0/24",  ip:"",              colorKey:"clients2",x:660,y:390},
  ],
};

const DE = {
  current:[
    {id:"e1", from:"internet",to:"firewall",label:"WAN",       color:"#94a3b8",dashed:false,bold:false},
    {id:"e2", from:"firewall",to:"alcatel", label:"VLAN 1",    color:"#3b82f6",dashed:false,bold:false},
    {id:"e3", from:"firewall",to:"hp",      label:"VLAN 30/31",color:"#10b981",dashed:false,bold:false},
    {id:"e4", from:"alcatel", to:"hp",      label:"Trunk tmp", color:"#f59e0b",dashed:true, bold:false},
    {id:"e5", from:"alcatel", to:"esxi",    label:"VLAN 1",    color:"#a855f7",dashed:false,bold:false},
    {id:"e6", from:"esxi",    to:"s250",    label:"",          color:"#fbbf24",dashed:false,bold:false},
    {id:"e7", from:"esxi",    to:"s251",    label:"",          color:"#fbbf24",dashed:false,bold:false},
    {id:"e8", from:"esxi",    to:"s32",     label:"",          color:"#34d399",dashed:false,bold:false},
    {id:"e9", from:"hp",      to:"cli30",   label:"VLAN 30",   color:"#60a5fa",dashed:false,bold:false},
    {id:"e10",from:"hp",      to:"cli31",   label:"VLAN 31",   color:"#818cf8",dashed:false,bold:false},
  ],
  phase1:[
    {id:"e1", from:"internet",to:"firewall",label:"WAN",        color:"#94a3b8",dashed:false,bold:false},
    {id:"e2", from:"firewall",to:"alcatel", label:"VLAN 1",     color:"#3b82f6",dashed:false,bold:false},
    {id:"e3", from:"firewall",to:"hp",      label:"VLAN 30/31", color:"#10b981",dashed:false,bold:false},
    {id:"e4", from:"alcatel", to:"hp",      label:"Trunk tmp",  color:"#f59e0b",dashed:true, bold:false},
    {id:"e5", from:"alcatel", to:"esxi",    label:"VLAN 1",     color:"#a855f7",dashed:false,bold:false},
    {id:"e6", from:"esxi",    to:"s250",    label:"",           color:"#fbbf24",dashed:false,bold:false},
    {id:"e7", from:"esxi",    to:"s251",    label:"",           color:"#fbbf24",dashed:false,bold:false},
    {id:"e8", from:"esxi",    to:"s32",     label:"",           color:"#34d399",dashed:false,bold:false},
    {id:"e9", from:"hp",      to:"cli30",   label:"VLAN 30 OK", color:"#60a5fa",dashed:false,bold:false},
    {id:"e10",from:"hp",      to:"cli31",   label:"VLAN 31 OK", color:"#818cf8",dashed:false,bold:false},
  ],
  phase2:[
    {id:"e1",from:"internet",to:"firewall",label:"WAN",         color:"#94a3b8",dashed:false,bold:false},
    {id:"e2",from:"firewall",to:"hp",      label:"VLAN 1+30+31",color:"#10b981",dashed:false,bold:false},
    {id:"e3",from:"hp",      to:"esxi",    label:"VLAN 1",      color:"#a855f7",dashed:false,bold:false},
    {id:"e4",from:"esxi",    to:"s250",    label:"",            color:"#fbbf24",dashed:false,bold:false},
    {id:"e5",from:"esxi",    to:"s251",    label:"",            color:"#fbbf24",dashed:false,bold:false},
    {id:"e6",from:"esxi",    to:"s32",     label:"",            color:"#34d399",dashed:false,bold:false},
    {id:"e7",from:"hp",      to:"cli30",   label:"VLAN 30",     color:"#60a5fa",dashed:false,bold:false},
    {id:"e8",from:"hp",      to:"cli31",   label:"VLAN 31",     color:"#818cf8",dashed:false,bold:false},
  ],
  phase3:[
    {id:"e1",from:"internet",to:"firewall",label:"WAN",         color:"#94a3b8",dashed:false,bold:false},
    {id:"e2",from:"firewall",to:"hp",      label:"VLAN 1+30+31",color:"#10b981",dashed:false,bold:false},
    {id:"e3",from:"hp",      to:"esxi",    label:"LACP",        color:"#a855f7",dashed:false,bold:true },
    {id:"e4",from:"esxi",    to:"s250",    label:"",            color:"#fbbf24",dashed:false,bold:false},
    {id:"e5",from:"esxi",    to:"s251",    label:"",            color:"#fbbf24",dashed:false,bold:false},
    {id:"e6",from:"esxi",    to:"s32",     label:"",            color:"#34d399",dashed:false,bold:false},
    {id:"e7",from:"esxi",    to:"newdc",   label:"new VM",      color:"#6ee7b7",dashed:false,bold:false},
    {id:"e8",from:"hp",      to:"cli30",   label:"VLAN 30",     color:"#60a5fa",dashed:false,bold:false},
    {id:"e9",from:"hp",      to:"cli31",   label:"VLAN 31",     color:"#818cf8",dashed:false,bold:false},
  ],
};

const NOTES = {
  current:[
    {text:"ESXi ancora su Alcatel - causa root sospetta",type:"warn"},
    {text:"Trunk temporaneo Alcatel/HP attivo",          type:"warn"},
    {text:"Client parzialmente gia su HP",               type:"ok"},
    {text:".250/.251 irraggiungibili a intermittenza",   type:"err"},
  ],
  phase1:[
    {text:"TUTTI i client spostati su HP 1960",          type:"ok"},
    {text:"AP WiFi collegati su HP 1960",                type:"ok"},
    {text:"Verificare connettivita dopo ogni batch",     type:"info"},
    {text:"ESXi ancora su Alcatel - da migrare",         type:"warn"},
  ],
  phase2:[
    {text:"Alcatel 6450 dismesso",                       type:"ok"},
    {text:"HP 1960 unico switch attivo",                 type:"ok"},
    {text:"Sophos gateway per tutte le VLAN",            type:"ok"},
    {text:"ESXi su HP - pianificare LACP",               type:"info"},
  ],
  phase3:[
    {text:"ESXi su HP 1960 con LACP (2 porte)",          type:"ok"},
    {text:"Nuovo DC/DNS su VM dedicata",                 type:"ok"},
    {text:"Sophos: solo policy necessarie",              type:"ok"},
    {text:"Infrastruttura stabile e monitorabile",       type:"ok"},
  ],
};

const NC = {ok:"#10b981",warn:"#f59e0b",err:"#ef4444",info:"#3b82f6"};

function uid(){ return Math.random().toString(36).slice(2,8); }
function center(n){ return {x:n.x+72, y:n.y+36}; }
function svgPt(svg,cx,cy){
  try{
    const p=svg.createSVGPoint(); p.x=cx; p.y=cy;
    const m=svg.getScreenCTM(); if(!m) return null;
    return p.matrixTransform(m.inverse());
  }catch(e){return null;}
}

const S={
  panel:{background:"#04090f",borderRadius:"10px",border:"1px solid #0f172a",padding:"14px"},
  lbl:{fontSize:"9px",letterSpacing:"3px",color:"#334155",marginBottom:"8px",display:"block"},
  inp:{background:"#0a1628",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:"4px",
       padding:"5px 8px",fontSize:"11px",fontFamily:"monospace",width:"100%",boxSizing:"border-box"},
  btn:(c)=>({padding:"5px 10px",borderRadius:"5px",cursor:"pointer",fontFamily:"monospace",
             fontSize:"10px",border:"none",background:c||"#1e3a5f",color:"#e2e8f0",marginRight:"4px"}),
};

export default function App(){
  const [phase,setPhase]     = useState("current");
  const [nodes,setNodes]     = useState(()=>JSON.parse(JSON.stringify(DN)));
  const [edges,setEdges]     = useState(()=>JSON.parse(JSON.stringify(DE)));
  const [sel,setSel]         = useState(null);
  const [editN,setEditN]     = useState(null);
  const [editE,setEditE]     = useState(null);
  const [linking,setLinking] = useState(null);
  const [lline,setLline]     = useState(null);
  const drag   = useRef(null);
  const svgRef = useRef(null);
  const pidx   = PHASES.findIndex(p=>p.id===phase);
  const cN     = nodes[phase];
  const cE     = edges[phase];

  const onNodeMD = (e,id)=>{
    if(e.button!==0) return;
    e.stopPropagation();
    if(linking){
      if(linking!==id){
        const ne={id:"e"+uid(),from:linking,to:id,label:"",color:"#94a3b8",dashed:false,bold:false};
        setEdges(p=>({...p,[phase]:[...p[phase],ne]}));
      }
      setLinking(null); setLline(null); return;
    }
    const sp=svgPt(svgRef.current,e.clientX,e.clientY);
    if(!sp) return;
    const nd=cN.find(n=>n.id===id);
    drag.current={id,ox:sp.x-nd.x,oy:sp.y-nd.y,moved:false};
    setSel({type:"node",id});
  };

  useEffect(()=>{
    const move=e=>{
      if(linking&&svgRef.current){
        const sp=svgPt(svgRef.current,e.clientX,e.clientY);
        if(sp) setLline(p=>p?{...p,x2:sp.x,y2:sp.y}:p);
        return;
      }
      if(!drag.current) return;
      const sp=svgPt(svgRef.current,e.clientX,e.clientY);
      if(!sp) return;
      drag.current.moved=true;
      setNodes(p=>({...p,[phase]:p[phase].map(n=>
        n.id===drag.current.id?{...n,x:sp.x-drag.current.ox,y:sp.y-drag.current.oy}:n
      )}));
    };
    const up=()=>{
      if(drag.current&&!drag.current.moved){
        const n=cN.find(x=>x.id===drag.current.id);
        if(n) setEditN({...n});
      }
      drag.current=null;
    };
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    return()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
  },[phase,linking,cN]);

  useEffect(()=>{
    const esc=e=>{ if(e.key==="Escape"){ setLinking(null); setLline(null); } };
    window.addEventListener("keydown",esc);
    return()=>window.removeEventListener("keydown",esc);
  },[]);

  const saveN=u=>{ setNodes(p=>({...p,[phase]:p[phase].map(n=>n.id===u.id?u:n)})); setEditN(null); };
  const delN=id=>{ setNodes(p=>({...p,[phase]:p[phase].filter(n=>n.id!==id)})); setEdges(p=>({...p,[phase]:p[phase].filter(e=>e.from!==id&&e.to!==id)})); setEditN(null); setSel(null); };
  const addN=()=>{ const n={id:"n"+uid(),label:"NUOVO NODO",sub:"",ip:"",colorKey:"server",x:300,y:300}; setNodes(p=>({...p,[phase]:[...p[phase],n]})); setEditN({...n}); };

  const onEdgeClick=(e,id)=>{ e.stopPropagation(); const ed=cE.find(x=>x.id===id); if(ed){setEditE({...ed});setSel({type:"edge",id});} };
  const saveE=u=>{ setEdges(p=>({...p,[phase]:p[phase].map(e=>e.id===u.id?u:e)})); setEditE(null); };
  const delE=id=>{ setEdges(p=>({...p,[phase]:p[phase].filter(e=>e.id!==id)})); setEditE(null); setSel(null); };

  const startLink=id=>{ const nd=cN.find(n=>n.id===id); const c=center(nd); setLinking(id); setLline({x1:c.x,y1:c.y,x2:c.x,y2:c.y}); setEditN(null); };

  const reset=()=>{ setNodes(p=>({...p,[phase]:JSON.parse(JSON.stringify(DN[phase]))})); setEdges(p=>({...p,[phase]:JSON.parse(JSON.stringify(DE[phase]))})); setSel(null); setEditN(null); setEditE(null); setLinking(null); setLline(null); };

  const changePhase=id=>{ setPhase(id); setSel(null); setEditN(null); setEditE(null); setLinking(null); setLline(null); };

  return(
    <div style={{background:"#060d1a",minHeight:"100vh",fontFamily:"monospace",color:"#e2e8f0",padding:"16px",boxSizing:"border-box"}}
      onClick={()=>{ if(!linking){setSel(null);} }}>

      <div style={{textAlign:"center",marginBottom:"12px"}}>
        <div style={{fontSize:"10px",letterSpacing:"4px",color:"#334155"}}>TECNOE - PIANO MIGRAZIONE RETE</div>
        <div style={{fontSize:"20px",fontWeight:"800",color:"#f1f5f9",margin:"3px 0"}}>Network Migration Diagram</div>
        <div style={{fontSize:"10px",color: linking?"#a855f7":"#475569"}}>
          {linking?"🔗 Click nodo destinazione per creare link — ESC per annullare":"Trascina nodi · Click nodo/link per editare"}
        </div>
      </div>

      <div style={{display:"flex",gap:"6px",marginBottom:"10px",justifyContent:"center",flexWrap:"wrap"}}>
        {PHASES.map((p,i)=>(
          <button key={p.id} onClick={()=>changePhase(p.id)} style={{
            padding:"6px 12px",borderRadius:"6px",cursor:"pointer",fontFamily:"monospace",fontSize:"10px",
            border:phase===p.id?"1px solid #3b82f6":"1px solid #1e293b",
            background:phase===p.id?"#1e3a5f":"#0a1628",
            color:phase===p.id?"#93c5fd":"#475569",fontWeight:phase===p.id?"700":"400"}}>
            {String(i+1).padStart(2,"0")} {p.label}
          </button>
        ))}
        <button onClick={reset}  style={S.btn("#1e293b")}>↺ Reset</button>
        <button onClick={addN}   style={S.btn("#0f2e1a")}>+ Nodo</button>
        {linking&&<button onClick={()=>{setLinking(null);setLline(null);}} style={S.btn("#3b0714")}>✕ Annulla</button>}
      </div>

      <div style={{display:"flex",gap:"4px",marginBottom:"12px",alignItems:"center"}}>
        {PHASES.map((p,i)=><div key={p.id} style={{flex:1,height:"3px",borderRadius:"2px",background:i<=pidx?"#3b82f6":"#1e293b"}}/>)}
        <span style={{fontSize:"9px",color:"#334155",marginLeft:"6px"}}>{pidx+1}/{PHASES.length}</span>
      </div>

      <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>

        <div style={{flex:1,minWidth:"460px",background:"#04090f",borderRadius:"10px",border:`1px solid ${linking?"#a855f7":"#0f172a"}`,transition:"border 0.2s"}}>
          <svg ref={svgRef} viewBox="0 0 800 630" style={{width:"100%",display:"block",cursor:linking?"crosshair":"default"}}>
            <defs>
              <marker id="ar"    markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker>
              <marker id="ar-s"  markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#f97316"/></marker>
              <filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="gl2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {cE.map(edge=>{
              const fn=cN.find(n=>n.id===edge.from); const tn=cN.find(n=>n.id===edge.to);
              if(!fn||!tn) return null;
              const fc=center(fn),tc=center(tn);
              const isSel=sel?.type==="edge"&&sel.id===edge.id;
              return(
                <g key={edge.id} onClick={e=>onEdgeClick(e,edge.id)} style={{cursor:"pointer"}}>
                  <line x1={fc.x} y1={fc.y} x2={tc.x} y2={tc.y} stroke="transparent" strokeWidth="14"/>
                  <line x1={fc.x} y1={fc.y} x2={tc.x} y2={tc.y}
                    stroke={isSel?"#f97316":edge.color} strokeWidth={edge.bold?3:1.5}
                    strokeDasharray={edge.dashed?"7,4":"none"} strokeOpacity="0.85"
                    markerEnd={isSel?"url(#ar-s)":"url(#ar)"}/>
                  {edge.label&&<text x={(fc.x+tc.x)/2} y={(fc.y+tc.y)/2-7} textAnchor="middle" fontSize="9" fill={isSel?"#f97316":edge.color} fontFamily="monospace" opacity="0.9">{edge.label}</text>}
                </g>
              );
            })}

            {lline&&<line x1={lline.x1} y1={lline.y1} x2={lline.x2} y2={lline.y2} stroke="#a855f7" strokeWidth="2" strokeDasharray="6,3" opacity="0.7"/>}

            {cN.map(node=>{
              const t=DEVICE_COLORS[node.colorKey]||DEVICE_COLORS.server;
              const isSel=sel?.type==="node"&&sel.id===node.id;
              return(
                <g key={node.id} transform={`translate(${node.x},${node.y})`}
                  onMouseDown={e=>onNodeMD(e,node.id)}
                  style={{cursor:linking?"pointer":"grab",userSelect:"none"}}>
                  <rect x="3" y="4" width="144" height="64" rx="8" fill="#000" opacity="0.4"/>
                  <rect x="0" y="0" width="144" height="64" rx="8" fill={t.bg} stroke={isSel?"#f97316":t.border} strokeWidth={isSel?2.5:1.5} filter={isSel?"url(#gl2)":"url(#gl)"}/>
                  <rect x="0" y="0" width="144" height="4" rx="8" fill={isSel?"#f97316":t.border} opacity="0.6"/>
                  <text x="8" y="22" fontSize="9" fontWeight="700" fill={isSel?"#f97316":t.border} fontFamily="monospace">{node.label}</text>
                  <text x="8" y="36" fontSize="8" fill="#64748b" fontFamily="monospace">{node.sub}</text>
                  <text x="8" y="50" fontSize="8" fill="#475569" fontFamily="monospace">{node.ip}</text>
                  {isSel&&(
                    <g onClick={e=>{e.stopPropagation();startLink(node.id);}} style={{cursor:"pointer"}}>
                      <rect x="126" y="6" width="14" height="14" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1"/>
                      <text x="133" y="17" textAnchor="middle" fontSize="11" fill="#a855f7">+</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{width:"220px",minWidth:"210px",display:"flex",flexDirection:"column",gap:"10px"}}>

          {editN&&(
            <div style={S.panel}>
              <span style={S.lbl}>MODIFICA NODO</span>
              {[["Label","label"],["Descrizione","sub"],["IP","ip"]].map(([l,k])=>(
                <div key={k} style={{marginBottom:"8px"}}>
                  <div style={{fontSize:"8px",color:"#475569",marginBottom:"3px"}}>{l}</div>
                  <input style={S.inp} value={editN[k]||""} onChange={e=>setEditN(p=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
              <div style={{marginBottom:"8px"}}>
                <div style={{fontSize:"8px",color:"#475569",marginBottom:"3px"}}>Tipo / Colore</div>
                <select style={S.inp} value={editN.colorKey} onChange={e=>setEditN(p=>({...p,colorKey:e.target.value}))}>
                  {Object.keys(DEVICE_COLORS).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginTop:"10px"}}>
                <button style={S.btn("#1e3a5f")} onClick={()=>saveN(editN)}>Salva</button>
                <button style={S.btn("#2d1a5f")} onClick={()=>startLink(editN.id)}>+ Link</button>
                <button style={S.btn("#3b0714")} onClick={()=>delN(editN.id)}>Elimina</button>
                <button style={S.btn("#1e293b")} onClick={()=>setEditN(null)}>✕</button>
              </div>
            </div>
          )}

          {editE&&(
            <div style={S.panel}>
              <span style={S.lbl}>MODIFICA LINK</span>
              <div style={{marginBottom:"8px"}}>
                <div style={{fontSize:"8px",color:"#475569",marginBottom:"3px"}}>Label</div>
                <input style={S.inp} value={editE.label||""} onChange={e=>setEditE(p=>({...p,label:e.target.value}))}/>
              </div>
              <div style={{marginBottom:"8px"}}>
                <div style={{fontSize:"8px",color:"#475569",marginBottom:"3px"}}>Colore</div>
                <input type="color" value={editE.color} onChange={e=>setEditE(p=>({...p,color:e.target.value}))}
                  style={{width:"100%",height:"28px",border:"none",borderRadius:"4px",cursor:"pointer"}}/>
              </div>
              <div style={{display:"flex",gap:"14px",marginBottom:"8px"}}>
                <label style={{fontSize:"10px",color:"#64748b",display:"flex",alignItems:"center",gap:"5px"}}>
                  <input type="checkbox" checked={editE.dashed} onChange={e=>setEditE(p=>({...p,dashed:e.target.checked}))}/> Tratteggiato
                </label>
                <label style={{fontSize:"10px",color:"#64748b",display:"flex",alignItems:"center",gap:"5px"}}>
                  <input type="checkbox" checked={editE.bold} onChange={e=>setEditE(p=>({...p,bold:e.target.checked}))}/> Grassetto
                </label>
              </div>
              <div style={{display:"flex",gap:"4px",marginTop:"10px"}}>
                <button style={S.btn("#1e3a5f")} onClick={()=>saveE(editE)}>Salva</button>
                <button style={S.btn("#3b0714")} onClick={()=>delE(editE.id)}>Elimina</button>
                <button style={S.btn("#1e293b")} onClick={()=>setEditE(null)}>✕</button>
              </div>
            </div>
          )}

          {!editN&&!editE&&(
            <div style={S.panel}>
              <span style={S.lbl}>NOTE - {PHASES[pidx].label}</span>
              {NOTES[phase].map((n,i)=>(
                <div key={i} style={{fontSize:"10px",color:"#94a3b8",marginBottom:"8px",lineHeight:"1.5",paddingLeft:"8px",borderLeft:"2px solid "+NC[n.type]}}>
                  {n.text}
                </div>
              ))}
            </div>
          )}

          <div style={S.panel}>
            <span style={S.lbl}>LEGENDA</span>
            {[
              {color:"#94a3b8",label:"WAN"},
              {color:"#3b82f6",label:"VLAN 1 - Server"},
              {color:"#10b981",label:"VLAN 30/31"},
              {color:"#a855f7",label:"ESXi uplink"},
              {color:"#fbbf24",label:"VM - Server AD"},
              {color:"#34d399",label:"VM - Gestionale"},
              {color:"#f59e0b",label:"Trunk temporaneo",dashed:true},
              {color:"#6ee7b7",label:"Nuovo DC/DNS"},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke={it.color} strokeWidth="2" strokeDasharray={it.dashed?"5,3":"none"}/></svg>
                <span style={{fontSize:"9px",color:"#475569"}}>{it.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
