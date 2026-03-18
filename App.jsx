import React, { useState, useEffect, useCallback } from "react";
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
  blue:"#60A5FA", blueD:"rgba(96,165,250,0.12)",
  purple:"#A78BFA", purpleD:"rgba(167,139,250,0.12)",
};

function durMs(a,b){const v=(b?new Date(b):new Date())-new Date(a);return v>0?v:0;}
function fmtH(v){const h=Math.floor(v/3600000),m=Math.floor((v%3600000)/60000);return`${h}h ${String(m).padStart(2,"0")}m`;}
function fmtT(iso){if(!iso)return"—";return new Date(iso).toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit"});}
function fmtD(iso){if(!iso)return"—";return new Date(iso).toLocaleDateString("pt-PT",{day:"2-digit",month:"short",year:"numeric"});}
function isToday(iso){return new Date(iso).toDateString()===new Date().toDateString();}

function Card({children,style={}}){return<div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",...style}}>{children}</div>;}
function CardHead({children,extra}){return<div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:C.muted}}>{children}</div>{extra}</div>;}
function Stat({label,value,sub,color=C.orange}){return<Card style={{padding:"18px 22px"}}><div style={{color:C.muted,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{label}</div><div style={{color,fontSize:30,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,lineHeight:1}}>{value}</div>{sub&&<div style={{color:C.dim,fontSize:11,marginTop:6}}>{sub}</div>}</Card>;}
function Sel({value,onChange,children,style={}}){return<select value={value} onChange={e=>onChange(e.target.value)} style={{background:C.s3,border:`1px solid ${C.border}`,color:value?C.text:C.muted,padding:"9px 12px",borderRadius:6,fontSize:13,fontFamily:"'Barlow',sans-serif",width:"100%",outline:"none",cursor:"pointer",...style}}>{children}</select>;}
function Inp({value,onChange,placeholder,type="text",style={}}){return<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:C.s3,border:`1px solid ${C.border}`,color:C.text,padding:"9px 12px",borderRadius:6,fontSize:13,fontFamily:"'Barlow',sans-serif",width:"100%",outline:"none",...style}}/>;}
function Btn({children,onClick,variant="primary",disabled=false,style={}}){const bg=disabled?C.dim:variant==="primary"?C.orange:variant==="green"?"#22C55E":variant==="red"?"#EF4444":variant==="blue"?C.blue:C.s3;const fg=variant==="ghost"?C.muted:"#000";return<button onClick={disabled?undefined:onClick} style={{background:bg,border:variant==="ghost"?`1px solid ${C.border}`:"none",color:fg,padding:"9px 18px",borderRadius:6,fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,whiteSpace:"nowrap",...style}}>{children}</button>;}
function Badge({children,color=C.orange}){const bg={[C.orange]:C.orangeD,[C.green]:C.greenD,[C.red]:C.redD,[C.yellow]:C.yellowD,[C.blue]:C.blueD,[C.purple]:C.purpleD};return<span style={{background:bg[color]||"rgba(255,255,255,0.07)",color,padding:"2px 9px",borderRadius:99,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{children}</span>;}
function Dot({color}){return<span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 6px ${color}`,marginRight:7}}/>;}
function Label({children}){return<div style={{fontSize:10,color:C.muted,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{children}</div>;}
function Spinner(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60,flexDirection:"column",gap:16}}><div style={{width:32,height:32,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.orange}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><div style={{color:C.muted,fontSize:12,fontFamily:"'Barlow',sans-serif"}}>A carregar...</div><style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style></div>;}

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

// ── ECRÃ DE LOGIN ─────────────────────────────────────────────────────────────
function AuthScreen({onAuth}) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  async function handleSubmit() {
    if(!email||!password){setError("Preenche todos os campos.");return;}
    setLoading(true);setError("");setSuccess("");
    if(mode==="login"){
      const{data,error}=await sb.auth.signInWithPassword({email,password});
      if(error)setError("Email ou password incorrectos.");
      else onAuth(data.user);
    } else {
      if(!name){setError("Introduz o teu nome.");setLoading(false);return;}
      const{data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:name}}});
      if(error)setError(error.message);
      else if(data.user)onAuth(data.user);
      else setSuccess("Verifica o teu email para activar a conta.");
    }
    setLoading(false);
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow',sans-serif",padding:24}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:C.orange,width:60,height:60,borderRadius:14,fontSize:30,marginBottom:16}}>⚙</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:30,letterSpacing:3,textTransform:"uppercase",color:C.text}}>ConstruPonto</div>
          <div style={{fontSize:11,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginTop:4}}>Gestão de Horas & Armazém</div>
        </div>
        <Card style={{padding:28}}>
          <div style={{display:"flex",gap:0,marginBottom:24,background:C.s3,borderRadius:7,padding:3}}>
            {[{id:"login",l:"Entrar"},{id:"register",l:"Nova Conta"}].map(t=>(
              <button key={t.id} onClick={()=>{setMode(t.id);setError("");setSuccess("");}} style={{flex:1,background:mode===t.id?C.s1:"transparent",border:mode===t.id?`1px solid ${C.border}`:"none",color:mode===t.id?C.text:C.muted,padding:"8px 0",borderRadius:5,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.2,textTransform:"uppercase",cursor:"pointer"}}>{t.l}</button>
            ))}
          </div>
          {mode==="register"&&<div style={{marginBottom:14}}><Label>Nome</Label><Inp value={name} onChange={setName} placeholder="O teu nome"/></div>}
          <div style={{marginBottom:14}}><Label>Email</Label><Inp type="email" value={email} onChange={setEmail} placeholder="email@empresa.pt"/></div>
          <div style={{marginBottom:error||success?12:20}}><Label>Password</Label><Inp type="password" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres"/></div>
          {error&&<div style={{background:C.redD,border:`1px solid ${C.red}33`,color:C.red,padding:"9px 14px",borderRadius:6,fontSize:12,marginBottom:16}}>{error}</div>}
          {success&&<div style={{background:C.greenD,border:`1px solid ${C.green}33`,color:C.green,padding:"9px 14px",borderRadius:6,fontSize:12,marginBottom:16}}>{success}</div>}
          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"13px",fontSize:14,letterSpacing:2}}>
            {loading?"A processar...":mode==="login"?"▶  Entrar":"+ Criar Conta"}
          </Btn>
        </Card>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:C.dim}}>Dados seguros e privados por empresa.</div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function ConstruPonto() {
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);

  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{
      if(data.session?.user)loadProfile(data.session.user);
      else setAuthLoading(false);
    });
    const{data:l}=sb.auth.onAuthStateChange((_e,session)=>{
      if(session?.user)loadProfile(session.user);
      else{setUser(null);setProfile(null);}
    });
    return()=>l.subscription.unsubscribe();
  },[]);

  async function loadProfile(u) {
    setUser(u);
    const{data}=await sb.from("profiles").select("*,companies(*)").eq("id",u.id).single();
    if(data){setProfile(data);}
    else{
      // Criar perfil automaticamente como 'pending'
      await sb.from("profiles").insert({id:u.id,role:"pending",display_name:u.user_metadata?.display_name||u.email});
      setProfile({id:u.id,role:"pending",display_name:u.user_metadata?.display_name||u.email});
    }
    setAuthLoading(false);
  }

  async function handleLogout(){await sb.auth.signOut();setUser(null);setProfile(null);}

  if(authLoading)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner/></div>;
  if(!user||!profile)return<AuthScreen onAuth={u=>{loadProfile(u);}}/>;
  if(profile.role==="admin")return<AdminApp user={user} profile={profile} onLogout={handleLogout}/>;
  if(profile.role==="company")return<CompanyApp user={user} profile={profile} onLogout={handleLogout}/>;
  if(profile.role==="employee")return<EmployeeApp user={user} profile={profile} onLogout={handleLogout}/>;
  return<PendingScreen onLogout={handleLogout} profile={profile}/>;
}

// ── ECRÃ PENDENTE ─────────────────────────────────────────────────────────────
function PendingScreen({onLogout,profile}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow',sans-serif"}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Card style={{padding:40,maxWidth:420,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:20}}>⏳</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,marginBottom:12}}>Conta Pendente</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:24,lineHeight:1.6}}>A tua conta <strong style={{color:C.text}}>{profile.display_name}</strong> foi criada mas ainda não foi activada. Aguarda que o administrador te associe a uma empresa.</div>
        <Btn onClick={onLogout} variant="ghost" style={{width:"100%"}}>Sair</Btn>
      </Card>
    </div>
  );
}

// ── PROFILE ROW (componente separado para evitar useState em map) ─────────────
function ProfileRow({p, companies, onActivate}) {
  const [selComp, setSelComp] = useState(p.company_id ? String(p.company_id) : "");
  const [selRole, setSelRole] = useState(p.role);
  return (
    <tr>
      <td style={{fontWeight:600}}>{p.display_name||"—"}</td>
      <td>
        <Sel value={selComp} onChange={setSelComp} style={{minWidth:160,padding:"5px 8px",fontSize:12}}>
          <option value="">Sem empresa</option>
          {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </Sel>
      </td>
      <td>
        <Sel value={selRole} onChange={setSelRole} style={{minWidth:130,padding:"5px 8px",fontSize:12}}>
          <option value="pending">Pendente</option>
          <option value="company">Empresa</option>
          <option value="employee">Funcionário</option>
          <option value="admin">Admin</option>
        </Sel>
      </td>
      <td style={{fontSize:11,color:C.dim}}>{fmtD(p.created_at)}</td>
      <td><Btn variant="green" onClick={()=>onActivate(p.id,selRole,selComp||null)} style={{padding:"5px 12px",fontSize:10}}>Guardar</Btn></td>
    </tr>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── ADMIN APP ─────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function AdminApp({user,profile,onLogout}){
  const [view,setView]=useState("dashboard");
  const [companies,setCompanies]=useState([]);
  const [profiles,setProfiles]=useState([]);
  const [allPontos,setAllPontos]=useState([]);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [now,setNow]=useState(new Date());

  // Criar empresa
  const [nCName,setNCName]=useState("");
  const [nCEmail,setNCEmail]=useState("");
  const [creating,setCreating]=useState(false);

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const loadAll=useCallback(async()=>{
    setLoading(true);
    const[c,p,po]=await Promise.all([
      sb.from("companies").select("*").order("name"),
      sb.from("profiles").select("*,companies(name)").order("created_at",{ascending:false}),
      sb.from("pontos").select("*").order("clock_in",{ascending:false}).limit(50),
    ]);
    if(c.data)setCompanies(c.data);
    if(p.data)setProfiles(p.data);
    if(po.data)setAllPontos(po.data);
    setLoading(false);
  },[]);

  useEffect(()=>{loadAll();},[loadAll]);

  function showToast(msg,color=C.green){setToast({msg,color});setTimeout(()=>setToast(null),2800);}

  async function createCompany(){
    if(!nCName){showToast("Introduz o nome da empresa.",C.red);return;}
    setCreating(true);
    const{data:comp,error:compErr}=await sb.from("companies").insert({name:nCName,email:nCEmail||null}).select().single();
    if(compErr){showToast("Erro: "+compErr.message,C.red);setCreating(false);return;}
    showToast(`Empresa "${nCName}" criada! ✓`);
    setNCName("");setNCEmail("");
    await loadAll();
    setCreating(false);
  }

  async function activateProfile(profileId,role,companyId){
    const{error}=await sb.from("profiles").update({role,company_id:companyId||null}).eq("id",profileId);
    if(!error){showToast("Perfil actualizado ✓");await loadAll();}
    else showToast("Erro: "+error.message,C.red);
  }

  async function deleteCompany(id){
    if(!window.confirm("Apagar empresa e todos os seus dados?"))return;
    await sb.from("companies").delete().eq("id",id);
    await loadAll();showToast("Empresa apagada",C.red);
  }

  const pendingProfiles=profiles.filter(p=>p.role==="pending");
  const totalHorasHoje=allPontos.filter(p=>isToday(p.clock_in)&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);

  const nav=[{id:"dashboard",icon:"◈",label:"Dashboard"},{id:"empresas",icon:"🏢",label:"Empresas"},{id:"utilizadores",icon:"👥",label:"Utilizadores"},{id:"atividade",icon:"◉",label:"Actividade"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      {toast&&<div style={{position:"fixed",bottom:24,right:24,background:C.s2,border:`1px solid ${toast.color}44`,color:toast.color,padding:"12px 20px",borderRadius:8,fontFamily:"'Barlow',sans-serif",fontSize:13,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",maxWidth:360}}>{toast.msg}</div>}

      {/* HEADER */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",flexShrink:0}}>
            <div style={{background:C.orange,color:"#000",width:34,height:34,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900}}>⚙</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,letterSpacing:2.5,textTransform:"uppercase"}}>ConstruPonto</div>
              <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:C.orange,fontFamily:"'Barlow Condensed',sans-serif"}}>● Administrador</div>
            </div>
          </div>
          <div style={{display:"flex",flex:1}}>
            {nav.map(n=>(
              <button key={n.id} onClick={()=>setView(n.id)} style={{background:"transparent",border:"none",color:view===n.id?C.orange:C.muted,padding:"15px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:view===n.id?`2px solid ${C.orange}`:"2px solid transparent",display:"flex",alignItems:"center",gap:6}}>
                {n.icon} {n.label}
                {n.id==="utilizadores"&&pendingProfiles.length>0&&<span style={{background:C.red,color:"#fff",borderRadius:99,fontSize:9,padding:"1px 6px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{pendingProfiles.length}</span>}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:15,fontWeight:500,letterSpacing:2}}>{now.toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 12px",borderRadius:5,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Sair</button>
          </div>
        </div>
      </div>

      <div style={{flex:1,maxWidth:1280,width:"100%",margin:"0 auto",padding:"28px 24px"}}>
        {loading?<Spinner/>:<>

        {/* DASHBOARD ADMIN */}
        {view==="dashboard"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Painel de Administração</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Visão geral de todas as empresas</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            <Stat label="Empresas" value={companies.length} sub="registadas" color={C.blue}/>
            <Stat label="Utilizadores" value={profiles.length} sub={`${pendingProfiles.length} pendentes`} color={C.purple}/>
            <Stat label="Horas Hoje" value={fmtH(totalHorasHoje)} sub="todas as empresas"/>
            <Stat label="Pendentes" value={pendingProfiles.length} sub="aguardam activação" color={pendingProfiles.length>0?C.red:C.green}/>
          </div>

          {pendingProfiles.length>0&&<Card style={{marginBottom:18,border:`1px solid ${C.red}33`}}>
            <CardHead extra={<Badge color={C.red}>{pendingProfiles.length} pendentes</Badge>}><Dot color={C.red}/>Utilizadores a Aguardar Activação</CardHead>
            <table><thead><tr><th>Nome</th><th>Registado em</th><th>Associar a Empresa</th><th>Nível</th><th></th></tr></thead>
            <tbody>{pendingProfiles.map(p=><ProfileRow key={p.id} p={p} companies={companies} onActivate={activateProfile}/>)}</tbody>
          </Card>}

          <Card>
            <CardHead>Empresas Registadas</CardHead>
            {companies.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhuma empresa ainda. Vai a <strong style={{color:C.orange}}>Empresas</strong> para criar.</div>
            :<table><thead><tr><th>Empresa</th><th>Email</th><th>Utilizadores</th><th>Registada em</th><th></th></tr></thead>
            <tbody>{companies.map(c=>{
              const users=profiles.filter(p=>p.company_id===c.id);
              return<tr key={c.id}>
                <td style={{fontWeight:600}}>{c.name}</td>
                <td style={{color:C.muted,fontSize:12}}>{c.email||"—"}</td>
                <td><Badge color={C.blue}>{users.length} users</Badge></td>
                <td style={{fontSize:11,color:C.dim}}>{fmtD(c.created_at)}</td>
                <td><button onClick={()=>deleteCompany(c.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16}}>×</button></td>
              </tr>;
            })}</tbody></table>}
          </Card>
        </div>}

        {/* EMPRESAS */}
        {view==="empresas"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Gestão de Empresas</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Criar e gerir empresas clientes</p></div>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:22}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:18,color:C.muted}}>Nova Empresa</div>
              <div style={{marginBottom:13}}><Label>Nome da Empresa</Label><Inp value={nCName} onChange={setNCName} placeholder="Ex: Construções Silva Lda"/></div>
              <div style={{marginBottom:13}}><Label>Email de Contacto</Label><Inp type="email" value={nCEmail} onChange={setNCEmail} placeholder="empresa@email.pt"/></div>
              <div style={{marginBottom:18,padding:"11px 14px",background:C.s3,borderRadius:6,fontSize:11,color:C.muted,lineHeight:1.6}}>
                💡 Após criar a empresa, o responsável deve <strong style={{color:C.text}}>registar-se no app</strong> com o email indicado. Depois activas aqui na tab Utilizadores.
              </div>
              <Btn onClick={createCompany} disabled={creating||!nCName} style={{width:"100%",padding:"13px",fontSize:14}}>
                {creating?"A criar...":"+ Criar Empresa"}
              </Btn>
            </Card>
            <Card>
              <CardHead extra={<Badge color={C.blue}>{companies.length}</Badge>}>Empresas</CardHead>
              {companies.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhuma empresa ainda</div>
              :<table><thead><tr><th>Nome</th><th>Email</th><th>Utilizadores</th><th>Registada</th><th></th></tr></thead>
              <tbody>{companies.map(c=>{
                const users=profiles.filter(p=>p.company_id===c.id);
                return<tr key={c.id}>
                  <td style={{fontWeight:600}}>{c.name}</td>
                  <td style={{color:C.muted,fontSize:12}}>{c.email||"—"}</td>
                  <td>{users.map(u=><Badge key={u.id} color={C.muted} style={{marginRight:4}}>{u.display_name}</Badge>)}</td>
                  <td style={{fontSize:11,color:C.dim}}>{fmtD(c.created_at)}</td>
                  <td><button onClick={()=>deleteCompany(c.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td>
                </tr>;
              })}</tbody></table>}
            </Card>
          </div>
        </div>}

        {/* UTILIZADORES */}
        {view==="utilizadores"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Utilizadores</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Gerir níveis de acesso</p></div>
          <Card>
            <CardHead extra={<Badge color={C.purple}>{profiles.length}</Badge>}>Todos os Utilizadores</CardHead>
            {profiles.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum utilizador ainda</div>
            :<table><thead><tr><th>Nome</th><th>Empresa</th><th>Nível</th><th>Registado</th><th>Acções</th></tr></thead>
            <tbody>{profiles.map(p=><ProfileRow key={p.id} p={p} companies={companies} onActivate={activateProfile}/>)}</tbody></table>}
          </Card>
        </div>}

        {/* ACTIVIDADE */}
        {view==="atividade"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Actividade Global</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>Últimos registos de ponto de todas as empresas</p></div>
          <Card>
            <CardHead extra={<Badge color={C.orange}>{allPontos.length} registos</Badge>}>Registos Recentes</CardHead>
            {allPontos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum registo ainda</div>
            :<div style={{overflowX:"auto"}}><table><thead><tr><th>Data</th><th>Entrada</th><th>Saída</th><th>Duração</th><th>Estado</th></tr></thead>
            <tbody>{allPontos.slice(0,30).map(p=>(
              <tr key={p.id}>
                <td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.dim}}>{fmtD(p.clock_in)}</td>
                <td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td>
                <td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td>
                <td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td>
                <td>{p.clock_out?<Badge color={C.dim}>Encerrado</Badge>:<Badge color={C.green}>Em obra</Badge>}</td>
              </tr>
            ))}</tbody></table></div>}
          </Card>
        </div>}

        </>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── COMPANY APP ───────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function CompanyApp({user,profile,onLogout}){
  const companyId=profile.company_id;
  const companyName=profile.companies?.name||"Empresa";
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
    if(!companyId)return;
    setLoading(true);
    const[e,o,t,p,f]=await Promise.all([
      sb.from("employees").select("*").eq("company_id",companyId).order("name"),
      sb.from("obras").select("*").eq("company_id",companyId).order("name"),
      sb.from("tools").select("*").eq("company_id",companyId).order("name"),
      sb.from("pontos").select("*").eq("company_id",companyId).order("clock_in",{ascending:false}),
      sb.from("ferramentas").select("*").eq("company_id",companyId).order("date",{ascending:false}),
    ]);
    if(e.data)setEmployees(e.data);
    if(o.data)setObras(o.data);
    if(t.data)setTools(t.data);
    if(p.data)setPontos(p.data);
    if(f.data)setFerRegs(f.data);
    setLoading(false);
  },[companyId]);

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
    if(!pEmp||saving)return;setSaving(true);
    const empId=parseInt(pEmp);const active=activeFor(empId);
    if(active){
      const{error}=await sb.from("pontos").update({clock_out:new Date().toISOString()}).eq("id",active.id);
      if(!error){showToast(`Saída — ${getEmp(empId)?.name}`);await loadAll();}else showToast("Erro",C.red);
    }else{
      if(!pObra){setSaving(false);return;}
      const{error}=await sb.from("pontos").insert({employee_id:empId,obra_id:parseInt(pObra),clock_in:new Date().toISOString(),company_id:companyId,user_id:user.id});
      if(!error){showToast(`Entrada — ${getEmp(empId)?.name}`);await loadAll();}else showToast("Erro",C.red);
    }
    setSaving(false);
  }
  async function handleFer(){
    if(!fEmp||!fObra||!fTool||saving)return;setSaving(true);
    const{error}=await sb.from("ferramentas").insert({employee_id:parseInt(fEmp),obra_id:parseInt(fObra),tool_id:parseInt(fTool),qty:parseInt(fQty)||1,date:new Date().toISOString(),company_id:companyId,user_id:user.id});
    if(!error){showToast(`${getTool(parseInt(fTool))?.name} registada`);setFTool("");setFQty(1);await loadAll();}else showToast("Erro",C.red);
    setSaving(false);
  }
  async function handleDevolver(id){const{error}=await sb.from("ferramentas").update({returned_date:new Date().toISOString()}).eq("id",id);if(!error){showToast("Devolvida ✓");await loadAll();}else showToast("Erro",C.red);}
  async function addEmp(){if(!nEN)return;const{error}=await sb.from("employees").insert({name:nEN,role:nER,company_id:companyId,user_id:user.id});if(!error){setNEN("");setNER("");showToast("Funcionário adicionado");await loadAll();}else showToast("Erro",C.red);}
  async function addObra(){if(!nON)return;const{error}=await sb.from("obras").insert({name:nON,location:nOL,company_id:companyId,user_id:user.id});if(!error){setNON("");setNOL("");showToast("Obra adicionada");await loadAll();}else showToast("Erro",C.red);}
  async function addTool(){if(!nTN)return;const{error}=await sb.from("tools").insert({name:nTN,category:nTC,company_id:companyId,user_id:user.id});if(!error){setNTN("");setNTC("");showToast("Ferramenta adicionada");await loadAll();}else showToast("Erro",C.red);}
  async function delEmp(id){if(!window.confirm("Apagar?"))return;await sb.from("employees").delete().eq("id",id);await loadAll();}
  async function delObra(id){if(!window.confirm("Apagar?"))return;await sb.from("obras").delete().eq("id",id);await loadAll();}
  async function delTool(id){if(!window.confirm("Apagar?"))return;await sb.from("tools").delete().eq("id",id);await loadAll();}

  const selectedEmpActive=pEmp?activeFor(parseInt(pEmp)):null;
  const selectedEmp=pEmp?getEmp(parseInt(pEmp)):null;
  const nav=[{id:"dashboard",icon:"◈",label:"Dashboard"},{id:"ponto",icon:"⏱",label:"Ponto"},{id:"ferramentas",icon:"⚒",label:"Ferramentas"},{id:"relatorios",icon:"◉",label:"Relatórios"},{id:"gestao",icon:"⚙",label:"Gestão"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      {toast&&<div style={{position:"fixed",bottom:24,right:24,background:C.s2,border:`1px solid ${toast.color}44`,color:toast.color,padding:"12px 20px",borderRadius:8,fontSize:13,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{toast.msg}</div>}

      <div style={{background:C.s1,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",flexShrink:0}}>
            <div style={{background:C.orange,color:"#000",width:34,height:34,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900}}>⚙</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,letterSpacing:2.5,textTransform:"uppercase"}}>ConstruPonto</div>
              <div style={{fontSize:9,color:C.blue,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif"}}>● {companyName}</div>
            </div>
          </div>
          <div style={{display:"flex",flex:1}}>
            {nav.map(n=>(<button key={n.id} onClick={()=>setView(n.id)} style={{background:"transparent",border:"none",color:view===n.id?C.orange:C.muted,padding:"15px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:view===n.id?`2px solid ${C.orange}`:"2px solid transparent",display:"flex",alignItems:"center",gap:6}}>{n.icon} {n.label}</button>))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:15,fontWeight:500,letterSpacing:2}}>{now.toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 12px",borderRadius:5,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Sair</button>
          </div>
        </div>
      </div>

      <div style={{flex:1,maxWidth:1280,width:"100%",margin:"0 auto",padding:"28px 24px"}}>
        {!companyId?<Card style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:16}}>⏳</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,marginBottom:8}}>Conta ainda não associada</div><div style={{color:C.muted,fontSize:13}}>O administrador ainda não associou a tua conta a uma empresa. Aguarda activação.</div></Card>
        :loading?<Spinner/>:<>

        {view==="dashboard"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Dashboard</h1><p style={{color:C.muted,fontSize:13,marginTop:3}}>{companyName} — actividade de hoje e acumulado</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            <Stat label="Horas Hoje" value={fmtH(totalHrsToday)} sub={`${todayPontos.length} registos`}/>
            <Stat label="Em Obra" value={activeSessions.length} sub="agora" color={C.green}/>
            <Stat label="Ferramentas Fora" value={toolsOut.length} sub="por devolver" color={C.yellow}/>
            <Stat label="Obras" value={obras.length} sub="activas" color={C.blue}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <Card><CardHead extra={<Badge color={C.green}>{activeSessions.length}</Badge>}><Dot color={C.green}/>Em Obra</CardHead>
              {activeSessions.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Ninguém em obra</div>
              :activeSessions.map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<div key={p.id} style={{padding:"11px 20px",display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontWeight:600}}>{emp?.name}</div><div style={{fontSize:11,color:C.muted}}>{obra?.name}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.green}}>{fmtH(durMs(p.clock_in,null))}</div><div style={{fontSize:10,color:C.dim}}>desde {fmtT(p.clock_in)}</div></div></div>;})}
            </Card>
            <Card><CardHead extra={<Badge color={C.yellow}>{toolsOut.length}</Badge>}><Dot color={C.yellow}/>Ferramentas Fora</CardHead>
              {toolsOut.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Todas devolvidas ✓</div>
              :toolsOut.map(r=>{const emp=getEmp(r.employee_id);const tool=getTool(r.tool_id);return<div key={r.id} style={{padding:"11px 20px",display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontWeight:600}}>{tool?.name}</div><div style={{fontSize:11,color:C.muted}}>{emp?.name}</div></div><div style={{fontSize:11,color:C.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{fmtD(r.date)}</div></div>;})}
            </Card>
          </div>
          <Card><CardHead>Últimos Registos</CardHead>
            {pontos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Sem registos — vai a <strong style={{color:C.orange}}>Ponto</strong></div>
            :<div style={{overflowX:"auto"}}><table><thead><tr><th>Funcionário</th><th>Obra</th><th>Data</th><th>Entrada</th><th>Saída</th><th>Duração</th></tr></thead>
            <tbody>{pontos.slice(0,10).map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<tr key={p.id}><td style={{fontWeight:600}}>{emp?.name||"—"}</td><td style={{color:C.muted}}>{obra?.name||"—"}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.dim}}>{fmtD(p.clock_in)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td><td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td></tr>;})}</tbody></table></div>}
          </Card>
        </div>}

        {view==="ponto"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Registo de Ponto</h1></div>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:22}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:18,color:C.muted}}>Marcar Ponto</div>
              <div style={{marginBottom:14}}><Label>Funcionário</Label><Sel value={pEmp} onChange={v=>{setPEmp(v);setPObra("");}}><option value="">Seleccionar...</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}</Sel></div>
              {selectedEmp&&<div style={{background:selectedEmpActive?C.greenD:C.s3,border:`1px solid ${selectedEmpActive?C.green+"44":C.border}`,borderRadius:6,padding:"11px 14px",marginBottom:14}}>
                {selectedEmpActive?<><div style={{color:C.green,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}><Dot color={C.green}/>Sessão Activa</div><div style={{fontSize:13,fontWeight:600}}>{getObra(selectedEmpActive.obra_id)?.name}</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>Desde {fmtT(selectedEmpActive.clock_in)} · {fmtH(durMs(selectedEmpActive.clock_in,null))}</div></>:<div style={{fontSize:12,color:C.muted}}>Sem sessão activa</div>}
              </div>}
              {!selectedEmpActive&&pEmp&&<div style={{marginBottom:18}}><Label>Obra</Label><Sel value={pObra} onChange={setPObra}><option value="">Seleccionar...</option>{obras.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</Sel></div>}
              <Btn onClick={handlePonto} disabled={!pEmp||(!selectedEmpActive&&!pObra)||saving} variant={selectedEmpActive?"red":"primary"} style={{width:"100%",padding:"13px",fontSize:14,letterSpacing:2}}>{saving?"A guardar...":selectedEmpActive?"⏹  Registar Saída":"▶  Registar Entrada"}</Btn>
            </Card>
            <Card><CardHead extra={<Badge color={C.orange}>{todayPontos.length} hoje</Badge>}>Hoje</CardHead>
              {todayPontos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum registo hoje</div>
              :<div style={{overflowX:"auto"}}><table><thead><tr><th>Funcionário</th><th>Obra</th><th>Entrada</th><th>Saída</th><th>Horas</th></tr></thead>
              <tbody>{todayPontos.map(p=>{const emp=getEmp(p.employee_id);const obra=getObra(p.obra_id);return<tr key={p.id}><td style={{fontWeight:600}}>{emp?.name}</td><td style={{color:C.muted}}>{obra?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td><td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td></tr>;})}</tbody></table></div>}
            </Card>
          </div>
        </div>}

        {view==="ferramentas"&&<div>
          <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Ferramentas</h1></div>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:22}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:18,color:C.muted}}>Registar Levantamento</div>
              {[{label:"Funcionário",value:fEmp,set:setFEmp,opts:employees.map(e=>({v:e.id,l:`${e.name} — ${e.role}`}))},{label:"Obra",value:fObra,set:setFObra,opts:obras.map(o=>({v:o.id,l:o.name}))},{label:"Ferramenta",value:fTool,set:setFTool,opts:tools.map(t=>({v:t.id,l:`${t.name} (${t.category})`}))}].map(({label,value,set,opts})=>(<div key={label} style={{marginBottom:13}}><Label>{label}</Label><Sel value={value} onChange={set}><option value="">Seleccionar...</option>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</Sel></div>))}
              <div style={{marginBottom:18}}><Label>Quantidade</Label><Inp type="number" value={fQty} onChange={setFQty} placeholder="1"/></div>
              <Btn onClick={handleFer} disabled={!fEmp||!fObra||!fTool||saving} style={{width:"100%",padding:"13px",fontSize:14}}>{saving?"A guardar...":"+ Registar"}</Btn>
            </Card>
            <div>
              <Card style={{marginBottom:18}}><CardHead extra={<Badge color={C.yellow}>{toolsOut.length}</Badge>}>Por Devolver</CardHead>
                {toolsOut.length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Todas devolvidas ✓</div>
                :<div style={{overflowX:"auto"}}><table><thead><tr><th>Ferramenta</th><th>Qtd</th><th>Funcionário</th><th>Obra</th><th>Data</th><th></th></tr></thead>
                <tbody>{toolsOut.map(r=>{const emp=getEmp(r.employee_id);const obra=getObra(r.obra_id);const tool=getTool(r.tool_id);return<tr key={r.id}><td style={{fontWeight:600}}>{tool?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{r.qty}</td><td>{emp?.name}</td><td style={{color:C.muted}}>{obra?.name}</td><td style={{fontSize:11,color:C.dim}}>{fmtD(r.date)}</td><td><Btn variant="green" onClick={()=>handleDevolver(r.id)} style={{padding:"5px 12px",fontSize:10}}>✓ Devolver</Btn></td></tr>;})}</tbody></table></div>}
              </Card>
              <Card><CardHead>Histórico</CardHead>
                {ferRegs.filter(r=>r.returned_date).length===0?<div style={{padding:"18px 20px",color:C.muted,fontSize:13}}>Sem devoluções</div>
                :<div style={{overflowX:"auto"}}><table><thead><tr><th>Ferramenta</th><th>Funcionário</th><th>Levantamento</th><th>Devolução</th></tr></thead>
                <tbody>{ferRegs.filter(r=>r.returned_date).map(r=>{const emp=getEmp(r.employee_id);const tool=getTool(r.tool_id);return<tr key={r.id} style={{opacity:.65}}><td>{tool?.name}</td><td>{emp?.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{fmtD(r.date)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.green}}>✓ {fmtD(r.returned_date)}</td></tr>;})}</tbody></table></div>}
              </Card>
            </div>
          </div>
        </div>}

        {view==="relatorios"&&<div>
          <div style={{marginBottom:18}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Relatórios</h1></div>
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
                <Stat label="Total Horas" value={fmtH(totalMs)} sub={`${done.length} registos`}/><Stat label="Funcionários" value={employees.length} color={C.blue}/><Stat label="Obras" value={obras.length} color={C.green}/><Stat label="Ferramentas" value={ferRegs.length} sub={`${toolsOut.length} fora`} color={C.yellow}/>
              </div>
              {empRank.length===0?<Card style={{padding:"24px 20px",textAlign:"center"}}><div style={{color:C.muted}}>Sem registos ainda.</div></Card>
              :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                <Card><CardHead>Por Funcionário</CardHead><table><thead><tr><th>#</th><th>Nome</th><th>Dias</th><th>Total</th></tr></thead><tbody>{empRank.map(({emp,hrs,dias},i)=><tr key={emp.id}><td style={{color:C.dim,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{i+1}</td><td style={{fontWeight:600}}>{emp.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</td></tr>)}</tbody></table></Card>
                <Card><CardHead>Por Obra</CardHead><table><thead><tr><th>#</th><th>Obra</th><th>Funcs.</th><th>Total</th></tr></thead><tbody>{obraRank.map(({obra,hrs,funcs},i)=><tr key={obra.id}><td style={{color:C.dim,fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{i+1}</td><td style={{fontWeight:600}}>{obra.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{funcs}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</td></tr>)}</tbody></table></Card>
              </div>}
            </div>;
          })()}
          {rTab==="funcionario"&&<div>
            <div style={{maxWidth:360,marginBottom:20}}><Label>Funcionário</Label><Sel value={rEmp} onChange={setREmp}><option value="">Todos</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            {(rEmp?[getEmp(parseInt(rEmp))]:employees).filter(Boolean).map(emp=>{
              const eps=pontos.filter(p=>p.employee_id===emp.id);
              const hrs=eps.filter(p=>p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
              const byObra=obras.map(o=>({obra:o,hrs:eps.filter(p=>p.obra_id===o.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),dias:new Set(eps.filter(p=>p.obra_id===o.id).map(p=>new Date(p.clock_in).toDateString())).size})).filter(x=>x.hrs>0);
              return<Card key={emp.id} style={{marginBottom:16}}><div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17}}>{emp.name}</div><div style={{fontSize:12,color:C.muted}}>{emp.role} · {eps.length} registos</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:22,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</div></div></div>
              {byObra.length>0?<table><thead><tr><th>Obra</th><th>Dias</th><th>Horas</th></tr></thead><tbody>{byObra.map(({obra,hrs:h,dias})=><tr key={obra.id}><td style={{fontWeight:600}}>{obra.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(h)}</td></tr>)}</tbody></table>:<div style={{padding:"14px 20px",color:C.muted,fontSize:13}}>Sem registos</div>}
              </Card>;
            })}
          </div>}
          {rTab==="obra"&&<div>
            <div style={{maxWidth:360,marginBottom:20}}><Label>Obra</Label><Sel value={rObra} onChange={setRObra}><option value="">Todas</option>{obras.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</Sel></div>
            {(rObra?[getObra(parseInt(rObra))]:obras).filter(Boolean).map(obra=>{
              const ops=pontos.filter(p=>p.obra_id===obra.id);
              const hrs=ops.filter(p=>p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
              const byEmp=employees.map(e=>({emp:e,hrs:ops.filter(p=>p.employee_id===e.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0),dias:new Set(ops.filter(p=>p.employee_id===e.id).map(p=>new Date(p.clock_in).toDateString())).size})).filter(x=>x.hrs>0).sort((a,b)=>b.hrs-a.hrs);
              return<Card key={obra.id} style={{marginBottom:16}}><div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17}}>{obra.name}</div><div style={{fontSize:12,color:C.muted}}>{obra.location} · {ops.length} presenças</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:22,color:C.orange,fontWeight:500}}>{fmtH(hrs)}</div></div></div>
              {byEmp.length>0?<table><thead><tr><th>Funcionário</th><th>Dias</th><th>Horas</th></tr></thead><tbody>{byEmp.map(({emp,hrs:h,dias})=><tr key={emp.id}><td style={{fontWeight:600}}>{emp.name}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{dias}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(h)}</td></tr>)}</tbody></table>:<div style={{padding:"14px 20px",color:C.muted,fontSize:13}}>Sem registos</div>}
              </Card>;
            })}
          </div>}
        </div>}

        {view==="gestao"&&<div>
          <div style={{marginBottom:18}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700}}>Gestão</h1></div>
          <div style={{display:"flex",gap:2,borderBottom:`1px solid ${C.border}`,marginBottom:22}}>
            {[{id:"funcionarios",l:"Funcionários"},{id:"obras",l:"Obras"},{id:"ferramentas",l:"Ferramentas"}].map(t=>(<button key={t.id} onClick={()=>setGTab(t.id)} style={{background:"transparent",border:"none",color:gTab===t.id?C.orange:C.muted,padding:"8px 16px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",borderBottom:gTab===t.id?`2px solid ${C.orange}`:"2px solid transparent",marginBottom:-1}}>{t.l}</button>))}
          </div>
          {gTab==="funcionarios"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar</div><div style={{marginBottom:12}}><Label>Nome</Label><Inp value={nEN} onChange={setNEN} placeholder="Nome completo"/></div><div style={{marginBottom:16}}><Label>Função</Label><Inp value={nER} onChange={setNER} placeholder="Ex: Pedreiro"/></div><Btn onClick={addEmp} disabled={!nEN} style={{width:"100%"}}>+ Adicionar</Btn></Card>
            <Card><CardHead extra={<Badge color={C.orange}>{employees.length}</Badge>}>Funcionários</CardHead><table><thead><tr><th>Nome</th><th>Função</th><th>Registos</th><th>Horas</th><th></th></tr></thead><tbody>{employees.map(e=>{const hrs=pontos.filter(p=>p.employee_id===e.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);return<tr key={e.id}><td style={{fontWeight:600}}>{e.name}</td><td style={{color:C.muted}}>{e.role}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{pontos.filter(p=>p.employee_id===e.id).length}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange}}>{fmtH(hrs)}</td><td><button onClick={()=>delEmp(e.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody></table></Card>
          </div>}
          {gTab==="obras"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar</div><div style={{marginBottom:12}}><Label>Nome</Label><Inp value={nON} onChange={setNON} placeholder="Nome da obra"/></div><div style={{marginBottom:16}}><Label>Localização</Label><Inp value={nOL} onChange={setNOL} placeholder="Cidade"/></div><Btn onClick={addObra} disabled={!nON} style={{width:"100%"}}>+ Adicionar</Btn></Card>
            <Card><CardHead extra={<Badge color={C.orange}>{obras.length}</Badge>}>Obras</CardHead><table><thead><tr><th>Nome</th><th>Local</th><th>Presenças</th><th>Horas</th><th></th></tr></thead><tbody>{obras.map(o=>{const hrs=pontos.filter(p=>p.obra_id===o.id&&p.clock_out).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);return<tr key={o.id}><td style={{fontWeight:600}}>{o.name}</td><td style={{color:C.muted}}>{o.location}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{pontos.filter(p=>p.obra_id===o.id).length}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:C.orange}}>{fmtH(hrs)}</td><td><button onClick={()=>delObra(o.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody></table></Card>
          </div>}
          {gTab==="ferramentas"&&<div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
            <Card style={{padding:20}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16,color:C.muted}}>Adicionar</div><div style={{marginBottom:12}}><Label>Nome</Label><Inp value={nTN} onChange={setNTN} placeholder="Nome da ferramenta"/></div><div style={{marginBottom:16}}><Label>Categoria</Label><Inp value={nTC} onChange={setNTC} placeholder="Ex: Elétrico"/></div><Btn onClick={addTool} disabled={!nTN} style={{width:"100%"}}>+ Adicionar</Btn></Card>
            <Card><CardHead extra={<Badge color={C.orange}>{tools.length}</Badge>}>Ferramentas</CardHead><table><thead><tr><th>Nome</th><th>Categoria</th><th>Levantamentos</th><th>Estado</th><th></th></tr></thead><tbody>{tools.map(t=>{const out=toolsOut.filter(r=>r.tool_id===t.id).length;return<tr key={t.id}><td style={{fontWeight:600}}>{t.name}</td><td><Badge color={C.muted}>{t.category}</Badge></td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{ferRegs.filter(r=>r.tool_id===t.id).length}</td><td>{out>0?<Badge color={C.yellow}>{out} fora</Badge>:<Badge color={C.green}>disponível</Badge>}</td><td><button onClick={()=>delTool(t.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button></td></tr>;})}</tbody></table></Card>
          </div>}
        </div>}

        </>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── EMPLOYEE APP ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function EmployeeApp({user,profile,onLogout}){
  const companyId=profile.company_id;
  const [obras,setObras]=useState([]);
  const [myPontos,setMyPontos]=useState([]);
  const [employees,setEmployees]=useState([]);
  const [selectedObra,setSelectedObra]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [now,setNow]=useState(new Date());

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  // Encontrar o registo de funcionário associado a este utilizador
  const myEmployee=employees.find(e=>e.user_id===user.id)||employees.find(e=>e.name===profile.display_name);
  const activeSession=myEmployee?myPontos.find(p=>p.employee_id===myEmployee.id&&!p.clock_out):null;

  const loadAll=useCallback(async()=>{
    if(!companyId)return;
    setLoading(true);
    const[o,p,e]=await Promise.all([
      sb.from("obras").select("*").eq("company_id",companyId).order("name"),
      sb.from("pontos").select("*").eq("company_id",companyId).order("clock_in",{ascending:false}).limit(30),
      sb.from("employees").select("*").eq("company_id",companyId),
    ]);
    if(o.data)setObras(o.data);
    if(p.data)setMyPontos(p.data);
    if(e.data)setEmployees(e.data);
    setLoading(false);
  },[companyId]);

  useEffect(()=>{loadAll();},[loadAll]);

  function showToast(msg,color=C.green){setToast({msg,color});setTimeout(()=>setToast(null),3000);}

  async function handlePonto(){
    if(!myEmployee||saving)return;
    setSaving(true);
    if(activeSession){
      const{error}=await sb.from("pontos").update({clock_out:new Date().toISOString()}).eq("id",activeSession.id);
      if(!error){showToast("Saída registada ✓");await loadAll();}else showToast("Erro",C.red);
    }else{
      if(!selectedObra){showToast("Selecciona a obra",C.yellow);setSaving(false);return;}
      const{error}=await sb.from("pontos").insert({employee_id:myEmployee.id,obra_id:parseInt(selectedObra),clock_in:new Date().toISOString(),company_id:companyId,user_id:user.id});
      if(!error){showToast("Entrada registada ✓");await loadAll();}else showToast("Erro",C.red);
    }
    setSaving(false);
  }

  const myRegistos=myEmployee?myPontos.filter(p=>p.employee_id===myEmployee.id):[];
  const hojeRegistos=myRegistos.filter(p=>isToday(p.clock_in));
  const totalHoje=hojeRegistos.reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);
  const totalSemana=myRegistos.filter(p=>{const d=new Date(p.clock_in);const hoje=new Date();const semana=new Date(hoje);semana.setDate(hoje.getDate()-hoje.getDay());return d>=semana;}).reduce((a,p)=>a+durMs(p.clock_in,p.clock_out),0);

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      {toast&&<div style={{position:"fixed",bottom:24,right:24,background:C.s2,border:`1px solid ${toast.color}44`,color:toast.color,padding:"12px 20px",borderRadius:8,fontSize:13,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{toast.msg}</div>}

      {/* Header */}
      <div style={{background:C.s1,borderBottom:`1px solid ${C.border}`,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:C.orange,color:"#000",width:32,height:32,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900}}>⚙</div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,letterSpacing:2,textTransform:"uppercase"}}>ConstruPonto</div>
            <div style={{fontSize:9,color:C.green,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif"}}>● {profile.display_name||"Funcionário"}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:16,fontWeight:500,letterSpacing:2,textAlign:"right"}}>
            {now.toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            <div style={{fontSize:9,color:C.muted}}>{now.toLocaleDateString("pt-PT",{weekday:"short",day:"2-digit",month:"short"})}</div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 12px",borderRadius:5,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Sair</button>
        </div>
      </div>

      <div style={{flex:1,padding:"28px 24px",maxWidth:600,width:"100%",margin:"0 auto"}}>
        {loading?<Spinner/>:!companyId?
          <Card style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:16}}>⏳</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,marginBottom:8}}>Conta Pendente</div><div style={{color:C.muted,fontSize:13}}>Aguarda activação pelo administrador.</div></Card>
        :!myEmployee?
          <Card style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:16}}>👤</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,marginBottom:8}}>Perfil não encontrado</div><div style={{color:C.muted,fontSize:13}}>O teu nome de utilizador não corresponde a nenhum funcionário registado. Contacta o responsável da empresa.</div></Card>
        :<>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            <Stat label="Horas Hoje" value={fmtH(totalHoje)} sub={`${hojeRegistos.length} registos`}/>
            <Stat label="Esta Semana" value={fmtH(totalSemana)} color={C.blue}/>
          </div>

          {/* Botão Principal */}
          <Card style={{padding:28,marginBottom:24,textAlign:"center"}}>
            {activeSession?(
              <>
                <div style={{marginBottom:20}}>
                  <div style={{color:C.green,fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}><Dot color={C.green}/>Em Obra</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,marginBottom:6}}>
                    {obras.find(o=>o.id===activeSession.obra_id)?.name}
                  </div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:32,color:C.green,fontWeight:500,marginBottom:4}}>
                    {fmtH(durMs(activeSession.clock_in,null))}
                  </div>
                  <div style={{fontSize:12,color:C.muted}}>desde {fmtT(activeSession.clock_in)}</div>
                </div>
                <Btn onClick={handlePonto} disabled={saving} variant="red" style={{width:"100%",padding:"16px",fontSize:16,letterSpacing:3}}>
                  {saving?"A registar...":"⏹  REGISTAR SAÍDA"}
                </Btn>
              </>
            ):(
              <>
                <div style={{marginBottom:20}}>
                  <div style={{color:C.muted,fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Selecciona a Obra</div>
                  <Sel value={selectedObra} onChange={setSelectedObra}>
                    <option value="">Escolher obra...</option>
                    {obras.map(o=><option key={o.id} value={o.id}>{o.name} — {o.location}</option>)}
                  </Sel>
                </div>
                <Btn onClick={handlePonto} disabled={!selectedObra||saving} style={{width:"100%",padding:"16px",fontSize:16,letterSpacing:3}}>
                  {saving?"A registar...":"▶  REGISTAR ENTRADA"}
                </Btn>
              </>
            )}
          </Card>

          {/* Histórico */}
          <Card>
            <CardHead extra={<Badge color={C.orange}>{myRegistos.length}</Badge>}>Os Meus Registos</CardHead>
            {myRegistos.length===0?<div style={{padding:"24px 20px",color:C.muted,fontSize:13,textAlign:"center"}}>Nenhum registo ainda</div>
            :<div style={{overflowX:"auto"}}><table><thead><tr><th>Data</th><th>Obra</th><th>Entrada</th><th>Saída</th><th>Horas</th></tr></thead>
            <tbody>{myRegistos.slice(0,20).map(p=>{const obra=obras.find(o=>o.id===p.obra_id);return<tr key={p.id}><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.dim}}>{fmtD(p.clock_in)}</td><td style={{color:C.muted}}>{obra?.name||"—"}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_in)}</td><td>{p.clock_out?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{fmtT(p.clock_out)}</span>:<Badge color={C.green}>activo</Badge>}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:C.orange,fontWeight:500}}>{fmtH(durMs(p.clock_in,p.clock_out))}</td></tr>;})}</tbody></table></div>}
          </Card>
        </>}
      </div>
    </div>
  );
}




