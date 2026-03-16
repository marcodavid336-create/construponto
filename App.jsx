import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dvtrvpilhdxtfbzbvyae.supabase.co";
const SUPABASE_KEY = "sb_publishable_BhQoyEpeqF4d_0gOiMbJIA_3JayAUFN";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const C = {
  bg:"#080808", s1:"#101010", s2:"#181818", s3:"#202020",
  border:"#272727",
  orange:"#F97316", orangeD:"rgba(249,115,22,0.13)",
  text:"#F0F0F0", muted:"#787878", dim:"#3E3E3E",
  green:"#4ADE80", greenD:"rgba(74,222,128,0.12)",
  red:"#F87171", redD:"rgba(248,113,113,0.12)",
  yellow:"#FCD34D", yellowD:"rgba(252,211,77,0.12)",
  blue:"#60A5FA",
};

function durMs(a,b){const v=(b?new Date(b):new Date())-new Date(a);return v>0?v:0;}
function fmtH(v){const h=Math.floor(v/3600000),m=Math.floor((v%3600000)/60000);return`${h}h ${String(m).padStart(2,"0")}m`;}
function fmtT(iso){if(!iso)return"—";return new Date(iso).toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit"});}
function fmtD(iso){if(!iso)return"—";return new Date(iso).toLocaleDateString("pt-PT",{day:"2-digit",month:"short"});}
function isToday(iso){return new Date(iso).toDateString()===new Date().toDateString();}

function Card({children,style={}}){return<div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",...style}}>{children}</div>;}
function CardHead({children,extra}){return<div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:C.muted}}>{children}</div>{extra}</div>;}
function Stat({label,value,sub,color=C.orange}){return<Card style={{padding:"18px 22px"}}><div style={{color:C.muted,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{label}</div><div style={{color,fontSize:30,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,lineHeight:1}}>{value}</div>{sub&&<div style={{color:C.dim,fontSize:11,marginTop:6}}>{sub}</div>}</Card>;}
function Sel({value,onChange,children,style={}}){return<select value={value} onChange={e=>onChange(e.target.value)} style={{background:C.s3,border:`1px solid ${C.border}`,color:value?C.text:C.muted,padding:"9px 12px",borderRadius:6,fontSize:13,fontFamily:"'Barlow',sans-serif",width:"100%",outline:"none",cursor:"pointer",...style}}>{children}</select>;}
function Inp({value,onChange,placeholder,type="text",style={}}){return<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:C.s3,border:`1px solid ${C.border}`,color:C.text,padding:"9px 12px",borderRadius:6,fontSize:13,fontFamily:"'Barlow',sans-serif",width:"100%",outline:"none",...style}}/>;}
function Btn({children,onClick,variant="primary",disabled=false,style={}}){const bg=disabled?C.dim:variant==="primary"?C.orange:variant==="green"?"#22C55E":variant==="red"?"#EF4444":C.s3;const fg=variant==="ghost"?C.muted:"#000";return<button onClick={disabled?undefined:onClick} style={{background:bg,border:variant==="ghost"?`1px solid ${C.border}`:"none",color:fg,padding:"9px 18px",borderRadius:6,fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,whiteSpace:"nowrap",...style}}>{children}</button>;}
function Badge({children,color=C.orange}){const bg={[C.orange]:C.orangeD,[C.green]:C.greenD,[C.red]:C.redD,[C.yellow]:C.yellowD};return<span style={{background:bg[color]||"rgba(255,255,255,0.07)",color,padding:"2px 9px",borderRadius:99,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{children}</span>;}
function Dot({color}){return<span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 6px ${color}`,marginRight:7}}/>;}
function Label({children}){return<div style={{fontSize:10,color:C.muted,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{children}</div>;}
function Spinner(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60}}><div style={{width:32,height:32,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.orange}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style></div>;}

export default function ConstruPonto() {
  const [view,setView]=useState("dashboard");
  const [loading,setLoading]=useState(true);
  const [employees,setEmployees]=useState([]);
  const [obras,setObras]=useState([]);
  const [tools,setTools]=useState([]);
  const [pontos,setPontos]=useState([]);
  const [ferRegs,setFerRegs]=useState([]);
  const [now,setNow]=useState(new Date());
  const [pEmp,setPEmp]=useState("");const [pObra,setPObra]=useState("");
  const [fEmp,setFEmp]=useState("");const [fObra,setFObra]=useState("");const [fTool,setFTool]=useState("");const [fQty,setFQty]=useState(1);
  const [rTab,setRTab]=useState("geral");const [rEmp,setREmp]=useState("");const [rObra,setRObra]=useState("");
  const [gTab,setGTab]=useState("funcionarios");
  const [nEN,setNEN]=useState("");const [nER,setNER]=useState("");
  const [nON,setNON]=useState("");const [nOL,setNOL]=useState("");
  const [nTN,setNTN]=useState("");const [nTC,setNTC]=useState("");
  const [toast,setToast]=useState(null);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const loadAll=useCallback(async()=>{
    setLoading(true);
    const[e,o,t,p,f]=await Promise.all([
      sb.from("employees").select("*").order("name"),
      sb.from("obras").select("*").order("name"),
      sb.from("tools").select("*").order("name"),
      sb.from("pontos").select("*").order("clock_in",{ascending:false}),
      sb.from("ferramentas").select("*").order("date",{ascending:false}),
    ]);
    if(e.data)setEmployees(e.data);
    if(o.data)setObras(o.data);
    if(t.data)setTools(t.data);
    if(p.data)setPontos(p.data);
    if(f.data)setFerRegs(f.data);
    setLoading(false);
  },[]);

  useEffect(()=>{loadAll();},[loadAll]);

  function showToast(msg,color=C.green){setToast({msg,color});setTimeout(()=>setToast(null),2800);}

  const getEmp=id=>employees.find(e=>e.id===id);
  const getObra=id=>obras.find(o=>o.id===id);
  const getTool=id=>tools.find(t=>t.id===id);
  const activeFor=empId=>pontos.find(p=>p.employee_id===empId&&!p.clock_out);

  const todayPontos=pontos.filter(p=>isToday(p.clock_in));
  const activeSessions=pontos.filter(p=>!p.clock_out);
  const toolsOut=ferRegs.filter(r=>!r.returned_date);
  const totalHrsToday=todayPontos.reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);

  async function handlePonto(){
    if(!pEmp||saving)return;
    setSaving(true);
    const empId=parseInt(pEmp);
    const active=activeFor(empId);
    if(active){
      const{error}=await sb.from("pontos").update({clock_out:new Date().toISOString()}).eq("id",active.id);
      if(!error){showToast(`Saída registada — ${getEmp(empId)?.name}`);await loadAll();}
      else showToast("Erro ao registar saída",C.red);
    }else{
      if(!pObra){setSaving(false);return;}
      const{error}=await sb.from("pontos").insert({employee_id:empId,obra_id:parseInt(pObra),clock_in:new Date().toISOString()});
      if(!error){showToast(`Entrada registada — ${getEmp(empId)?.name}`);await loadAll();}
      else showToast("Erro ao registar entrada",C.red);
    }
    setSaving(false);
  }

  async function handleFer(){
    if(!fEmp||!fObra||!fTool||saving)return;
    setSaving(true);
    const{error}=await sb.from("ferramentas").insert({employee_id:parseInt(fEmp),obra_id:parseInt(fObra),tool_id:parseInt(fTool),qty:parseInt(fQty)||1,date:new Date().toISOString()});
    if(!error){showToast(`${getTool(parseInt(fTool))?.name} registada`);setFTool("");setFQty(1);await loadAll();}
    else showToast("Erro ao registar ferramenta",C.red);
    setSaving(false);
  }

  async function handleDevolver(id){
    const{error}=await sb.from("ferramentas").update({returned_date:new Date().toISOString()}).eq("id",id);
    if(!error){showToast("Ferramenta devolvida ✓");await loadAll();}
    else showToast("Erro",C.red);
  }

  async function addEmp(){if(!nEN)return;const{error}=await sb.from("employees").insert({name:nEN,role:nER});if(!error){setNEN("");setNER("");showToast("Funcionário adicionado");await loadAll();}else showToast("Erro ao adicionar",C.red);}
  async function addObra(){if(!nON)return;const{error}=await sb.from("obras").insert({name:nON,location:nOL});if(!error){setNON("");setNOL("");showToast("Obra adicionada");await loadAll();}else showToast("Erro",C.red);}
  async function addTool(){if(!nTN)return;const{error}=await sb.from("tools").insert({name:nTN,category:nTC});if(!error){setNTN("");setNTC("");showToast("Ferramenta adicionada");await loadAll();}else showToast("Erro",C.red);}
  async function delEmp(id){if(!window.confirm("Apagar funcionário?"))return;await sb.from("employees").delete().eq("id",id);await loadAll();}
  async function delObra(id){if(!window.confirm("Apagar obra?"))return;await sb.from("obras").delete().eq("id",id);await loadAll();}
  async function delTool(id){if(!window.confirm("Apagar ferramenta?"))return;await sb.from("tools").delete().eq("id",id);await loadAll();}

  const selectedEmpActive=pEmp?activeFor(parseInt(pEmp)):null;
  const selectedEmp=pEmp?getEmp(parseInt(pEmp)):null;

  const nav=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"ponto",icon:"⏱",label:"Ponto"},
    {id:"ferramentas",icon:"⚒",label:"Ferramentas"},
    {id:"relatorios",icon:"◉",label:"Relatórios"},
    {id:"gestao",icon:"⚙",label:"Gestão"},
  ];

  const css=`
    *{box-sizing:border-box;margin:0;padding:0;}
    select option{background:#202020;color:#F0F0F0;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:#101010;}
    ::-webkit-scrollbar-thumb{background:#272727;border-radius:2px;}
    input::placeholder{color:#3E3E3E;}
    table{border-collapse:collapse;width:100%;}
    th{color:#787878;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;text-align:left;padding:9px 16px;border-bottom:1px solid #272727;font-weight:600;}
    td{color:#F0F0F0;font-family:'Barlow',sans-serif;font-size:13px;padding:9px 16px;border-bottom:1px solid #181818;vertical-align:middle;}
    tbody tr:last-child td{border-bottom:none;}
    tbody tr:hover td{background:#181818;}
  `;

  return <>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    <style>{css}</style>

    {toast&&<div style={{position:"fixed",bottom:24,right:24,background:C.s2,border:`1px solid ${toast.color}44`,color:toast.color,padding:"12px 20px",borderRadius:8,fontFamily:"'Barlow',sans-serif",fontSize:13,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{toast.msg}</div>}

    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.s1,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",flexShrink:0}}>
            <div style={{background:C.orange,color:"#000",width:34,height:34,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900}}>⚙</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,letterSpacing:2.5,textTransform:"uppercase"}}>ConstruPonto</div>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1.5,textTransform:"uppercase"}}>Gestão de Horas & Armazém</div>
            </div>
          </div>
          <div style={{display:"flex",flex:1}}>
            {nav.map(n=>(
              <button key={n.id} onClick={()=>setView(n.id)} style={{background:"transparent",border:"none",color:view===n.id?C.orange:C.muted,padding:"15px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:view===n.id?`2px solid ${C.orange}`:"2px solid transparent",display:"flex",alignItems:"center",gap:6}}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:18,fontWeight:500,letterSpacing:2}}>{now.toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:1}}>{now.toLocaleDateString("pt-PT",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,maxWidth:1280,width:"100%",margin:"0 auto",padding:"28px 24px"}}>
        {loading?<Spinner/>:<>

        {view==="dashboard"&&<div>
          <div style={{marginBottom:22}}>
            <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Dashboard</h1>
            <p style={{color:C.muted,fontSize:13,marginTop:3}}>Resumo de actividade — hoje e acumulado</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            <Stat label="Horas Hoje" value={fmtH(totalHrsToday)} sub={`${todayPontos.length} registos hoje`}/>
            <Stat label="Em Obra Agora" value={activeSessions.length} sub="sessões abertas" color={C.green}/>
            <Stat label="Ferramentas Fora" value={toolsOut.length} sub="por devolver" color={C.yellow}/>
            <Stat label="Obras Activas" value={obras.length} sub="projectos" color={C.blue}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <Card>
              <CardHead extra={<Badge color={C.green}>{activeSessions.length} activos</Badge>}><Dot color={C.green}/>Sessões Activas</CardHead>
              {activeSessions.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Nenhuma sessão activa</div>
              :activeSessions.map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<div key={p.id} style={{padding:"11px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontWeight:600,fontSize:14}}>{emp?.name}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{obra?.name} · {obra?.location}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.green}}>{fmtH(durMs(p.clock_in,null))}</div><div style={{fontSize:10,color:C.dim,marginTop:2}}>desde {fmtT(p.clock_in)}</div></div></div>;})}
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.yellow}>{toolsOut.length}</Badge>}><Dot color={C.yellow}/>Ferramentas em Falta</CardHead>
              {toolsOut.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Todas devolvidas ✓</div>
              :toolsOut.map(r=>{const emp=getEmp(r.employee_id);const tool=getTool(r.tool_id);const obra=getObra(r.obra_id);return<div key={r.id} style={{padding:"11px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontWeight:600,fontSize:14}}>{tool?.name}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{emp?.name} · {obra?.name}</div></div><div style={{fontSize:11,color:C.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{fmtD(r.date)}</div></div>;})}
            </Card>
          </div>
          <Card>
            <CardHead>Últimos Registos de Ponto</CardHead>
            {pontos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum registo ainda — vai a <strong style={{color:C.orange}}>Ponto</strong> para registar entradas</div>
            :<div style={{overflowX:"auto"}}><table><thead><tr><th>Funcionário</th><th>Função</th><th>Obra</th><th>Data</th><th>Entrada</th><th>Saída</th><th>Duração</th><th>Estado</th></tr></thead>
            <tbody>{pontos.slice(0,12).map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<tr key={p.id}><td style={{fontWeight:600}}>{emp?.name||"—"}</td><td style={{color:C.muted}}>{emp?.role||"—"}</td><td style={{color:C.muted}}>{obra?.name||"—"}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.dim}}>{fmtD(p.clock_in)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td><td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td><td>{p.clock_out?<Badge color={C.dim}>Encerrado</Badge>:<Badge color={C.green}>Em obra</Badge>}</td></tr>;})}</tbody></table></div>}
          </Card>
        </div>}

        {view==="ponto"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Registo de Ponto</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Marcar entrada e saída por funcionário e obra</p></div>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:22}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:18,color:C.muted}}>Marcar Ponto</div>
              <div style={{marginBottom:14}}><Label>Funcionário</Label><Sel value={pEmp} onChange={v=>{setPEmp(v);setPObra("");}}><option value="">Seleccionar funcionário...</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}</Sel></div>
              {selectedEmp&&<div style={{background:selectedEmpActive?C.greenD:C.s3,border:`1px solid ${selectedEmpActive?C.green+"44":C.border}`,borderRadius:6,padding:"11px 14px",marginBottom:14}}>
                {selectedEmpActive?<><div style={{color:C.green,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}><Dot color={C.green}/>Sessão Activa</div><div style={{fontSize:13,fontWeight:600}}>{getObra(selectedEmpActive.obra_id)?.name}</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>Entrada: {fmtT(selectedEmpActive.clock_in)} · {fmtH(durMs(selectedEmpActive.clock_in,null))} decorridas</div></>:<div style={{fontSize:12,color:C.muted}}>Sem sessão activa</div>}
              </div>}
              {!selectedEmpActive&&pEmp&&<div style={{marginBottom:18}}><Label>Obra</Label><Sel value={pObra} onChange={setPObra}><option value="">Seleccionar obra...</option>{obras.map(o=><option key={o.id} value={o.id}>{o.name} — {o.location}</option>)}</Sel></div>}
              <Btn onClick={handlePonto} disabled={!pEmp||(!selectedEmpActive&&!pObra)||saving} variant={selectedEmpActive?"red":"primary"} style={{width:"100%",padding:"13px",fontSize:14,letterSpacing:2}}>
                {saving?"A guardar...":selectedEmpActive?"⏹  Registar Saída":"▶  Registar Entrada"}
              </Btn>
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.orange}>{todayPontos.length} hoje</Badge>}>Registos de Hoje</CardHead>
              {todayPontos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum registo hoje</div>
              :<div style={{overflowX:"auto"}}><table><thead><tr><th>Funcionário</th><th>Função</th><th>Obra</th><th>Entrada</th><th>Saída</th><th>Horas</th></tr></thead>
              <tbody>{todayPontos.map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<tr key={p.id}><td style={{fontWeight:600}}>{emp?.name}</td><td style={{color:C.muted}}>{emp?.role}</td><td style={{color:C.muted}}>{obra?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td><td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td></tr>;})}</tbody></table></div>}
            </Card>
          </div>
        </div>}

        {view==="ferramentas"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Ferramentas</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Levantamento e devolução de ferramentas do armazém</p></div>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:22}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:18,color:C.muted}}>Registar Levantamento</div>
              {[{label:"Funcionário",value:fEmp,set:setFEmp,opts:employees.map(e=>({v:e.id,l:`${e.name} — ${e.role}`}))},{label:"Obra",value:fObra,set:setFObra,opts:obras.map(o=>({v:o.id,l:`${o.name} — ${o.location}`}))},{label:"Ferramenta",value:fTool,set:setFTool,opts:tools.map(t=>({v:t.id,l:`${t.name} (${t.category})`}))}].map(({label,value,set,opts})=>(<div key={label} style={{marginBottom:13}}><Label>{label}</Label><Sel value={value} onChange={set}><option value="">Seleccionar {label.toLowerCase()}...</option>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</Sel></div>))}
              <div style={{marginBottom:18}}><Label>Quantidade</Label><Inp type="number" value={fQty} onChange={setFQty} placeholder="1"/></div>
              <Btn onClick={handleFer} disabled={!fEmp||!fObra||!fTool||saving} style={{width:"100%",padding:"13px",fontSize:14,letterSpacing:2}}>{saving?"A guardar...":"+ Registar Levantamento"}</Btn>
            </Card>
            <div>
              <Card style={{marginBottom:18}}>
                <CardHead extra={<Badge color={C.yellow}>{toolsOut.length} por devolver</Badge>}>Por Devolver</CardHead>
                {toolsOut.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Todas devolvidas ✓</div>
                :<div style={{overflowX:"auto"}}><table><thead><tr><th>Ferramenta</th><th>Qtd</th><th>Funcionário</th><th>Obra</th><th>Levantamento</th><th></th></tr></thead>
                <tbody>{toolsOut.map(r=>{const emp=getEmp(r.employee_id);const obra=getObra(r.obra_id);const tool=getTool(r.tool_id);return<tr key={r.id}><td style={{fontWeight:600}}>{tool?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{r.qty}</td><td>{emp?.name}</td><td style={{color:C.muted}}>{obra?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.dim}}>{fmtD(r.date)} {fmtT(r.date)}</td><td><Btn variant="green" onClick={()=>handleDevolver(r.id)} style={{padding:"5px 12px",fontSize:10}}>✓ Devolver</Btn></td></tr>;})}</tbody></table></div>}
              </Card>
              <Card>
                <CardHead>Histórico de Devoluções</CardHead>
                {ferRegs.filter(r=>r.returned_date).length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Sem devoluções ainda</div>
                :<div style={{overflowX:"auto"}}><table><thead><tr><th>Ferramenta</th><th>Funcionário</th><th>Obra</th><th>Levantamento</th><th>Devolução</th></tr></thead>
                <tbody>{ferRegs.filter(r=>r.returned_date).map(r=>{const emp=getEmp(r.employee_id);const obra=getObra(r.obra_id);const tool=getTool(r.tool_id);return<tr key={r.id} style={{opacity:.65}}><td>{tool?.name}</td><td>{emp?.name}</td><td style={{color:C.muted}}>{obra?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{fmtD(r.date)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.green}}>✓ {fmtD(r.returned_date)}</td></tr>;})}</tbody></table></div>}
              </Card>
            </div>
          </div>
        </div>}

        {view==="relatorios"&&<div>
          <div style={{marginBottom:18}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Relatórios</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Análise de horas, presenças e ferramentas</p></div>
          <div style={{display:"flex",gap:2,borderBottom:`1px solid ${C.border}`,marginBottom:22}}>
            {[{id:"geral",l:"Geral"},{id:"funcionario",l:"Por Funcionário"},{id:"obra",l:"Por Obra"}].map(t=>(
              <button key={t.id} onClick={()=>setRTab(t.id)} style={{background:"transparent",border:"none",color:rTab===t.id?C.orange:C.muted,padding:"8px 16px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:rTab===t.id?`2px solid ${C.orange}`:"2px solid transparent",marginBottom:-1}}>{t.l}</button>
            ))}
          </div>
          {rTab==="geral"&&(()=>{
            const done=pontos.filter(p=>p.clock_out);
            const totalMs=done.reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
            const empRank=employees.map(e=>({emp:e,hrs:done.filter(p=>p.employee_id===e.id).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),dias:new Set(pontos.filter(p=>p.employee_id===e.id).map(p=>new Date(p.clock_in).toDateString())).size})).filter(x=>x.hrs>0).sort((a,b)=>b.hrs-a.hrs);
            const obraRank=obras.map(o=>({obra:o,hrs:done.filter(p=>p.obra_id===o.id).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),funcs:new Set(pontos.filter(p=>p.obra_id===o.id).map(p=>p.employee_id)).size})).filter(x=>x.hrs>0).sort((a,b)=>b.hrs-a.hrs);
            return<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
                <Stat label="Total Horas" value={fmtH(totalMs)} sub={`${done.length} registos`}/><Stat label="Funcionários" value={employees.length} sub="registados" color={C.blue}/><Stat label="Obras" value={obras.length} sub="em curso" color={C.green}/><Stat label="Ferramentas" value={ferRegs.length} sub={`${toolsOut.length} por devolver`} color={C.yellow}/>
              </div>
              {empRank.length===0?<Card style={{padding:"24px 20px",textAlign:"center"}}><div style={{color:C.muted}}>Sem registos de ponto ainda.</div></Card>
              :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                <Card><CardHead>Horas por Funcionário</CardHead><table><thead><tr><th>#</th><th>Funcionário</th><th>Função</th><th>Dias</th><th>Total</th></tr></thead><tbody>{empRank.map(({emp,hrs,dias},i)=><tr key={emp.id}><td style={{color:C.dim,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{i+1}</td><td style={{fontWeight:600}}>{emp.name}</td><td style={{color:C.muted}}>{emp.role}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</td></tr>)}</tbody></table></Card>
                <Card><CardHead>Horas por Obra</CardHead><table><thead><tr><th>#</th><th>Obra</th><th>Local</th><th>Funcs.</th><th>Total</th></tr></thead><tbody>{obraRank.map(({obra,hrs,funcs},i)=><tr key={obra.id}><td style={{color:C.dim,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{i+1}</td><td style={{fontWeight:600}}>{obra.name}</td><td style={{color:C.muted}}>{obra.location}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{funcs}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</td></tr>)}</tbody></table></Card>
              </div>}
            </div>;
          })()}
          {rTab==="funcionario"&&<div>
            <div style={{maxWidth:360,marginBottom:20}}><Label>Seleccionar Funcionário</Label><Sel value={rEmp} onChange={setREmp}><option value="">Todos os funcionários</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            {(rEmp?[getEmp(parseInt(rEmp))]:employees).filter(Boolean).map(emp=>{
              const eps=pontos.filter(p=>p.employee_id===emp.id);
              const hrs=eps.filter(p=>p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
              const byObra=obras.map(o=>({obra:o,hrs:eps.filter(p=>p.obra_id===o.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),dias:new Set(eps.filter(p=>p.obra_id===o.id).map(p=>new Date(p.clock_in).toDateString())).size})).filter(x=>x.hrs>0);
              return<Card key={emp.id} style={{marginBottom:16}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17}}>{emp.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{emp.role} · {eps.length} registos</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:22,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</div><div style={{fontSize:10,color:C.dim,marginTop:2}}>{new Set(eps.map(p=>new Date(p.clock_in).toDateString())).size} dias</div></div>
                </div>
                {byObra.length>0?<table><thead><tr><th>Obra</th><th>Local</th><th>Dias</th><th>Horas</th></tr></thead><tbody>{byObra.map(({obra,hrs:h,dias})=><tr key={obra.id}><td style={{fontWeight:600}}>{obra.name}</td><td style={{color:C.muted}}>{obra.location}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(h)}</td></tr>)}</tbody></table>
                :<div style={{padding:"14px 20px",color:C.muted,fontSize:13}}>Sem registos</div>}
              </Card>;
            })}
          </div>}
          {rTab==="obra"&&<div>
            <div style={{maxWidth:360,marginBottom:20}}><Label>Seleccionar Obra</Label><Sel value={rObra} onChange={setRObra}><option value="">Todas as obras</option>{obras.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</Sel></div>
            {(rObra?[getObra(parseInt(rObra))]:obras).filter(Boolean).map(obra=>{
              const ops=pontos.filter(p=>p.obra_id===obra.id);
              const hrs=ops.filter(p=>p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
              const byEmp=employees.map(e=>({emp:e,hrs:ops.filter(p=>p.employee_id===e.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),dias:new Set(ops.filter(p=>p.employee_id===e.id).map(p=>new Date(p.clock_in).toDateString())).size})).filter(x=>x.hrs>0).sort((a,b)=>b.hrs-a.hrs);
              return<Card key={obra.id} style={{marginBottom:16}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17}}>{obra.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{obra.location} · {ops.length} presenças</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:22,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</div><div style={{fontSize:10,color:C.dim,marginTop:2}}>{new Set(ops.map(p=>p.employee_id)).size} funcionários</div></div>
                </div>
                {byEmp.length>0?<table><thead><tr><th>Funcionário</th><th>Função</th><th>Dias</th><th>Horas</th></tr></thead><tbody>{byEmp.map(({emp,hrs:h,dias})=><tr key={emp.id}><td style={{fontWeight:600}}>{emp.name}</td><td style={{color:C.muted}}>{emp.role}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(h)}</td></tr>)}</tbody></table>
                :<div style={{padding:"14px 20px",color:C.muted,fontSize:13}}>Sem registos</div>}
              </Card>;
            })}
          </div>}
        </div>}

        {view==="gestao"&&<div>
          <div style={{marginBottom:18}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Gestão</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Funcionários, obras e ferramentas do armazém</p></div>
          <div style={{display:"flex",gap:2,borderBottom:`1px solid ${C.border}`,marginBottom:22}}>
            {[{id:"funcionarios",l:"Funcionários"},{id:"obras",l:"Obras"},{id:"ferramentas",l:"Ferramentas"}].map(t=>(
              <button key={t.id} onClick={()=>setGTab(t.id)} style={{background:"transparent",border:"none",color:gTab===t.id?C.orange:C.muted,padding:"8px 16px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:gTab===t.id?`2px solid ${C.orange}`:"2px solid transparent",marginBottom:-1}}>{t.l}</button>
            ))}
          </div>
          {gTab==="funcionarios"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar Funcionário</div>
              <div style={{marginBottom:12}}><Label>Nome</Label><Inp value={nEN} onChange={setNEN} placeholder="Nome completo"/></div>
              <div style={{marginBottom:16}}><Label>Função</Label><Inp value={nER} onChange={setNER} placeholder="Ex: Pedreiro, Electricista..."/></div>
              <Btn onClick={addEmp} disabled={!nEN} style={{width:"100%"}}>+ Adicionar</Btn>
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.orange}>{employees.length}</Badge>}>Funcionários</CardHead>
              <table><thead><tr><th>Nome</th><th>Função</th><th>Registos</th><th>Horas Totais</th><th></th></tr></thead>
              <tbody>{employees.map(e=>{const hrs=pontos.filter(p=>p.employee_id===e.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);return<tr key={e.id}><td style={{fontWeight:600}}>{e.name}</td><td style={{color:C.muted}}>{e.role}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{pontos.filter(p=>p.employee_id===e.id).length}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange}}>{fmtH(hrs)}</td><td><button onClick={()=>delEmp(e.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody>
            </table></Card>
          </div>}
          {gTab==="obras"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar Obra</div>
              <div style={{marginBottom:12}}><Label>Nome da Obra</Label><Inp value={nON} onChange={setNON} placeholder="Nome do projecto"/></div>
              <div style={{marginBottom:16}}><Label>Localização</Label><Inp value={nOL} onChange={setNOL} placeholder="Cidade / Localidade"/></div>
              <Btn onClick={addObra} disabled={!nON} style={{width:"100%"}}>+ Adicionar</Btn>
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.orange}>{obras.length}</Badge>}>Obras</CardHead>
              <table><thead><tr><th>Nome</th><th>Local</th><th>Presenças</th><th>Horas Totais</th><th></th></tr></thead>
              <tbody>{obras.map(o=>{const hrs=pontos.filter(p=>p.obra_id===o.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);return<tr key={o.id}><td style={{fontWeight:600}}>{o.name}</td><td style={{color:C.muted}}>{o.location}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{pontos.filter(p=>p.obra_id===o.id).length}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange}}>{fmtH(hrs)}</td><td><button onClick={()=>delObra(o.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody>
            </table></Card>
          </div>}
          {gTab==="ferramentas"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar Ferramenta</div>
              <div style={{marginBottom:12}}><Label>Nome</Label><Inp value={nTN} onChange={setNTN} placeholder="Nome da ferramenta"/></div>
              <div style={{marginBottom:16}}><Label>Categoria</Label><Inp value={nTC} onChange={setNTC} placeholder="Ex: Elétrico, Manual..."/></div>
              <Btn onClick={addTool} disabled={!nTN} style={{width:"100%"}}>+ Adicionar</Btn>
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.orange}>{tools.length}</Badge>}>Ferramentas do Armazém</CardHead>
              <table><thead><tr><th>Nome</th><th>Categoria</th><th>Levantamentos</th><th>Estado</th><th></th></tr></thead>
              <tbody>{tools.map(t=>{const out=toolsOut.filter(r=>r.tool_id===t.id).length;return<tr key={t.id}><td style={{fontWeight:600}}>{t.name}</td><td><Badge color={C.muted}>{t.category}</Badge></td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{ferRegs.filter(r=>r.tool_id===t.id).length}</td><td>{out>0?<Badge color={C.yellow}>{out} fora</Badge>:<Badge color={C.green}>disponível</Badge>}</td><td><button onClick={()=>delTool(t.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody>
            </table></Card>
          </div>}
        </div>}

        </>}
      </div>
    </div>
  </>;
}
