import { D_REST, setRest, D_BEACH, D_ALLOT, D_PROD, D_EVENTS, setEvents, D_PRAC, D_NAT, D_ACT, D_PUEB, D_HIST, D_BICI, D_MUSEUS, D_FAM, D_LOCALS, D_BIRDS, D_HIDES, D_PESCA, D_PISC, D_RICE, D_MERCATS, D_RUTES_EXP, D_HERITAGE, D_TRANSPORT_ITEMS } from "./data.js";
import { D_CUISINE, D_TAGS, D_I18N, LANG_META, DAYS, ALLOT_T, V, setV, EMERGENCY_NUMS, WMO_ICONS, CMS_DATA_BASE, AI_PLANNER_ENDPOINT, store } from "./config.js";


/* ═══════════════════════════════════════════════════════════════
   DELTA DE L'EBRE · GUIA TURÍSTICA COMPLETA
   React App · Architecture: contexts + generic screens + data
   ═══════════════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo, useEffect, useLayoutEffect, useRef, Component } from "react";

/* ═══════════ ERROR BOUNDARY ═══════════ */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    const M = {ca:{t:"Quelcom ha fallat",b:"Hi ha hagut un error inesperat. Si us plau, recarrega la pàgina.",r:"Recarregar"},es:{t:"Algo ha fallado",b:"Ha ocurrido un error inesperado. Por favor, recarga la página.",r:"Recargar"},en:{t:"Something went wrong",b:"An unexpected error occurred. Please reload the page.",r:"Reload"},fr:{t:"Une erreur s'est produite",b:"Une erreur inattendue est survenue. Veuillez recharger la page.",r:"Recharger"},de:{t:"Etwas ist schiefgelaufen",b:"Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu.",r:"Neu laden"},nl:{t:"Er ging iets mis",b:"Er is een onverwachte fout opgetreden. Herlaad de pagina.",r:"Herladen"},pt:{t:"Algo correu mal",b:"Ocorreu um erro inesperado. Por favor, recarregue a página.",r:"Recarregar"}};
    const L = M[(typeof navigator!=="undefined" && navigator.language ? navigator.language.slice(0,2).toLowerCase() : "ca")] || M.ca;
    if (this.state.error) return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"#06303a",color:"#eef7f9",fontFamily:"-apple-system,sans-serif"}}>
        <div style={{fontSize:48,marginBottom:16}} aria-hidden="true">🦩</div>
        <h1 style={{fontSize:18,fontFamily:"Georgia,serif",marginBottom:8}}>{L.t}</h1>
        <p style={{fontSize:13,opacity:.5,textAlign:"center",maxWidth:280,marginBottom:20}}>{L.b}</p>
        <button onClick={()=>{this.setState({error:null});window.location.reload();}} style={{padding:"10px 24px",borderRadius:12,border:"1px solid rgba(93,202,165,.4)",background:"rgba(93,202,165,.15)",color:"#5dcaa5",fontSize:14,fontWeight:600,cursor:"pointer"}}>{L.r}</button>
        <pre style={{marginTop:20,fontSize:10,opacity:.2,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"pre-wrap"}}>{this.state.error?.message}</pre>
      </div>
    );
    return this.props.children;
  }
}

/* ─── LANG METADATA ─── */


/* Theme - module-level ref updated by App */


/* ─── HELPERS ─── */
function tr(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.ES || obj.CA || obj.EN || Object.values(obj)[0] || "";
}

/* ─── SVG ICON SYSTEM ─── */
const Ic = ({d, size=20, cls=""}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const I = {
  back:"M15 5l-7 7 7 7", chev:"M9 6l6 6-6 6",
  search:["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z","M21 21l-4.35-4.35"],
  home:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
  heart:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  pin:["M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"],
  phone:["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  map:["M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z","M9 4v14","M15 6v14"],
  sun:["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42"],
  moon:["M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"],
  globe:["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M2 12h20"],
  x:["M18 6L6 18","M6 6l12 12"],
  alert:["M12 2L2 22h20L12 2z","M12 10v4","M12 18h.01"],
};

/* ═══════════ REUSABLE COMPONENTS ═══════════ */

function Header({title, onBack, lang, onLangClick, onThemeToggle, dark}) {
  const backLabel = {CA:"Enrere",ES:"Atrás",EN:"Back",FR:"Retour",DE:"Zurück",NL:"Terug",PT:"Voltar"};
  return (
    <div className="flex items-center justify-between mb-4" style={{minHeight:36}}>
      <div className="flex items-center gap-2.5">
        {onBack && <button onClick={onBack} aria-label={backLabel[lang]||"Back"} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:V.w10,border:`1px solid ${V.w14}`}}><Ic d={I.back} size={17}/></button>}
        {title && <span className="text-sm opacity-50 font-medium">{title}</span>}
      </div>
      <div className="flex items-center gap-2">
        {onThemeToggle && <button onClick={onThemeToggle} aria-label={({CA:"Canvia el tema",ES:"Cambiar tema",EN:"Toggle theme",FR:"Changer de thème",DE:"Thema wechseln",NL:"Thema wisselen",PT:"Mudar tema"})[lang]||"Toggle theme"} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:V.w10,border:`1px solid ${V.w14}`}}><Ic d={dark?I.sun:I.moon} size={15}/></button>}
        {onLangClick && <button onClick={onLangClick} aria-label={({CA:"Canvia l'idioma",ES:"Cambiar idioma",EN:"Change language",FR:"Changer de langue",DE:"Sprache ändern",NL:"Taal wijzigen",PT:"Mudar idioma"})[lang]||"Change language"} className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold" style={{background:V.w10,border:`1px solid ${V.w14}`}}>{lang}</button>}
      </div>
    </div>
  );
}

function Rating({r, n}) {
  return <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{color:"#fac775"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="#fac775" stroke="none"><path d={I.star}/></svg>{r?.toFixed(1)}{n&&<span className="font-normal opacity-55 text-xs">({n>999?(n/1000).toFixed(1)+'k':n})</span>}</span>;
}

function SearchBar({value, onChange, placeholder, lang}) {
  return (
    <div className="relative mb-3">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"><Ic d={I.search} size={15}/></div>
      <input type="text" aria-label={(placeholder||"Search").replace(/\.+$/,"")} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"..."} className="w-full py-2.5 pl-9 pr-9 rounded-xl text-sm outline-none" style={{background:V.w8,border:`1px solid ${V.w15}`,color:"inherit"}}/>
      {value && <button onClick={()=>onChange("")} aria-label={({CA:"Esborra",ES:"Borrar",EN:"Clear",FR:"Effacer",DE:"Löschen",NL:"Wissen",PT:"Limpar"})[lang]||"Clear"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-55">✕</button>}
    </div>
  );
}

function Chips({opts, active, onTap}) {
  return <div className="flex gap-1.5 flex-wrap mb-3">{opts.map(o=><button key={o.v} onClick={()=>onTap(o.v)} className="text-xs font-semibold px-2.5 py-1 rounded-xl transition-all" style={{background:active===o.v?"rgba(93,202,165,.16)":V.w4,border:`1.5px solid ${active===o.v?"#5dcaa5":V.w13}`,color:active===o.v?"#5dcaa5":"inherit",opacity:active===o.v?1:.65}}>{o.l}</button>)}</div>;
}

function FavBtn({on, toggle, cls=""}) {
  return <button aria-label={on?"Remove favourite":"Add favourite"} onClick={e=>{e.stopPropagation();toggle();}} className={`w-8 h-8 rounded-full flex items-center justify-center ${cls}`} style={{background:V.favBtnBg}}><svg width="15" height="15" viewBox="0 0 24 24" fill={on?"#fac775":"none"} stroke={on?"#fac775":"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={I.heart}/></svg></button>;
}

function Empty({icon, text}) {
  return <div className="py-10 text-center opacity-55"><div className="text-3xl mb-2" aria-hidden="true">{icon||"🔍"}</div><div className="text-sm">{text}</div></div>;
}

/* ¿El valor del camp és una imatge real (no un marcador buit com __PH_N__)? */
const isRealPhoto = (s) => typeof s === "string" && /^(https?:|\/|\.\/|data:)/.test(s);

/* Capçalera amb foto. Si hi ha imatge real la mostra; si no, manté el fons de
   color amb emoji (com fins ara), de manera que mai es veu "trencada". */
function PhotoHero({src, emoji, bg, alt, children, h = "h-36", cls = "rounded-2xl mb-3", emojiCls = "text-5xl opacity-15"}) {
  const [err, setErr] = useState(false);
  const real = isRealPhoto(src) && !err;
  return (
    <div className={`${h} ${cls} flex items-center justify-center relative overflow-hidden`} style={{background:bg}}>
      {real
        ? <img src={src} alt={alt||""} loading="lazy" onError={()=>setErr(true)} className="absolute inset-0 w-full h-full object-cover"/>
        : <span className={emojiCls}>{emoji}</span>}
      {children}
    </div>
  );
}

/* Miniatura per a llistes. Amb foto: quadrat amb la imatge; sense: l'emoji d'abans. */
function Thumb({src, emoji, alt, size = 44, emojiCls = "text-2xl"}) {
  const [err, setErr] = useState(false);
  if (isRealPhoto(src) && !err)
    return <img src={src} alt={alt||""} loading="lazy" onError={()=>setErr(true)} className="rounded-xl object-cover shrink-0" style={{width:size,height:size}}/>;
  return <span aria-hidden="true" className={`${emojiCls} shrink-0`}>{emoji}</span>;
}

/* Card for generic items (nature, villages, activities, practical, heritage, etc.) */
function ItemCard({item, lang, emoji, onClick, gradient}) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl overflow-hidden transition-all hover:scale-[1.003] mb-2.5" style={{background:V.w7,border:`1px solid ${V.w14}`}}>
      <div className="h-16 flex items-center px-4 gap-3" style={{background:gradient||"linear-gradient(135deg,rgba(15,74,82,.4),rgba(44,106,92,.3))"}}>
        <Thumb src={item.photo} emoji={emoji || item.icon || "📌"} alt={tr(item.name, lang)}/>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{tr(item.name, lang)}</div>
          {item.tagline && <div className="text-xs opacity-50 truncate">{tr(item.tagline, lang)}</div>}
        </div>
        <Ic d={I.chev} size={16} cls="opacity-40 shrink-0"/>
      </div>
    </button>
  );
}

/* ═══════════ SCREEN: LANGUAGE SELECT ═══════════ */
function DeltaSunsetBg() {
  return (
    <svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{zIndex:0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a2e"/>
          <stop offset="18%" stopColor="#2d1b4e"/>
          <stop offset="35%" stopColor="#6b2f5e"/>
          <stop offset="50%" stopColor="#c4564a"/>
          <stop offset="62%" stopColor="#e8923c"/>
          <stop offset="72%" stopColor="#f0b84a"/>
          <stop offset="78%" stopColor="#f5d06a"/>
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4784a"/>
          <stop offset="15%" stopColor="#8a4a3e"/>
          <stop offset="40%" stopColor="#3a2a3e"/>
          <stop offset="70%" stopColor="#1a1428"/>
          <stop offset="100%" stopColor="#0e0a1a"/>
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0"/>
          <stop offset="30%" stopColor="#fde68a"/>
          <stop offset="70%" stopColor="#f59e0b" stopOpacity=".6"/>
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="sunReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="400" height="380" fill="url(#sky)"/>
      {/* Sun */}
      <circle cx="200" cy="310" r="55" fill="url(#sun)"/>
      <ellipse cx="200" cy="310" rx="200" ry="12" fill="#fde68a" opacity=".15"/>
      {/* Cloud wisps */}
      <ellipse cx="120" cy="180" rx="60" ry="4" fill="#c4564a" opacity=".2"/>
      <ellipse cx="300" cy="200" rx="45" ry="3" fill="#c4564a" opacity=".15"/>
      <ellipse cx="80" cy="230" rx="50" ry="3.5" fill="#e8923c" opacity=".15"/>
      <ellipse cx="320" cy="250" rx="35" ry="2.5" fill="#e8923c" opacity=".12"/>
      {/* Flamingos in flight — 5 birds at different positions */}
      <g fill="#2d1b4e" opacity=".7">
        {/* Bird 1 - large, left */}
        <path d="M95 195 Q98 189 104 192 Q100 190 103 185 Q100 189 95 195Z" transform="scale(1.3) translate(-10,-20)"/>
        {/* Bird 2 - medium, center-left */}
        <path d="M150 210 Q153 204 159 207 Q155 205 158 200 Q155 204 150 210Z"/>
        {/* Bird 3 - large, center */}
        <path d="M210 185 Q214 178 221 182 Q216 179 220 173 Q216 178 210 185Z" transform="scale(1.2) translate(-25,-15)"/>
        {/* Bird 4 - small, right */}
        <path d="M280 200 Q282 196 286 198 Q284 197 285 194 Q283 196 280 200Z"/>
        {/* Bird 5 - medium, far right */}
        <path d="M310 178 Q313 172 319 175 Q315 173 318 168 Q315 172 310 178Z" transform="scale(1.1) translate(-30,-10)"/>
        {/* Bird 6 - tiny, distant */}
        <path d="M170 170 Q172 167 175 169 Q173 168 174 166 Q172 167 170 170Z"/>
        {/* Bird 7 */}
        <path d="M250 168 Q252 165 255 167 Q253 166 254 163 Q252 165 250 168Z"/>
      </g>
      {/* Delta horizon — marsh/reed silhouette */}
      <path d="M0 340 Q20 330 35 338 Q50 325 60 336 Q70 328 85 335 Q95 320 105 334 Q115 328 125 335 Q140 322 150 333 Q160 326 175 335 Q185 322 195 330 Q205 325 215 333 Q225 320 240 332 Q250 326 265 335 Q275 322 285 330 Q300 325 315 335 Q325 328 335 334 Q350 326 365 335 Q375 328 390 336 L400 340 L400 345 L0 345Z" fill="#1a1020"/>
      {/* Reeds — thin vertical lines along horizon */}
      <g stroke="#1a1020" strokeWidth="1.2" opacity=".8">
        <line x1="30" y1="340" x2="28" y2="318"/><line x1="32" y1="340" x2="34" y2="322"/>
        <line x1="90" y1="335" x2="88" y2="310"/><line x1="93" y1="335" x2="95" y2="315"/>
        <line x1="150" y1="333" x2="148" y2="308"/><line x1="153" y1="333" x2="155" y2="312"/>
        <line x1="240" y1="332" x2="238" y2="306"/><line x1="243" y1="332" x2="246" y2="310"/>
        <line x1="340" y1="334" x2="338" y2="312"/><line x1="343" y1="334" x2="345" y2="316"/>
        <line x1="380" y1="336" x2="378" y2="314"/><line x1="383" y1="336" x2="386" y2="320"/>
      </g>
      {/* Reed leaf tips */}
      <g fill="#1a1020" opacity=".7">
        <path d="M27 318 Q25 313 28 316Z"/><path d="M35 322 Q37 317 34 320Z"/>
        <path d="M87 310 Q85 305 88 308Z"/><path d="M96 315 Q98 310 95 313Z"/>
        <path d="M147 308 Q145 303 148 306Z"/><path d="M156 312 Q158 307 155 310Z"/>
        <path d="M237 306 Q235 301 238 304Z"/><path d="M247 310 Q249 305 246 308Z"/>
        <path d="M337 312 Q335 307 338 310Z"/><path d="M346 316 Q348 311 345 314Z"/>
      </g>
      {/* Water */}
      <rect y="342" width="400" height="358" fill="url(#water)"/>
      {/* Sun reflection on water */}
      <rect x="150" y="342" width="100" height="80" fill="url(#sunReflect)" opacity=".4"/>
      {/* Water shimmer lines */}
      <g stroke="#fbbf24" strokeWidth=".5" opacity=".12">
        <line x1="160" y1="355" x2="240" y2="355"/>
        <line x1="170" y1="370" x2="230" y2="370"/>
        <line x1="175" y1="385" x2="225" y2="385"/>
        <line x1="180" y1="400" x2="220" y2="400"/>
        <line x1="185" y1="420" x2="215" y2="420"/>
      </g>
      {/* Subtle horizontal water texture */}
      <g stroke="#fff" strokeWidth=".3" opacity=".04">
        <line x1="0" y1="360" x2="140" y2="360"/>
        <line x1="260" y1="365" x2="400" y2="365"/>
        <line x1="20" y1="390" x2="150" y2="390"/>
        <line x1="250" y1="395" x2="380" y2="395"/>
        <line x1="40" y1="430" x2="130" y2="430"/>
        <line x1="270" y1="440" x2="370" y2="440"/>
      </g>
      {/* Dark overlay at bottom for text readability */}
      <rect y="450" width="400" height="250" fill="url(#water)" opacity=".5"/>
    </svg>
  );
}

function LangSelect({onSelect}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{background:"#0e0a1a"}}>
      <DeltaSunsetBg/>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8 relative" style={{zIndex:1}}>
        <div className="text-center mb-6 pt-6">
          <h1 className="font-semibold tracking-tight" style={{fontSize:"2.06rem",color:"#fff8e8",fontFamily:"Georgia,serif",textShadow:"0 2px 20px rgba(0,0,0,.4)"}}>
            Delta de l'Ebre
          </h1>
          <p className="text-sm mt-1.5" style={{color:"rgba(253,230,138,.6)",textShadow:"0 1px 8px rgba(0,0,0,.3)"}}>Guia turística · Tourist guide</p>
        </div>
        <div className="flex-1"/>
        <div className="flex flex-col gap-2 pb-4">{LANG_META.map(l=>
          <button key={l.code} onClick={()=>onSelect(l.code)} className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-2xl transition-all" style={{background:"rgba(10,8,20,.55)",backdropFilter:"blur(12px)",border:"1px solid rgba(253,230,138,.12)",color:"#f5f0e0"}}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold tracking-wide" style={{background:"rgba(253,230,138,.1)",color:"rgba(253,230,138,.7)"}}>{l.code}</span>
            <span className="text-sm font-medium">{l.name}</span></button>)}
        </div>
        <p className="text-center text-xs pt-2 pb-2" style={{color:"rgba(253,230,138,.3)"}}>🌿 Parc Natural · UNESCO Biosphere</p>
      </div>
    </div>
  );
}

/* ═══════════ SCREEN: HOME (15 categories) ═══════════ */
function HomeScreen({lang, nav, ui, onLangClick, onThemeToggle, dark}) {
  const cats = [
    {key:"gastro",   icon:"🍽️", color:"#f0997b", go:()=>nav.push("gastro")},
    {key:"playas",   icon:"🏖️", color:"#85b7eb", go:()=>nav.push("beaches")},
    {key:"natura",   icon:"🦩", color:"#c9a0dc", go:()=>nav.push("nature")},
    {key:"pueblos",  icon:"🏘️", color:"#e8b86d", go:()=>nav.push("villages")},
    {key:"activ",    icon:"🚣", color:"#5dcaa5", go:()=>nav.push("activities")},
    {key:"practico", icon:"ℹ️", color:"#85b7eb", go:()=>nav.push("practical")},
  ];
  const cats2 = [
    {label:ui.allotBtn||"Allotjament",     icon:"🏠", go:()=>nav.push("allot")},
    {label:ui.biciBtn||"Rutes bici",       icon:"🚲", go:()=>nav.push("bikes")},
    {label:ui.patri||"Patrimoni",          icon:"🏛️", go:()=>nav.push("heritage")},
    {label:ui.prod||"Producte local",      icon:"🌾", go:()=>nav.push("products")},
    {label:ui.fam||"Família",              icon:"👨‍👩‍👧", go:()=>nav.push("family")},
    {label:tr({CA:"Vida nocturna",ES:"Vida nocturna",EN:"Nightlife",FR:"Vie nocturne",DE:"Nachtleben",NL:"Nachtleven",PT:"Vida noturna"},lang), icon:"🌙", go:()=>nav.push("nightlife")},
  ];
  const cats3 = [
    {label:ui.agendaBtn||"Agenda",     icon:"📅", go:()=>nav.push("events")},
    {label:ui.planBtn||"Planificador", icon:"🗺️", go:()=>nav.push("planner")},
    {label:tr({CA:"Mapa",ES:"Mapa",EN:"Map",FR:"Carte",DE:"Karte",NL:"Kaart",PT:"Mapa"},lang), icon:"📍", go:()=>nav.push("mapScreen")},
  ];
  
  return (
    <div className="min-h-screen" style={{background:V.homeBg}}>
      <div className="max-w-md mx-auto w-full px-5 py-5">
        <Header title="Delta de l'Ebre" onLangClick={onLangClick} lang={lang} onThemeToggle={onThemeToggle} dark={dark}/>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl" aria-hidden="true">🦩</div>
          <div><h1 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.heading}</h1>
            <p className="text-xs opacity-55 mt-0.5">{ui.subtitle}</p></div>
        </div>
        <WeatherWidget lang={lang} nav={nav}/>
        <div className="flex justify-between text-center mb-3 px-1">{[
          {n:Object.values(D_REST).flat().length,l:tr({CA:"restaurants",ES:"restaurantes",EN:"restaurants",FR:"restaurants",DE:"Restaurants",NL:"restaurants",PT:"restaurantes"},lang),e:"🍽️"},
          {n:D_BEACH.length,l:tr({CA:"platges",ES:"playas",EN:"beaches",FR:"plages",DE:"Strände",NL:"stranden",PT:"praias"},lang),e:"🏖️"},
          {n:D_ALLOT.length,l:tr({CA:"allotjaments",ES:"alojamientos",EN:"stays",FR:"hébergements",DE:"Unterkünfte",NL:"verblijven",PT:"alojamentos"},lang),e:"🏠"},
          {n:D_PUEB.length,l:tr({CA:"pobles",ES:"pueblos",EN:"villages",FR:"villages",DE:"Dörfer",NL:"dorpen",PT:"vilas"},lang),e:"🏘️"},
        ].map((s,i)=><div key={i} className="flex-1"><div className="text-lg font-bold">{s.n}</div><div className="text-xs opacity-45">{s.e} {s.l}</div></div>)}</div>
        {/* Seasonal highlight */}
        {(()=>{const m=new Date().getMonth();const seasons={
          winter:{icon:"🌿",msg:{CA:"Temporada d'aus hivernals al delta",ES:"Temporada de aves invernales",EN:"Winter bird season in the delta",FR:"Saison des oiseaux hivernants",DE:"Wintervogelsaison im Delta",NL:"Wintervogelseizoen",PT:"Temporada de aves invernais"}},
          spring:{icon:"🌾",msg:{CA:"Els arrossars s'inunden — paisatge blau únic!",ES:"Los arrozales se inundan — ¡paisaje azul único!",EN:"Rice paddies flood — unique blue landscape!",FR:"Les rizières s'inondent — paysage bleu unique!",DE:"Reisfelder überfluten — einzigartige blaue Landschaft!",NL:"Rijstvelden overstromen — uniek blauw landschap!",PT:"Os arrozais inundam-se — paisagem azul única!"}},
          summer:{icon:"🦩",msg:{CA:"Flamencs, platges i nits d'estiu al delta",ES:"Flamencos, playas y noches de verano",EN:"Flamingos, beaches & summer nights",FR:"Flamants, plages et nuits d'été",DE:"Flamingos, Strände und Sommernächte",NL:"Flamingo's, stranden en zomernachten",PT:"Flamingos, praias e noites de verão"}},
          autumn:{icon:"🟡",msg:{CA:"La sega de l'arròs — camps daurats i festes!",ES:"La siega del arroz — ¡campos dorados y fiestas!",EN:"Rice harvest — golden fields & festivals!",FR:"Récolte du riz — champs dorés et fêtes!",DE:"Reisernte — goldene Felder und Feste!",NL:"Rijstoogst — gouden velden en feesten!",PT:"Colheita do arroz — campos dourados e festas!"}},
        };const s=m<=1||m===11?"winter":m<=4?"spring":m<=8?"summer":"autumn";const cur=seasons[s];
        return <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4" style={{background:"rgba(93,202,165,.08)",border:"1px solid rgba(93,202,165,.15)"}}>
          <span className="text-lg" aria-hidden="true">{cur.icon}</span><p className="text-xs opacity-60 flex-1">{tr(cur.msg,lang)}</p></div>;})()}

        {/* Main 6 categories */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cats.map(c=><button key={c.key} onClick={c.go} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all" style={{background:V.w7,border:`1px solid ${V.w14}`}}>
            <span className="text-2xl" aria-hidden="true">{c.icon}</span>
            <span className="text-xs font-medium" style={{color:V.fg}}>{ui[c.key]||c.key}</span></button>)}
        </div>

        {/* Secondary 6 categories */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cats2.map((c,i)=><button key={i} onClick={c.go} className="py-3 rounded-xl flex flex-col items-center gap-1 transition-all" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
            <span className="text-lg" aria-hidden="true">{c.icon}</span>
            <span className="text-[10px] font-medium opacity-70">{c.label}</span></button>)}
        </div>

        {/* Tertiary row: Agenda, Planner, Map */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cats3.map((c,i)=><button key={i} onClick={c.go} className="py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
            <span className="text-sm" aria-hidden="true">{c.icon}</span>
            <span className="text-xs font-medium opacity-60">{c.label}</span></button>)}
        </div>

        {/* Quick actions: Search, Favorites, Emergencies, Nightlife */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={()=>nav.push("search")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"rgba(93,202,165,.12)",border:"1px solid rgba(93,202,165,.35)"}}>
            <Ic d={I.search} size={16}/><span className="text-xs font-medium">{tr({CA:"Cerca",ES:"Buscar",EN:"Search",FR:"Rechercher",DE:"Suchen",NL:"Zoeken",PT:"Pesquisar"},lang)}</span></button>
          <button onClick={()=>nav.push("favs")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"rgba(250,199,117,.12)",border:"1px solid rgba(250,199,117,.35)"}}>
            <span className="text-sm" aria-hidden="true">❤️</span><span className="text-xs font-medium">{tr({CA:"Favorits",ES:"Favoritos",EN:"Favourites",FR:"Favoris",DE:"Favoriten",NL:"Favorieten",PT:"Favoritos"},lang)}</span></button>
          <button onClick={()=>nav.push("emergencies")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"rgba(232,90,80,.12)",border:"1px solid rgba(232,90,80,.35)"}}>
            <span className="text-sm" aria-hidden="true">🆘</span><span className="text-xs font-medium">{tr({CA:"Emergències",ES:"Emergencias",EN:"Emergencies",FR:"Urgences",DE:"Notfälle",NL:"Noodgevallen",PT:"Urgências"},lang)}</span></button>
          <button onClick={()=>nav.push("transport")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:"rgba(201,160,220,.12)",border:"1px solid rgba(201,160,220,.35)"}}>
            <span className="text-sm" aria-hidden="true">🚗</span><span className="text-xs font-medium">{tr({CA:"Com arribar",ES:"Cómo llegar",EN:"Getting there",FR:"Comment s'y rendre",DE:"Anreise",NL:"Hoe kom je er",PT:"Como chegar"},lang)}</span></button>
        </div>

        <p className="text-center text-xs opacity-35 mt-4">v3.0 · {ui.foot}</p>
      </div>
    </div>
  );
}

/* ═══════════ GASTRO SCREENS ═══════════ */
function GastroScreen({lang, nav, ui}) {
  const towns = Object.keys(D_REST);
  const total = Object.values(D_REST).flat().length;
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-1" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.sRest}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.gIntro}</p>
    <button onClick={()=>nav.push("restList",{town:null})} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-2xl mb-2" style={{background:"rgba(240,153,123,.12)",border:"1px solid rgba(240,153,123,.35)"}}>
      <Ic d={I.map} size={20} cls="opacity-60"/><div className="flex-1"><div className="text-sm font-medium">{ui.restAll}</div><div className="text-xs opacity-55">{total} {ui.restWord}</div></div><Ic d={I.chev} size={16} cls="opacity-40"/></button>
    {towns.map(t=><button key={t} onClick={()=>nav.push("restList",{town:t})} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
      <span className="text-sm" aria-hidden="true">📍</span><div className="flex-1"><div className="text-sm font-medium">{t}</div><div className="text-xs opacity-55">{D_REST[t].length} {ui.restWord}</div></div><Ic d={I.chev} size={16} cls="opacity-40"/></button>)}
    {/* Sub-sections */}
    <div className="mt-4 flex flex-col gap-1.5">
      {[{k:"sProd",d:ui.sProdD,go:()=>nav.push("products")},{k:"sPesca",d:ui.sPescaD,go:()=>nav.push("fishing")},{k:"sHist",d:ui.sHistD,go:()=>nav.push("heritage")},{k:"sMerc",d:ui.sMercD,go:()=>nav.push("markets")},{k:"sRutas",d:ui.sRutasD,go:()=>nav.push("rutesExp")}].map((s,i)=>
        <button key={i} onClick={s.go||(()=>{})} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl" style={{background:V.w3,border:`1px solid ${V.w8}`}}>
          <div className="flex-1"><div className="text-xs font-medium opacity-70">{ui[s.k]||""}</div><div className="text-[10px] opacity-45">{s.d||""}</div></div><Ic d={I.chev} size={14} cls="opacity-35"/></button>)}
    </div>
  </div>);
}

function RestListScreen({lang, nav, ui, town, favs, toggleFav}) {
  const [search, setSearch] = useState("");
  const [cf, setCf] = useState("all");
  const [sort, setSort] = useState("default");
  const [openOnly, setOpenOnly] = useState(false);
  const geo = useGeo();
  const all = useMemo(()=>town?D_REST[town]||[]:Object.entries(D_REST).flatMap(([t,l])=>l.map(r=>({...r,_town:t}))),[town]);
  const cTypes = useMemo(()=>[{v:"all",l:ui.restAll||"All"},...[...new Set(all.map(r=>r.c))].map(c=>({v:c,l:tr(D_CUISINE[c],lang)||c}))],[all,lang]);
  const filtered = useMemo(()=>{
    let l=all; if(cf!=="all")l=l.filter(r=>r.c===cf);
    if(search){const s=search.toLowerCase();l=l.filter(r=>r.name.toLowerCase().includes(s)||(r.addr||"").toLowerCase().includes(s));}
    if(openOnly) l=l.filter(r=>isOpenNow(r.hours));
    if(sort==="rating") l=[...l].sort((a,b)=>(b.rating||0)-(a.rating||0));
    else if(sort==="name") l=[...l].sort((a,b)=>a.name.localeCompare(b.name));
    else if(sort==="near"&&geo) l=[...l].sort((a,b)=>(distKm(geo,a)||999)-(distKm(geo,b)||999));
    return l;
  },[all,cf,search,sort,geo,openOnly]);
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.sRest} onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{town||ui.restAll}</h2>
    <p className="text-xs opacity-55 mb-3">{filtered.length} {ui.restWord}</p>
    <SearchBar lang={lang} value={search} onChange={setSearch} placeholder={ui.sRest+"..."}/>
    <Chips opts={cTypes} active={cf} onTap={setCf}/>
    <div className="flex gap-1.5 mb-2">
      <button onClick={()=>setOpenOnly(o=>!o)} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{background:openOnly?"rgba(93,202,165,.2)":V.w3,border:`1px solid ${openOnly?"rgba(93,202,165,.4)":V.w10}`,color:openOnly?"#5dcaa5":"inherit",opacity:openOnly?1:.5}}>🟢 {tr({CA:"Obert ara",ES:"Abierto ahora",EN:"Open now",FR:"Ouvert maintenant",DE:"Jetzt offen",NL:"Nu open",PT:"Aberto agora"},lang)}</button>
      {[{v:"default",l:"📍"},{v:"rating",l:"⭐"},{v:"name",l:"A-Z"},{v:"near",l:"📡"}].map(o=>
      <button key={o.v} onClick={()=>setSort(o.v)} className="text-xs px-2 py-1 rounded-lg" style={{background:sort===o.v?"rgba(93,202,165,.16)":V.w3,border:`1px solid ${sort===o.v?"rgba(93,202,165,.3)":V.w10}`,color:sort===o.v?"#5dcaa5":"inherit",opacity:sort===o.v?1:.5}}>{o.l}</button>)}
    </div>
    <div className="flex flex-col gap-2">{filtered.map((r,i)=>{const fk=`rest_${r.name}`;return(
      <div key={r.name+i} className="relative">
        <button onClick={()=>nav.push("restDetail",{restaurant:r})} className="block w-full text-left rounded-2xl overflow-hidden" style={{background:V.w6,border:`1px solid ${V.w12}`}}>
        <PhotoHero src={r.photo} emoji="🍽️" bg={V.hero1} alt={r.name} h="h-20" cls="" emojiCls="text-3xl opacity-35">
          <div className="absolute top-2 right-2"><Rating r={r.rating} n={r.count}/></div>
          {r.awards&&r.awards.length>0&&<span className="absolute bottom-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded" style={{background:"rgba(220,38,38,.2)",color:"#f87171"}}>{r.awards[0].type==="michelin"?"⭐Michelin":r.awards[0].type==="bib"?"😋Bib":"☀️Repsol"}</span>}
        </PhotoHero>
        <div className="px-3 py-2"><div className="font-medium text-sm">{r.name}</div>
          <div className="flex items-center gap-2 mt-0.5 text-xs opacity-55"><span style={{color:"#f0c4a8"}}>{tr(D_CUISINE[r.c],lang)}</span>{r.price&&<span>{r.price}</span>}<span className="truncate">{r.addr}</span></div></div>
      </button>
        <div className="absolute top-2 left-2 z-10"><FavBtn on={favs.has(fk)} toggle={()=>toggleFav(fk)}/></div>
      </div>);})}{filtered.length===0&&<Empty text={ui.emptyTown}/>}</div>
  </div>);
}

function RestDetailScreen({lang, nav, ui, restaurant:r, favs, toggleFav}) {
  const fk=`rest_${r.name}`;const di=new Date().getDay();const dx=di===0?6:di-1;const days=DAYS[lang]||DAYS.ES;
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.sRest} onBack={()=>nav.pop()}/>
    <PhotoHero src={r.photo} emoji="🍽️" bg={V.hero1} alt={r.name}>
      <div className="absolute top-3 left-3"><FavBtn on={favs.has(fk)} toggle={()=>toggleFav(fk)}/></div>
      <div className="absolute top-3 right-3"><Rating r={r.rating} n={r.count}/></div>
    </PhotoHero>
    <h2 className="text-xl font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{r.name}</h2>
    <p className="text-sm opacity-50 mb-1">{tr(D_CUISINE[r.c],lang)}</p>
    {r.chef&&<p className="text-xs opacity-55 mb-2">👨‍🍳 {r.chef}</p>}
    {r.desc&&tr(r.desc,lang)&&<p className="text-sm leading-relaxed opacity-65 mb-3">{tr(r.desc,lang)}</p>}
    {r.awards&&r.awards.length>0&&<div className="flex flex-wrap gap-1.5 mb-3">{r.awards.map((a,i)=><span key={i} className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{background:a.type==="michelin"?"rgba(220,38,38,.15)":"rgba(251,146,60,.12)",color:a.type==="michelin"?"#f87171":"#fb923c"}}>{a.type==="michelin"?"⭐ Michelin":a.type==="bib"?"😋 Bib Gourmand":"☀️ Repsol"}</span>)}</div>}
    {r.tg&&r.tg.length>0&&<div className="flex flex-wrap gap-1.5 mb-4">{r.tg.map(t=><span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{background:V.tagBg,color:V.tagFg}}>{tr(D_TAGS[t],lang)||t}</span>)}</div>}
    {r.hours&&<div className="mb-4"><div className="text-xs font-medium opacity-55 mb-1.5">{ui.hoursLabel}</div>{days.map((d,i)=><div key={i} className={`flex justify-between text-xs py-1 ${i===dx?"font-medium opacity-100":"opacity-55"}`} style={{borderBottom:`1px solid ${V.w5}`}}><span>{d}</span><span>{r.hours[i]||ui.closed}</span></div>)}</div>}
    <div className="flex gap-2 mb-4">
      {r.phone&&<a href={`tel:${r.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium no-underline" style={{border:"1px solid rgba(191,233,242,.25)",color:"#bfe9f2"}}><Ic d={I.phone} size={14}/>{ui.call}</a>}
      {r.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium no-underline" style={{background:"rgba(191,233,242,.14)",border:"1px solid rgba(191,233,242,.25)",color:"#bfe9f2"}}><Ic d={I.map} size={14}/>{ui.howGet}</a>}
      {r.web&&<a href={r.web} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium no-underline" style={{background:"rgba(191,233,242,.14)",border:"1px solid rgba(191,233,242,.25)",color:"#bfe9f2"}}>🌐 {tr({CA:"Web",ES:"Web",EN:"Website",FR:"Site web",DE:"Webseite",NL:"Website",PT:"Site"},lang)}</a>}
    </div>
    <div className="text-xs opacity-45 flex items-center gap-1"><Ic d={I.pin} size={12}/>{r.addr}</div>
  </div>);
}

/* ═══════════ BEACH SCREENS ═══════════ */
function BeachesScreen({lang, nav, ui, favs, toggleFav, geo}) {
  const [s, setS] = useState("");
  const [sort, setSort] = useState("default");
  const filtered = useMemo(()=>{
    let l = s ? D_BEACH.filter(b=>tr(b.name,lang).toLowerCase().includes(s.toLowerCase())||tr(b.tagline,lang).toLowerCase().includes(s.toLowerCase())) : [...D_BEACH];
    if(sort==="near"&&geo) l.sort((a,b)=>(distKm(geo,a)||999)-(distKm(geo,b)||999));
    else if(sort==="name") l.sort((a,b)=>tr(a.name,lang).localeCompare(tr(b.name,lang)));
    return l;
  },[s,lang,sort,geo]);
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.beachTitle}</h2>
    <p className="text-xs opacity-55 mb-3">{ui.beachIntro}</p>
    <SearchBar lang={lang} value={s} onChange={setS} placeholder={ui.beachTitle+"..."}/>
    <div className="flex gap-1.5 mb-2">{[{v:"default",l:"📍"},{v:"near",l:"📡"},{v:"name",l:"A-Z"}].map(o=>
      <button key={o.v} onClick={()=>setSort(o.v)} className="text-xs px-2 py-1 rounded-lg" style={{background:sort===o.v?"rgba(93,202,165,.16)":V.w3,border:`1px solid ${sort===o.v?"rgba(93,202,165,.3)":V.w10}`,color:sort===o.v?"#5dcaa5":"inherit",opacity:sort===o.v?1:.5}}>{o.l}</button>)}</div>
    {filtered.map((b,i)=>{const fk=`beach_${i}`;return(
      <div key={i} className="relative mb-2">
        <button onClick={()=>nav.push("beachDetail",{beach:b,idx:i})} className="block w-full text-left rounded-2xl overflow-hidden" style={{background:V.w6,border:`1px solid ${V.w12}`}}>
        <div className="flex items-center gap-3 px-3 py-3 pr-14">
          <Thumb src={b.photo} emoji={b.icon==="wild"?"🏝️":b.icon==="kite"?"🪁":b.icon==="service"?"🏖️":"🌊"} alt={tr(b.name,lang)}/>
          <div className="min-w-0 flex-1"><div className="font-medium text-sm">{tr(b.name,lang)}</div><div className="text-xs opacity-55 truncate">{tr(b.tagline,lang)}</div></div>
          {b.dogs&&<span title="Dogs" aria-hidden="true">🐕</span>}
          {geo&&b.lat&&<span className="text-xs opacity-45 shrink-0">{distKm(geo,b)?.toFixed(1)}km</span>}
        </div>
      </button>
        <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10"><FavBtn on={favs.has(fk)} toggle={()=>toggleFav(fk)}/></div>
      </div>);})}
  </div>);
}

function BeachDetailScreen({lang, nav, ui, beach:b, idx, favs, toggleFav, geo}) {
  const fk=`beach_${idx||0}`;
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.beachTitle} onBack={()=>nav.pop()}/>
    <PhotoHero src={b.photo} emoji="🏖️" bg={V.hero2} alt={tr(b.name,lang)}>
      <div className="absolute top-3 left-3"><FavBtn on={favs.has(fk)} toggle={()=>toggleFav(fk)}/></div>
    </PhotoHero>
    <h2 className="text-xl font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr(b.name,lang)}</h2>
    <p className="text-sm opacity-50 italic mb-3">{tr(b.tagline,lang)}</p>
    <p className="text-sm leading-relaxed mb-4 opacity-75">{tr(b.lead,lang)}</p>
    {b.facts&&b.facts.length>0&&<div className="grid grid-cols-2 gap-1.5 mb-4">{b.facts.map((f,i)=><div key={i} className="rounded-lg px-2.5 py-2" style={{background:V.w4,border:`1px solid ${V.w10}`}}><div className="text-xs opacity-55">{tr(f.k,lang)}</div><div className="text-sm font-medium">{tr(f.v,lang)}</div></div>)}</div>}
    {b.sections&&b.sections.filter(s=>s&&(s.title||s.body)).map((s,i)=><div key={i} className="mb-3"><h3 className="text-xs font-semibold opacity-60 mb-1">{tr(s.title,lang)}</h3><p className="text-xs leading-relaxed opacity-50">{tr(s.body,lang)}</p></div>)}
    {b.tip&&<div className="rounded-xl p-3 mb-4" style={{background:"rgba(240,153,123,.1)",border:"1px solid rgba(240,153,123,.25)"}}><div className="text-xs font-semibold mb-0.5" style={{color:"#f0a98e"}}>💡 {ui.beachTip||"Consell"}</div><p className="text-xs leading-relaxed opacity-70">{tr(b.tip,lang)}</p></div>}
    {b.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium no-underline w-full" style={{background:"rgba(191,233,242,.14)",border:"1px solid rgba(191,233,242,.25)",color:"#bfe9f2"}}><Ic d={I.map} size={14}/>{ui.howGet||"Com arribar"}</a>}
    {b.lat&&geo&&<p className="text-xs text-center opacity-40 mt-1">📡 {distKm(geo,b)?.toFixed(1)} km</p>}
  </div>);
}

/* ═══════════ ACCOMMODATION SCREENS ═══════════ */
function AllotScreen({lang, nav, ui, favs, toggleFav, geo}) {
  const [s,setS]=useState(""); const [tf,setTf]=useState("all"); const [zf,setZf]=useState("all"); const [sort,setSort]=useState("default");
  const tOpts=[{v:"all",l:ui.allotTypes?.[0]||"All"},...["hotel","rural","camping","apartament"].map((t,i)=>({v:t,l:ui.allotTypes?.[i+1]||t}))];
  const zOpts=[{v:"all",l:ui.allotZones?.[0]||"All"},{v:"nord",l:ui.allotZones?.[1]||"Nord"},{v:"sud",l:ui.allotZones?.[2]||"Sud"}];
  const filtered=useMemo(()=>{let l=D_ALLOT;if(tf!=="all")l=l.filter(a=>a.type===tf);if(zf!=="all")l=l.filter(a=>a.zone===zf);if(s){const q=s.toLowerCase();l=l.filter(a=>tr(a.name,lang).toLowerCase().includes(q)||tr(a.town,lang).toLowerCase().includes(q));}
    if(sort==="rating") l=[...l].sort((a,b)=>(b.rating||0)-(a.rating||0));
    else if(sort==="near"&&geo) l=[...l].sort((a,b)=>(distKm(geo,a)||999)-(distKm(geo,b)||999));
    else if(sort==="name") l=[...l].sort((a,b)=>tr(a.name,lang).localeCompare(tr(b.name,lang)));
    return l;},[tf,zf,s,lang,sort,geo]);
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.allotTitle}</h2>
    <p className="text-xs opacity-55 mb-3">{ui.allotIntro}</p>
    <SearchBar lang={lang} value={s} onChange={setS} placeholder={ui.allotTitle+"..."}/>
    <Chips opts={tOpts} active={tf} onTap={setTf}/>
    <Chips opts={zOpts} active={zf} onTap={setZf}/>
    <div className="flex gap-1.5 mb-2">{[{v:"default",l:"📍"},{v:"rating",l:"⭐"},{v:"near",l:"📡"},{v:"name",l:"A-Z"}].map(o=>
      <button key={o.v} onClick={()=>setSort(o.v)} className="text-xs px-2 py-1 rounded-lg" style={{background:sort===o.v?"rgba(93,202,165,.16)":V.w3,border:`1px solid ${sort===o.v?"rgba(93,202,165,.3)":V.w10}`,color:sort===o.v?"#5dcaa5":"inherit",opacity:sort===o.v?1:.5}}>{o.l}</button>)}</div>
    {/* Advice card */}
    <div className="rounded-xl p-3 mb-3 text-xs" style={{background:"rgba(232,184,109,.08)",border:"1px solid rgba(232,184,109,.2)"}}>
      <div className="font-semibold mb-1" style={{color:"#e8b86d"}}>{ui.allotChooseTitle}</div>
      <p className="opacity-60 leading-relaxed">{ui.allotChooseDesc}</p>
    </div>
    {filtered.map(a=><button key={a.id} onClick={()=>nav.push("allotDetail",{allot:a})} className="flex gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <Thumb src={a.photo} emoji={ALLOT_T[a.type]||"🏠"} alt={tr(a.name,lang)} size={40} emojiCls="text-xl"/>
      <div className="flex-1 min-w-0"><div className="font-medium text-sm">{tr(a.name,lang)}</div><div className="text-xs opacity-55">{tr(a.town,lang)} {a.stars?"★".repeat(a.stars):""}</div></div>
      <div className="text-right shrink-0"><div className="text-sm font-bold" style={{color:"#e8b86d"}}>{a.price}</div>{a.rating&&<Rating r={a.rating}/>}</div></button>)}
    {filtered.length===0&&<Empty text={ui.emptyTown}/>}
  </div>);
}

function AllotDetailScreen({lang, nav, ui, allot:a}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.allotTitle} onBack={()=>nav.pop()}/>
    {isRealPhoto(a.photo) && <PhotoHero src={a.photo} emoji={ALLOT_T[a.type]||"🏠"} bg={V.hero1} alt={tr(a.name,lang)}/>}
    <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{ALLOT_T[a.type]||"🏠"}</span>
      <div><h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr(a.name,lang)}</h2>
        <p className="text-xs opacity-55">{tr(a.town,lang)} {a.stars?`· ${"★".repeat(a.stars)}`:""}</p></div></div>
    <p className="text-sm leading-relaxed mb-4 opacity-70">{tr(a.desc,lang)}</p>
    {a.feats&&<div className="flex flex-wrap gap-1.5 mb-4">{a.feats.map((f,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-lg" style={{background:V.w5,border:`1px solid ${V.w12}`}}>{f}</span>)}</div>}
    <div className="flex flex-wrap gap-2 mb-4">
      {a.priceNote&&<div className="rounded-lg px-2.5 py-1.5 text-xs" style={{background:V.w4,border:`1px solid ${V.w10}`}}><div className="opacity-55">{ui.allotPriceRange}</div><div className="font-medium" style={{color:"#e8b86d"}}>{a.priceNote}</div></div>}
      {a.capacity&&<div className="rounded-lg px-2.5 py-1.5 text-xs" style={{background:V.w4,border:`1px solid ${V.w10}`}}><div className="opacity-55">{ui.allotCapacity}</div><div className="font-medium">{a.capacity}</div></div>}
      {a.cancel&&<div className="rounded-lg px-2.5 py-1.5 text-xs" style={{background:V.w4,border:`1px solid ${V.w10}`}}><div className="opacity-55">{ui.allotCancel}</div><div className="font-medium" style={{color:a.cancel==="flex"?"#5dcaa5":a.cancel==="strict"?"#eb6450":"#fac775"}}>{a.cancel==="flex"?ui.allotCancelFlex:a.cancel==="strict"?ui.allotCancelStrict:ui.allotCancelMod}</div></div>}
      {a.pets!==undefined&&<div className="rounded-lg px-2.5 py-1.5 text-xs" style={{background:V.w4,border:`1px solid ${V.w10}`}}><div className="opacity-55">{ui.allotPets}</div><div className="font-medium">{a.pets?"✅":"❌"}</div></div>}
    </div>
    <div className="flex gap-2 mb-3">
      {a.phone&&<a href={`tel:${a.phone}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium no-underline" style={{border:"1px solid rgba(191,233,242,.2)",color:"#bfe9f2"}}><Ic d={I.phone} size={13}/>{ui.call||"Call"}</a>}
      {a.url&&<a href={a.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center py-2 rounded-xl text-xs font-medium no-underline" style={{background:"rgba(232,184,109,.14)",border:"1px solid rgba(232,184,109,.25)",color:"#e8b86d"}}>{tr({CA:"Web",ES:"Web",EN:"Website",FR:"Site web",DE:"Website",NL:"Website",PT:"Website"},lang)}</a>}
      {a.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium no-underline" style={{background:"rgba(191,233,242,.12)",border:"1px solid rgba(191,233,242,.2)",color:"#bfe9f2"}}><Ic d={I.map} size={13}/>{ui.howGet||"Map"}</a>}
    </div>
  </div>);
}

/* ═══════════ GENERIC CONTENT LIST SCREEN ═══════════ */
function ContentScreen({data, lang, nav, title, intro, emoji, detailKey, gradient, extraLinks}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <div className="flex items-center gap-3 mb-4"><span className="text-2xl">{emoji}</span>
      <div><h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{title}</h2>
        {intro&&<p className="text-xs opacity-55">{intro}</p>}</div></div>
    {extraLinks&&<div className="flex gap-2 mb-3">{extraLinks.map((l,i)=>
      <button key={i} onClick={l.go} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium" style={{background:"rgba(93,202,165,.12)",border:"1px solid rgba(93,202,165,.3)",color:"#5dcaa5"}}>
        <span aria-hidden="true">{l.icon}</span>{l.label}</button>)}</div>}
    {data.map((item,i)=>
      <ItemCard key={i} item={item} lang={lang} emoji={item.icon} gradient={gradient}
        onClick={()=>nav.push(detailKey||"contentDetail",{item,parentTitle:title})}/>)}
  </div>);
}

function ContentDetailScreen({item, lang, nav, parentTitle, geo}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={parentTitle} onBack={()=>nav.pop()}/>
    {isRealPhoto(item.photo) && <PhotoHero src={item.photo} emoji={item.icon||"📌"} bg={V.hero2} alt={tr(item.name,lang)}/>}
    <div className="flex items-center gap-3 mb-3"><span className="text-3xl" aria-hidden="true">{item.icon||"📌"}</span>
      <div><h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr(item.name,lang)}</h2>
        {item.tagline&&<p className="text-xs opacity-50 italic">{tr(item.tagline,lang)}</p>}</div></div>
    {item.lead&&<p className="text-sm leading-relaxed mb-4 opacity-75">{tr(item.lead,lang)}</p>}
    {item.age&&<p className="text-xs mb-2 opacity-50">{tr(item.age,lang)}</p>}
    {item.desc&&<p className="text-sm leading-relaxed mb-4 opacity-75">{tr(item.desc,lang)}</p>}
    {item.facts&&<div className="flex flex-col gap-2 mb-4">{item.facts.map((f,i)=><div key={i} className="text-xs"><span className="font-medium">{tr(f.k,lang)}: </span><span className="opacity-50">{tr(f.v,lang)}</span></div>)}</div>}
    {item.sections&&item.sections.filter(s=>s&&(s.title||s.body)).map((s,i)=><div key={i} className="mb-3">{s.title&&<h3 className="text-xs font-semibold opacity-60 mb-1">{tr(s.title,lang)}</h3>}{s.body&&<p className="text-xs leading-relaxed opacity-50">{tr(s.body,lang)}</p>}</div>)}
    {item.tip&&<div className="rounded-xl p-3 mb-3" style={{background:"rgba(240,153,123,.1)",border:"1px solid rgba(240,153,123,.2)"}}><div className="text-xs font-semibold mb-0.5" style={{color:"#f0a98e"}} aria-hidden="true">💡</div><p className="text-xs opacity-65">{tr(item.tip,lang)}</p></div>}
    {item.pop&&<div className="text-xs opacity-45 mb-2">👥 {item.pop}</div>}
    {(item.dist||item.time)&&<div className="flex gap-3 text-xs opacity-55 mb-2">{item.dist&&<span>📏 {item.dist}</span>}{item.time&&<span>⏱️ {item.time}</span>}{item.diff&&<span>🏔️ {tr(item.diff,lang)}</span>}{item.elev&&<span>📈 {item.elev}</span>}</div>}
    {item.start&&<div className="text-xs opacity-55 mb-2">📍 {tr(item.start,lang)}</div>}
    {item.addr&&<div className="text-xs opacity-45 mb-2 flex items-center gap-1"><Ic d={I.pin} size={11} cls="shrink-0"/> {tr(item.addr,lang)}</div>}
    {item.url&&<a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs mb-2 no-underline" style={{color:"#85b7eb"}}>{item.url.replace(/https?:\/\/(www\.)?/,'').split('/')[0]}</a>}
    {item.phone&&<a href={`tel:${item.phone}`} className="text-xs no-underline" style={{color:"#bfe9f2"}}><Ic d={I.phone} size={12}/> {item.phone}</a>}
    {item.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`} target="_blank" rel="noopener noreferrer" aria-label="Open map" className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium no-underline w-full mt-3" style={{background:"rgba(191,233,242,.12)",border:"1px solid rgba(191,233,242,.2)",color:"#bfe9f2"}}><Ic d={I.map} size={14}/>{tr({CA:"Mapa",ES:"Mapa",EN:"Map",FR:"Carte",DE:"Karte",NL:"Kaart",PT:"Mapa"},lang)}</a>}
    {item.lat&&geo&&<p className="text-xs text-center opacity-40 mt-1">📡 {distKm(geo,item)?.toFixed(1)} km</p>}
    {item.lat&&(()=>{
      const allPts=[...D_NAT,...D_PUEB,...D_ACT,...D_BEACH].filter(p=>p.lat&&p!==item);
      const nearby=allPts.map(p=>({...p,d:distKm(item,p)})).filter(p=>p.d&&p.d<15).sort((a,b)=>a.d-b.d).slice(0,3);
      if(!nearby.length) return null;
      return <div className="mt-5"><h3 className="text-xs font-bold uppercase tracking-wider opacity-40 mb-2">{tr({CA:"A prop",ES:"Cerca",EN:"Nearby",FR:"À proximité",DE:"In der Nähe",NL:"In de buurt",PT:"Perto"},lang)}</h3>
        {nearby.map((n,i)=><button key={i} onClick={()=>nav.push("contentDetail",{item:n,parentTitle:parentTitle})} className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg mb-1" style={{background:V.w3}}>
          <span className="text-sm" aria-hidden="true">{n.icon||"📍"}</span><div className="flex-1 min-w-0 text-xs font-medium truncate">{tr(n.name,lang)}</div><span className="text-xs opacity-40 shrink-0">{n.d.toFixed(1)}km</span>
        </button>)}</div>;
    })()}
  </div>);
}


/* ═══════════ GEOLOCATION ═══════════ */
function useGeo() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => setPos({lat:p.coords.latitude, lng:p.coords.longitude}),
      () => {}, {enableHighAccuracy:false, timeout:8000, maximumAge:300000}
    );
  }, []);
  return pos;
}
function distKm(a, b) {
  if (!a || !b) return null;
  const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
  const x=Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}


/* ═══════════ ANALYTICS (placeholder) ═══════════ */
function trackEvent(name, params={}) {
  // Replace with real analytics (Google Analytics, Plausible, etc)
  // window.gtag?.("event", name, params);
  if(typeof window !== "undefined" && window._deltaAnalytics) window._deltaAnalytics(name, params);
}

/* ═══════════ OPEN NOW HELPER ═══════════ */
function isOpenNow(hours) {
  if (!hours || !Array.isArray(hours)) return null;
  const now = new Date();
  const di = now.getDay(); const dx = di===0?6:di-1;
  const h = hours[dx];
  if (!h) return false;
  const nowMin = now.getHours()*60 + now.getMinutes();
  const ranges = h.split('/').map(r=>r.trim());
  return ranges.some(range => {
    const m = range.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/);
    if(!m) return false;
    const open = parseInt(m[1])*60+parseInt(m[2]);
    const close = parseInt(m[3])*60+parseInt(m[4]);
    // Si el tancament és anterior o igual a l'obertura, l'horari creua la mitjanit
    return close <= open
      ? (nowMin >= open || nowMin <= close)
      : (nowMin >= open && nowMin <= close);
  });
}


/* ═══════════ RGPD CONSENT ═══════════ */
function ConsentBanner({lang, onAccept}) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,padding:12,background:"rgba(0,0,0,.92)",backdropFilter:"blur(10px)",borderTop:"1px solid rgba(255,255,255,.1)"}}>
      <p style={{fontSize:12,color:"#ccc",marginBottom:8,lineHeight:1.5}}>{tr({
        CA:"Aquesta app utilitza l'API Open-Meteo per al temps i pot demanar la teva ubicació per calcular distàncies. No recopilem ni emmagatzemem dades personals.",
        ES:"Esta app usa la API Open-Meteo para el tiempo y puede pedir tu ubicación para calcular distancias. No recopilamos ni almacenamos datos personales.",
        EN:"This app uses the Open-Meteo API for weather and may request your location for distances. We don't collect or store personal data.",
        FR:"Cette app utilise l'API Open-Meteo pour la météo et peut demander votre position. Nous ne collectons aucune donnée personnelle.",
        DE:"Diese App nutzt die Open-Meteo-API für Wetter und kann Ihren Standort anfragen. Wir sammeln keine persönlichen Daten.",
        NL:"Deze app gebruikt de Open-Meteo API voor weer en kan uw locatie vragen. We verzamelen geen persoonlijke gegevens.",
        PT:"Esta app usa a API Open-Meteo para meteorologia e pode pedir a sua localização. Não recolhemos dados pessoais."
      },lang)}</p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>onAccept(true)} style={{flex:1,padding:"8px 16px",borderRadius:10,border:"1px solid rgba(93,202,165,.4)",background:"rgba(93,202,165,.15)",color:"#5dcaa5",fontSize:13,fontWeight:600,cursor:"pointer"}}>{tr({CA:"Acceptar",ES:"Aceptar",EN:"Accept",FR:"Accepter",DE:"Akzeptieren",NL:"Accepteren",PT:"Aceitar"},lang)}</button>
        <button onClick={()=>onAccept(false)} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"#999",fontSize:13,cursor:"pointer"}}>{tr({CA:"Només essencial",ES:"Solo esencial",EN:"Essential only",FR:"Uniquement l'essentiel",DE:"Nur Notwendiges",NL:"Alleen essentieel",PT:"Só essencial"},lang)}</button>
      </div>
    </div>
  );
}

/* ═══════════ TOAST ═══════════ */
function Toast({msg}) {
  if(!msg) return null;
  return <div role="status" aria-live="polite" style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.85)",color:"#fff",padding:"8px 18px",borderRadius:12,fontSize:12,fontWeight:500,zIndex:99,animation:"fadeIn .2s ease",backdropFilter:"blur(8px)",pointerEvents:"none"}}>{msg}</div>;
}

/* ═══════════ WEATHER WIDGET ═══════════ */

function WeatherWidget({lang, nav}) {
  const [w, setW] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(()=>{
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.72&longitude=0.73&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Madrid&forecast_days=3")
      .then(r=>{ if(!r.ok) throw new Error("weather "+r.status); return r.json(); }).then(d=>setW(d)).catch(()=>setFailed(true));
  },[]);
  if (failed) return null;
  if (!w) return (
    <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{background:"rgba(133,183,235,.06)",border:"1px solid rgba(133,183,235,.12)"}}>
      <div className="w-9 h-9 rounded-lg" style={{background:"rgba(133,183,235,.1)"}}/>
      <div className="flex-1"><div className="h-4 w-16 rounded mb-1.5" style={{background:"rgba(133,183,235,.08)"}}/><div className="h-3 w-28 rounded" style={{background:"rgba(133,183,235,.05)"}}/></div>
    </div>);
  if (!w?.current) return null;
  const cur = w.current;
  const icon = WMO_ICONS[cur.weathercode] || "🌡️";
  // Weather-based suggestion
  const code=cur.weathercode;const temp=cur.temperature_2m;
  const sunny=code<=2&&temp>20;const rainy=code>=51;const hot=temp>30;const mild=temp>15&&temp<=25&&code<=3;
  const suggestion=sunny?{icon:"🏖️",text:{CA:"Dia perfecte per a la platja!",ES:"¡Día perfecto para la playa!",EN:"Perfect beach day!",FR:"Journée plage parfaite!",DE:"Perfekter Strandtag!",NL:"Perfecte stranddag!",PT:"Dia perfeito para praia!"},go:()=>nav.push("beaches")}
    :rainy?{icon:"🏛️",text:{CA:"Pluja? Ideal per museus i gastronomia",ES:"¿Lluvia? Ideal para museos y gastronomía",EN:"Rainy? Perfect for museums & food",FR:"Pluie? Parfait pour musées",DE:"Regen? Perfekt für Museen",NL:"Regen? Ideaal voor musea",PT:"Chuva? Ideal para museus"},go:()=>nav.push("heritage")}
    :hot?{icon:"🧊",text:{CA:"Calor! Refrescat a les llacunes",ES:"¡Calor! Refréscate en las lagunas",EN:"Hot! Cool off at the lagoons",FR:"Chaud! Direction les lagunes",DE:"Heiß! Abkühlung an den Lagunen",NL:"Heet! Afkoelen bij de lagunes",PT:"Calor! Refresque-se nas lagoas"},go:()=>nav.push("nature")}
    :mild?{icon:"🚲",text:{CA:"Temps ideal per una ruta en bici",ES:"Tiempo ideal para bici",EN:"Ideal cycling weather",FR:"Temps idéal pour le vélo",DE:"Ideales Radwetter",NL:"Ideaal fietsweer",PT:"Tempo ideal para bicicleta"},go:()=>nav.push("bikes")}
    :null;
  return (<>
    <div className="rounded-xl p-3 mb-2 flex items-center gap-3" style={{background:"rgba(133,183,235,.1)",border:"1px solid rgba(133,183,235,.2)"}}>
      <span className="text-3xl" aria-hidden="true">{icon}</span>
      <div className="flex-1">
        <div className="text-lg font-bold">{Math.round(cur.temperature_2m)}°C</div>
        <div className="text-xs opacity-50">{tr({CA:"Vent",ES:"Viento",EN:"Wind",FR:"Vent",DE:"Wind",NL:"Wind",PT:"Vento"},lang)} {Math.round(cur.windspeed_10m)} km/h · {tr({CA:"Humitat",ES:"Humedad",EN:"Humidity",FR:"Humidité",DE:"Feuchtigkeit",NL:"Vochtigheid",PT:"Humidade"},lang)} {cur.relative_humidity_2m}%</div>
      </div>
      {w.daily && <div className="flex gap-2">{w.daily.time.slice(0,3).map((d,i)=>
        <div key={i} className="text-center text-xs"><div className="opacity-55">{d.slice(5)}</div>
          <div aria-hidden="true">{WMO_ICONS[w.daily.weathercode[i]]||"🌡️"}</div>
          <div className="font-medium">{Math.round(w.daily.temperature_2m_max[i])}°</div>
          <div className="opacity-55">{Math.round(w.daily.temperature_2m_min[i])}°</div></div>)}</div>}
    </div>
    {suggestion&&<button onClick={suggestion.go} className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2 w-full text-left" style={{background:"rgba(133,183,235,.08)",border:"1px solid rgba(133,183,235,.15)"}}>
      <span className="text-lg" aria-hidden="true">{suggestion.icon}</span><p className="text-xs opacity-60 flex-1">{tr(suggestion.text,lang)}</p><Ic d={I.chev} size={14} cls="opacity-35"/></button>}
  </>);
}

/* ═══════════ BIRDING SCREEN ═══════════ */
function BirdingScreen({lang, nav, ui}) {
  const [tab, setTab] = useState("species");
  const seasonIcons = {resident:"🏠",summer:"☀️",winter:"❄️",passage:"🔄"};
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <div className="flex items-center gap-3 mb-4"><span className="text-2xl" aria-hidden="true">🐦</span>
      <div><h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>Birding</h2>
        <p className="text-xs opacity-55">{tr({CA:"350+ espècies al delta",ES:"350+ especies en el delta",EN:"350+ species in the delta",FR:"350+ espèces dans le delta",DE:"350+ Arten im Delta",NL:"350+ soorten in de delta",PT:"350+ espécies no delta"},lang)}</p></div></div>
    <Chips opts={[{v:"species",l:tr({CA:"Espècies",ES:"Especies",EN:"Species",FR:"Espèces",DE:"Arten",NL:"Soorten",PT:"Espécies"},lang)},{v:"hides",l:tr({CA:"Observatoris",ES:"Observatorios",EN:"Hides",FR:"Observatoires",DE:"Beobachtungspunkte",NL:"Vogelkijkhutten",PT:"Observatórios"},lang)}]} active={tab} onTap={setTab}/>
    
    {tab==="species" && D_BIRDS.map((b,i)=>
      <div key={b.id||i} className="flex gap-3 px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
        <span className="text-2xl" aria-hidden="true">{b.icon||"🐦"}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{tr(b.name,lang)}</div>
          <div className="text-xs opacity-45 italic">{b.sci}</div>
          {b.desc&&<p className="text-xs opacity-50 mt-1">{tr(b.desc,lang)}</p>}
          {b.when&&<div className="flex items-center gap-1 mt-1 text-xs opacity-55">{seasonIcons[b.season]||"📅"} {tr(b.when,lang)}</div>}
        </div>
      </div>)}
    
    {tab==="hides" && D_HIDES.map((h,i)=>
      <div key={h.id||i} className="flex gap-3 px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
        <span className="text-xl" aria-hidden="true">🔭</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{h.name}</div>
          <p className="text-xs opacity-50 mt-0.5">{tr(h.desc,lang)}</p>
        </div>
        {h.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer" className="shrink-0 no-underline"><Ic d={I.map} size={16} cls="opacity-45"/></a>}
      </div>)}
  </div>);
}

/* ═══════════ FISHING SCREEN ═══════════ */
function FishingScreen({lang, nav, ui}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.pescaTitle||"Pesca"}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.pescaIntro}</p>
    {D_PESCA.map((p,i)=>
      <ItemCard key={p.id||i} item={p} lang={lang} emoji={p.icon==="river"?"🐟":p.icon==="sea"?"🌊":p.icon==="surf"?"🏄":p.icon==="kayak"?"🛶":"🎣"}
        onClick={()=>nav.push("contentDetail",{item:p,parentTitle:ui.pescaTitle||"Pesca"})}/>)}
    {D_PISC.length>0 && <>
      <h3 className="text-xs font-bold opacity-55 uppercase tracking-wider mt-5 mb-2">{tr({CA:"Marisc, pesca i aqüicultura",ES:"Marisco, pesca y acuicultura",EN:"Seafood, fishing and aquaculture",FR:"Fruits de mer, pêche et aquaculture",DE:"Meeresfrüchte, Fischerei und Aquakultur",NL:"Zeevruchten, visserij en aquacultuur",PT:"Marisco, pesca e aquicultura"},lang)}</h3>
      {D_PISC.map((p,i)=>
        <div key={i} className="px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
          <div className="font-medium text-sm">{tr(p.name,lang)}</div>
          <p className="text-xs opacity-50 mt-0.5">{tr(p.desc,lang)}</p>
          {p.products&&<div className="text-xs opacity-55 mt-1">🐟 {tr(p.products,lang)}</div>}
        </div>)}
    </>}
  </div>);
}

/* ═══════════ RICE CYCLE SCREEN ═══════════ */
function RiceCycleScreen({lang}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5" style={{maxWidth:430}}>
    <div className="text-center mb-5">
      <span className="text-3xl" aria-hidden="true">🌾</span>
      <h2 className="text-lg font-semibold mt-1" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr({CA:"El cicle de l'arròs",ES:"El ciclo del arroz",EN:"The rice cycle",FR:"Le cycle du riz",DE:"Der Reiszyklus",NL:"De rijstcyclus",PT:"O ciclo do arroz"},lang)}</h2>
    </div>
    <div className="flex flex-col gap-2">
      {D_RICE.map((r,i)=>
        <div key={i} className="flex gap-3 items-start px-3 py-3 rounded-xl" style={{background:`${r.color}18`,border:`1px solid ${r.color}30`}}>
          <div className="text-2xl shrink-0">{r.emoji}</div>
          <div>
            <div className="font-medium text-sm" style={{color:r.color}}>{tr(r.name,lang)}</div>
            <p className="text-xs opacity-60 mt-0.5 leading-relaxed">{tr(r.desc,lang)}</p>
            {r.landscape&&<p className="text-xs opacity-55 mt-1 italic">{tr(r.landscape,lang)}</p>}
          </div>
        </div>)}
    </div>
  </div>);
}

/* ═══════════ MARKETS SCREEN ═══════════ */
function MarketsScreen({lang, nav, ui}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.sMerc||"Mercats"}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.sMercD}</p>
    {D_MERCATS.map((m,i)=>
      <ItemCard key={i} item={m} lang={lang} emoji={m.icon||"🛒"}
        onClick={()=>nav.push("contentDetail",{item:m,parentTitle:ui.sMerc||"Mercats"})}
        gradient="linear-gradient(135deg,rgba(240,153,123,.12),rgba(232,184,109,.1))"/>)}
  </div>);
}

/* ═══════════ EXPERIENCE ROUTES SCREEN ═══════════ */
function RutesExpScreen({lang, nav, ui}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.sRutas||"Rutes"}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.sRutasD}</p>
    {D_RUTES_EXP.map((r,i)=>
      <ItemCard key={i} item={r} lang={lang} emoji={r.icon||"🍷"}
        onClick={()=>nav.push("contentDetail",{item:r,parentTitle:ui.sRutas||"Rutes"})}
        gradient="linear-gradient(135deg,rgba(232,184,109,.15),rgba(201,160,220,.1))"/>)}
  </div>);
}

/* ═══════════ PRODUCTS ═══════════ */
function ProductsScreen({lang, nav, ui}) {
  const icons={rice:"🌾",oil:"🫒",shell:"🦪",salt:"🧂",honey:"🍯",galera:"🦐",shrimp:"🦐",anguila:"🐍",citrus:"🍊",carxofa:"🥬"};
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.sProd}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.sProdD}</p>
    {D_PROD.map((p,i)=><div key={i} className="flex gap-3 px-3 py-3 rounded-2xl mb-2" style={{background:V.w6,border:`1px solid ${V.w12}`}}>
      <span className="text-2xl shrink-0" aria-hidden="true">{icons[p.icon]||"🌿"}</span>
      <div className="min-w-0"><div className="font-medium text-sm">{tr(p.name,lang)}</div><div className="text-xs opacity-55 italic">{tr(p.tagline,lang)}</div><p className="text-xs opacity-55 mt-1 leading-relaxed">{tr(p.lead,lang)}</p></div></div>)}
  </div>);
}

/* ═══════════ EVENTS ═══════════ */
function EventsScreen({lang, nav, ui}) {
  const moNames = {
    CA:{6:"Juny",7:"Juliol",8:"Agost",9:"Setembre",10:"Octubre"},
    ES:{6:"Junio",7:"Julio",8:"Agosto",9:"Septiembre",10:"Octubre"},
    EN:{6:"June",7:"July",8:"August",9:"September",10:"October"},
    FR:{6:"Juin",7:"Juillet",8:"Août",9:"Septembre",10:"Octobre"},
    DE:{6:"Juni",7:"Juli",8:"August",9:"September",10:"Oktober"},
    NL:{6:"Juni",7:"Juli",8:"Augustus",9:"September",10:"Oktober"},
    PT:{6:"Junho",7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro"},
  };
  const mo = moNames[lang] || moNames.ES;
  // Consciència de la data: marquem cada esdeveniment com a passat / en curs / pròxim.
  const {byM, nextId, allPast} = useMemo(()=>{
    const now = new Date();
    const cM = now.getMonth()+1, cD = now.getDate();
    const statusOf = (e)=>{
      const from = e.dayFrom||1, to = e.dayTo||e.dayFrom||31;
      if (e.month < cM || (e.month===cM && to < cD)) return "past";
      if (e.month===cM && from<=cD && cD<=to) return "now";
      return "future";
    };
    const all = D_EVENTS.map(e=>({...e, _st:statusOf(e)}))
      .sort((a,b)=> a.month-b.month || (a.dayFrom||0)-(b.dayFrom||0));
    const next = all.find(e=>e._st==="future");
    const m={}; all.forEach(e=>{(m[e.month]=m[e.month]||[]).push(e);});
    return {byM:m, nextId: next?next.id:null, allPast: all.every(e=>e._st==="past")};
  },[]);
  const L = {
    now:{CA:"Ara",ES:"Ahora",EN:"Now",FR:"En cours",DE:"Jetzt",NL:"Nu",PT:"Agora"},
    next:{CA:"Pròxim",ES:"Próximo",EN:"Next",FR:"Prochain",DE:"Nächste",NL:"Volgende",PT:"Próximo"},
    past:{CA:"Passat",ES:"Pasado",EN:"Past",FR:"Passé",DE:"Vorbei",NL:"Voorbij",PT:"Passado"},
    ended:{CA:"La temporada d'enguany ha finalitzat. Aquests són els esdeveniments habituals; les dates es confirmen cada any.",ES:"La temporada de este año ha finalizado. Estos son los eventos habituales; las fechas se confirman cada año.",EN:"This year's season has ended. These are the regular events; dates are confirmed each year.",FR:"La saison de cette année est terminée. Voici les événements habituels ; les dates sont confirmées chaque année.",DE:"Die diesjährige Saison ist beendet. Dies sind die üblichen Veranstaltungen; die Termine werden jährlich bestätigt.",NL:"Het seizoen van dit jaar is afgelopen. Dit zijn de gebruikelijke evenementen; data worden jaarlijks bevestigd.",PT:"A temporada deste ano terminou. Estes são os eventos habituais; as datas confirmam-se a cada ano."},
  };
  const badge = (txt,color)=><span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0" style={{background:color+"22",color,border:`1px solid ${color}55`}}>{txt}</span>;
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.agendaTitle||"Agenda"}</h2>
    <p className="text-xs opacity-55 mb-4">{ui.agendaIntro}</p>
    {allPast && <div className="rounded-xl px-3 py-2.5 mb-4 text-xs" style={{background:"rgba(232,184,109,.1)",border:"1px solid rgba(232,184,109,.25)",color:"#e8b86d"}}>{tr(L.ended,lang)}</div>}
    {Object.entries(byM).sort(([a],[b])=>a-b).map(([m,evts])=><div key={m} className="mb-4">
      <h3 className="text-xs font-bold opacity-55 uppercase tracking-wider mb-2">{mo[m]||`Month ${m}`}</h3>
      {evts.map(e=>{const past=e._st==="past";return (
        <div key={e.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1.5" style={{background:e.type==="festa"?"rgba(201,160,220,.07)":"rgba(232,184,109,.07)",border:`1px solid ${e.type==="festa"?"rgba(201,160,220,.2)":"rgba(232,184,109,.2)"}`,opacity:past?.5:1}}>
          <span className="text-xl" aria-hidden="true">{e.ic}</span>
          <div className="min-w-0 flex-1"><div className="font-medium text-sm">{tr(e.name,lang)}</div><div className="text-xs opacity-55">{tr(e.town,lang)} · {e.dayLabel}</div></div>
          {e._st==="now" && badge(tr(L.now,lang),"#5dcaa5")}
          {e.id===nextId && badge(tr(L.next,lang),"#85b7eb")}
          {past && badge(tr(L.past,lang),"#9aa0a6")}
        </div>);})}
    </div>)}
  </div>);
}

/* ═══════════ EMERGENCY SCREEN ═══════════ */
function EmergencyScreen({lang, nav}) {
  const title={CA:"Urgències i Serveis",ES:"Urgencias y Servicios",EN:"Emergencies & Services",FR:"Urgences et Services",DE:"Notfälle & Dienste",NL:"Noodgevallen",PT:"Urgências e Serviços"};
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <div className="flex items-center gap-3 mb-4"><span className="text-2xl" aria-hidden="true">🆘</span>
      <h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr(title,lang)}</h2></div>
    <div className="rounded-xl p-3 mb-4" style={{background:"rgba(232,90,80,.1)",border:"1px solid rgba(232,90,80,.25)"}}>
      <div className="text-xs font-bold mb-1" style={{color:"#eb6450"}}>112 — {tr({CA:"Número europeu d'emergències",ES:"Número europeo de emergencias",EN:"European emergency number",FR:"Numéro d'urgence européen",DE:"Europäische Notrufnummer",NL:"Europees alarmnummer",PT:"Número europeu de emergência"},lang)}</div>
      <p className="text-xs opacity-50">{tr({CA:"Funciona sense cobertura del teu operador. Desa aquest número al mòbil.",ES:"Funciona sin cobertura de tu operador. Guarda este número en tu móvil.",EN:"Works without your operator's coverage. Save this number.",FR:"Fonctionne sans couverture de votre opérateur. Enregistrez ce numéro.",DE:"Funktioniert ohne Netzabdeckung Ihres Anbieters. Speichern Sie diese Nummer.",NL:"Werkt zonder dekking van je provider. Sla dit nummer op.",PT:"Funciona sem cobertura do operador. Guarde este número no telemóvel."},lang)}</p>
    </div>
    {EMERGENCY_NUMS.map((n,i)=><a key={i} href={`tel:${n.num.replace(/\s/g,'')}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 no-underline" style={{background:V.w4,border:`1px solid ${V.w10}`,color:"inherit"}}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{background:"rgba(232,90,80,.12)",color:"#eb6450"}}><Ic d={I.phone} size={16}/></div>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium">{n.name}</div>{n.desc&&<div className="text-xs opacity-55">{tr(n.desc,lang)}</div>}</div>
      <div className="text-sm font-bold" style={{color:"#eb6450"}}>{n.num}</div></a>)}
  </div>);
}

/* ═══════════ NIGHTLIFE ═══════════ */
function NightlifeScreen({lang, nav, ui}) {
  const typeIcons={disco:"🪩",pub:"🍻",beach_bar:"🏖️",beach:"🏖️"};
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-0.5" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr({CA:"Vida nocturna",ES:"Vida nocturna",EN:"Nightlife",FR:"Vie nocturne",DE:"Nachtleben",NL:"Nachtleven",PT:"Vida noturna"},lang)}</h2>
    <p className="text-xs opacity-55 mb-4">{tr({CA:"Discoteques, pubs i bars del delta",ES:"Clubs, pubs y bares del delta",EN:"Clubs, pubs and bars of the delta",FR:"Clubs, pubs et bars du delta",DE:"Clubs, Pubs und Bars des Deltas",NL:"Clubs, pubs en bars van de delta",PT:"Clubes, pubs e bares do delta"},lang)}</p>
    {D_LOCALS.map((l,i)=><div key={l.id||i} className="flex gap-3 px-3 py-2.5 rounded-xl mb-1.5" style={{background:"rgba(201,160,220,.06)",border:"1px solid rgba(201,160,220,.18)"}}>
      <span className="text-xl">{typeIcons[l.type]||"🌙"}</span>
      <div className="min-w-0 flex-1"><div className="font-medium text-sm">{typeof l.name==='string'?l.name:tr(l.name,lang)}</div><div className="text-xs opacity-55">{tr(l.town,lang)}</div>{l.desc&&<p className="text-xs opacity-50 mt-0.5">{tr(l.desc,lang)}</p>}</div>
      <div className="shrink-0 flex flex-col gap-2 items-center justify-center">
        {l.phone&&<a href={`tel:${l.phone}`} rel="noopener noreferrer" className="no-underline" aria-label={ui.call||"Call"}><Ic d={I.phone} size={15} cls="opacity-55"/></a>}
        {l.lat&&<a href={l.pid?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(typeof l.name==='string'?l.name:tr(l.name,lang))}&query_place_id=${l.pid}`:`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`} target="_blank" rel="noopener noreferrer" className="no-underline" aria-label={ui.allotMapBtn||"Map"}><Ic d={I.map} size={16} cls="opacity-45"/></a>}
      </div>
    </div>)}
  </div>);
}

/* ═══════════ MAP SCREEN (OPENSTREETMAP) ═══════════ */
function MapScreen({lang, nav, ui, geo}) {
  const [cat, setCat] = useState("all");
  const iframeRef = useRef(null);
  const readyRef = useRef(false);
  const catRef = useRef(cat); catRef.current = cat;
  const goRef = useRef([]);

  const points = useMemo(() => {
    const pts = [];
    D_BEACH.forEach((b,i) => b.lat && pts.push({cat:"beach",name:tr(b.name,lang),lat:b.lat,lng:b.lng,icon:"🏖️",go:()=>nav.push("beachDetail",{beach:b,idx:i})}));
    D_NAT.forEach(n => n.lat && pts.push({cat:"nature",name:tr(n.name,lang),lat:n.lat,lng:n.lng,icon:"🦩",go:()=>nav.push("contentDetail",{item:n,parentTitle:ui.natTitle})}));
    D_PUEB.forEach(p => p.lat && pts.push({cat:"town",name:tr(p.name,lang),lat:p.lat,lng:p.lng,icon:"🏘️",go:()=>nav.push("contentDetail",{item:p,parentTitle:ui.puebTitle})}));
    D_HIDES.forEach(h => h.lat && pts.push({cat:"bird",name:h.name,lat:h.lat,lng:h.lng,icon:"🔭",go:()=>nav.push("birding")}));
    D_ALLOT.forEach(a => a.lat && pts.push({cat:"stay",name:tr(a.name,lang),lat:a.lat,lng:a.lng,icon:"🏠",go:()=>nav.push("allotDetail",{allot:a})}));
    return pts;
  }, [lang]);
  goRef.current = points.map(p => p.go);

  const filtered = cat === "all" ? points : points.filter(p => p.cat === cat);
  const sorted = geo ? [...filtered].sort((a,b)=>(distKm(geo,a)||999)-(distKm(geo,b)||999)) : filtered;
  const catColors = {beach:"#85b7eb",nature:"#5dcaa5",town:"#e8b86d",bird:"#c9a0dc",stay:"#f0997b"};
  const catLabels = {
    beach:{CA:"Platges",ES:"Playas",EN:"Beaches",FR:"Plages",DE:"Strände",NL:"Stranden",PT:"Praias"},
    nature:{CA:"Natura",ES:"Naturaleza",EN:"Nature",FR:"Nature",DE:"Natur",NL:"Natuur",PT:"Natureza"},
    town:{CA:"Pobles",ES:"Pueblos",EN:"Villages",FR:"Villages",DE:"Dörfer",NL:"Dorpen",PT:"Aldeias"},
    bird:{CA:"Observatoris",ES:"Observatorios",EN:"Hides",FR:"Observatoires",DE:"Beobachtung",NL:"Kijkhutten",PT:"Observatórios"},
    stay:{CA:"Allotjament",ES:"Alojamiento",EN:"Stay",FR:"Hébergement",DE:"Unterkunft",NL:"Verblijf",PT:"Alojamento"},
  };
  const cats = [
    {v:"all",l:tr({CA:"Tot",ES:"Todo",EN:"All",FR:"Tout",DE:"Alle",NL:"Alles",PT:"Tudo"},lang)},
    {v:"beach",l:"🏖️"},{v:"nature",l:"🦩"},{v:"town",l:"🏘️"},{v:"bird",l:"🔭"},{v:"stay",l:"🏠"},
  ];
  const dark = V.fg === "#eef7f9";

  // Mapa interactiu autocontingut: Leaflet via CDN dins d'un iframe aïllat.
  const srcDoc = useMemo(() => {
    const mapPts = points.map((p,idx)=>({idx,cat:p.cat,name:p.name,lat:p.lat,lng:p.lng,color:catColors[p.cat]||"#5dcaa5"}));
    const payload = JSON.stringify({
      pts: mapPts,
      view: tr({CA:"Veure",ES:"Ver",EN:"View",FR:"Voir",DE:"Ansehen",NL:"Bekijk",PT:"Ver"},lang),
      dir: tr({CA:"Com arribar",ES:"Cómo llegar",EN:"Directions",FR:"Itinéraire",DE:"Route",NL:"Route",PT:"Como chegar"},lang),
      nomap: tr({CA:"No s'ha pogut carregar el mapa interactiu. Pots fer servir la llista de sota o obrir-lo a Google Maps.",ES:"No se pudo cargar el mapa interactivo. Puedes usar la lista de abajo o abrirlo en Google Maps.",EN:"The interactive map couldn't load. Use the list below or open it in Google Maps.",FR:"La carte interactive n'a pas pu se charger. Utilisez la liste ci-dessous ou ouvrez-la dans Google Maps.",DE:"Die interaktive Karte konnte nicht geladen werden. Nutze die Liste unten oder Google Maps.",NL:"De interactieve kaart kon niet laden. Gebruik de lijst hieronder of open Google Maps.",PT:"Não foi possível carregar o mapa interativo. Usa a lista abaixo ou abre no Google Maps."},lang),
    }).replace(/</g, "\\u003c");
    const tile = dark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
    const bodyBg = dark ? "#0a3f44" : "#eae6dd";
    const fbColor = dark ? "#cfe9ee" : "#33484f";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#map{height:100%;margin:0}body{background:${bodyBg}}
.leaflet-popup-content{font:13px -apple-system,system-ui,sans-serif;margin:10px 12px}
.dp-name{font-weight:600;margin-bottom:6px;color:#06303a}
.dp-btns{display:flex;gap:6px}
.dp-btns a,.dp-btns button{font:600 12px -apple-system,sans-serif;border:0;border-radius:8px;padding:5px 10px;cursor:pointer;text-decoration:none}
.dp-view{background:#2c6a5c;color:#fff}.dp-dir{background:#85b7eb;color:#05303a}
#fb{position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center;padding:24px;font:14px -apple-system,sans-serif;color:${fbColor};z-index:500}
</style></head><body>
<div id="map"></div><div id="fb"></div>
<script type="application/json" id="data">${payload}</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>(function(){
  var P={}; try{ P=JSON.parse(document.getElementById("data").textContent); }catch(e){}
  function fail(){ var f=document.getElementById("fb"); f.textContent=P.nomap||"Map unavailable"; f.style.display="flex"; }
  if(typeof L==="undefined"){ fail(); return; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  try{
    var map=L.map("map",{zoomControl:true}).setView([40.72,0.73],11);
    L.tileLayer("${tile}",{maxZoom:19,subdomains:"abcd",attribution:"&copy; OpenStreetMap, &copy; CARTO"}).addTo(map);
    var markers=[], bounds=[];
    (P.pts||[]).forEach(function(p){
      var m=L.circleMarker([p.lat,p.lng],{radius:7,weight:1.5,color:"#fff",fillColor:p.color,fillOpacity:0.95});
      var html='<div class="dp-name">'+esc(p.name)+'</div>'
        +'<div class="dp-btns">'
        +'<button class="dp-view" onclick="GO('+p.idx+')">'+esc(P.view)+'</button>'
        +'<a class="dp-dir" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination='+p.lat+','+p.lng+'">'+esc(P.dir)+'</a>'
        +'</div>';
      m.bindPopup(html); m._cat=p.cat; m.addTo(map); markers.push(m); bounds.push([p.lat,p.lng]);
    });
    if(bounds.length) map.fitBounds(bounds,{padding:[28,28]});
    window.GO=function(i){ parent.postMessage({type:"delta-map-go",idx:i},"*"); };
    window.addEventListener("message",function(e){
      var d=e.data||{};
      if(d.type==="delta-filter"){
        var vb=[];
        markers.forEach(function(m){
          var show=(d.cat==="all"||m._cat===d.cat);
          if(show){ if(!map.hasLayer(m)) m.addTo(map); vb.push(m.getLatLng()); }
          else { if(map.hasLayer(m)) map.removeLayer(m); }
        });
        if(vb.length) map.fitBounds(vb,{padding:[28,28]});
      }
    });
    parent.postMessage({type:"delta-map-ready"},"*");
  }catch(err){ fail(); }
})();</script></body></html>`;
  }, [lang, dark]);

  // Reinicia l'estat de "preparat" quan es regenera el mapa (canvi d'idioma/tema).
  useEffect(() => { readyRef.current = false; }, [srcDoc]);

  // Escolta els missatges de l'iframe (marcador tocat → obre la fitxa; mapa preparat → aplica filtre).
  useEffect(() => {
    const onMsg = (e) => {
      // Seguretat: només acceptem missatges del nostre propi iframe del mapa.
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow) return;
      const d = e.data || {};
      if (d.type === "delta-map-ready") {
        readyRef.current = true;
        try { iframeRef.current?.contentWindow?.postMessage({type:"delta-filter",cat:catRef.current},"*"); } catch (err) {}
      } else if (d.type === "delta-map-go" && typeof d.idx === "number") {
        const g = goRef.current[d.idx];
        if (g) g();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // En canviar de categoria, filtra el mapa (sense recarregar Leaflet).
  useEffect(() => {
    if (readyRef.current) {
      try { iframeRef.current?.contentWindow?.postMessage({type:"delta-filter",cat},"*"); } catch (err) {}
    }
  }, [cat]);

  const shareUrl = "https://delta-ebre.app";
  const handleShare = () => {
    if (navigator.share) { navigator.share({title:"Delta de l'Ebre",url:shareUrl}).catch(()=>{}); }
    else { navigator.clipboard?.writeText(shareUrl).then(()=>{}); }
  };

  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-2" style={{fontFamily:"Georgia,serif",color:V.title}}>📍 {tr({CA:"Mapa del delta",ES:"Mapa del delta",EN:"Delta map",FR:"Carte du delta",DE:"Delta-Karte",NL:"Deltakaart",PT:"Mapa do delta"},lang)}</h2>

    {/* Mapa interactiu real (Leaflet) amb tots els punts */}
    <div className="rounded-xl overflow-hidden mb-2 relative" style={{border:`1px solid ${V.w14}`}}>
      <iframe ref={iframeRef} title={tr({CA:"Mapa interactiu del Delta de l'Ebre",ES:"Mapa interactivo del Delta del Ebro",EN:"Interactive map of the Ebro Delta",FR:"Carte interactive du delta de l'Èbre",DE:"Interaktive Karte des Ebrodeltas",NL:"Interactieve kaart van de Ebrodelta",PT:"Mapa interativo do Delta do Ebro"},lang)}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        srcDoc={srcDoc} loading="lazy" style={{display:"block",width:"100%",height:320,border:0}}/>
    </div>

    {/* Llegenda de colors */}
    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 px-1">
      {Object.keys(catColors).map(k=>(
        <span key={k} className="inline-flex items-center gap-1 text-xs opacity-55">
          <span className="inline-block rounded-full" aria-hidden="true" style={{width:8,height:8,background:catColors[k]}}/>
          {tr(catLabels[k],lang)}
        </span>
      ))}
    </div>

    <a href="https://www.google.com/maps/place/Delta+de+l'Ebre/@40.72,0.73,11z" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium no-underline mb-4" style={{background:"rgba(133,183,235,.12)",border:"1px solid rgba(133,183,235,.25)",color:"#85b7eb"}}>
      <Ic d={I.map} size={14}/> {tr({CA:"Obre a Google Maps",ES:"Abrir en Google Maps",EN:"Open in Google Maps",FR:"Ouvrir dans Google Maps",DE:"In Google Maps öffnen",NL:"Openen in Google Maps",PT:"Abrir no Google Maps"},lang)}</a>

    {/* Category filter + points list */}
    <Chips opts={cats} active={cat} onTap={setCat}/>
    <p className="text-xs opacity-45 mb-2">{sorted.length} {tr({CA:"punts",ES:"puntos",EN:"points",FR:"points",DE:"Punkte",NL:"punten",PT:"pontos"},lang)}{geo&&" · 📡 "+tr({CA:"per distància",ES:"más cerca primero",EN:"by distance",FR:"les plus proches",DE:"Nächstgelegene zuerst",NL:"dichtstbij eerst",PT:"mais perto primeiro"},lang)}</p>
    {sorted.map((p,i)=>
      <div key={i} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl mb-1" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
        <button onClick={p.go} className="flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 p-0">
          <span className="text-base" aria-hidden="true">{p.icon}</span>
          <span className="flex-1 min-w-0 text-sm font-medium truncate">{p.name}</span>
          {geo&&<span className="text-xs opacity-45 shrink-0">{distKm(geo,p)?.toFixed(1)}km</span>}
        </button>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" className="shrink-0 no-underline opacity-45" aria-label={tr({CA:"Com arribar",ES:"Cómo llegar",EN:"Directions",FR:"Itinéraire",DE:"Route",NL:"Route",PT:"Como chegar"},lang)}><Ic d={I.map} size={14}/></a>
      </div>)}

    {/* Share */}
    <div className="mt-5 rounded-xl p-4 text-center" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <p className="text-xs opacity-55 mb-2">{tr({CA:"Comparteix la guia",ES:"Comparte la guía",EN:"Share this guide",FR:"Partager le guide",DE:"Reiseführer teilen",NL:"Gids delen",PT:"Partilhar o guia"},lang)}</p>
      <button onClick={handleShare} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium" style={{background:"rgba(93,202,165,.15)",border:"1px solid rgba(93,202,165,.35)",color:"#5dcaa5"}}>
        📤 {tr({CA:"Comparteix",ES:"Compartir",EN:"Share",FR:"Partager",DE:"Teilen",NL:"Delen",PT:"Partilhar"},lang)}</button>
      <p className="text-xs opacity-35 mt-1.5">delta-ebre.app</p>
    </div>
  </div>);
}
/* ═══════════ PLANNER SCREEN ═══════════ */
function PlannerScreen({lang, nav, ui}) {
  const [step,setStep]=useState(0);const [days,setDays]=useState(2);const [interests,setInts]=useState([]);const [profile,setProfile]=useState(0);const [car,setCar]=useState(true);
  const intOpts=ui.planInterests||["Beaches","Nature","Gastronomy","Activities","Villages","Relax"];
  const profOpts=ui.planProfiles||["Solo","Couple","Family","Friends","Seniors"];
  const dayOpts=ui.planDays||["1 day","2 days","3 days","4 days","5 days+"];

  const [plan, setPlan] = useState(null);

  const generatePlanLocal = () => {
    const interestKeys = ["playas","natura","gastro","activ","pobles","relax"];
    const picked = interests.map(i => interestKeys[i]).filter(Boolean);
    const dayInterests = picked.length > 0 ? picked : ["playas","natura","gastro"];

    // Build item pools with varied times
    const beaches = D_BEACH.map(b=>({name:tr(b.name,lang),note:tr(b.tagline,lang),icon:"🏖️"}));
    const nats = D_NAT.map(n=>({name:tr(n.name,lang),note:tr(n.tagline,lang),icon:"🦩"}));
    const rests = Object.values(D_REST).flat().filter(r=>r.rating>=4).sort(()=>Math.random()-.5).map(r=>({name:r.name,note:tr(D_CUISINE[r.c],lang)+" · "+r.addr,icon:"🍽️"}));
    const acts = D_ACT.map(a=>({name:tr(a.name,lang),note:tr(a.tagline,lang),icon:"🚣"}));
    const puebs = D_PUEB.map(p=>({name:tr(p.name,lang),note:tr(p.tagline,lang),icon:"🏘️"}));
    const relax = [{name:tr({CA:"Matí lliure i descans",ES:"Mañana libre y descanso",EN:"Free morning & rest",FR:"Matinée libre et repos",DE:"Freier Morgen und Erholung",NL:"Vrije ochtend",PT:"Manhã livre e descanso"},lang),note:"🧘",icon:"😌"}];
    
    const pools = {playas:beaches,natura:nats,gastro:rests,activ:acts,pobles:puebs,relax:relax};
    const idx = {}; // track position in each pool
    const pick = key => { if(!idx[key]) idx[key]=0; const p=pools[key]||relax; const item=p[idx[key]%p.length]; idx[key]++; return item; };
    
    // Time slots per day: morning activity, midday restaurant, afternoon activity, optional sunset
    const result = [];
    for (let d = 0; d < days; d++) {
      const day = [];
      // Rotate through interests for variety
      const morningInt = dayInterests[d % dayInterests.length];
      const afternoonInt = dayInterests[(d+1) % dayInterests.length];
      
      // Morning: primary interest
      const m = pick(morningInt);
      day.push({time:"09:30",name:m.name,note:m.note,icon:m.icon});
      
      // Lunch: always a restaurant, different each day
      const r = pick("gastro");
      day.push({time:"13:30",name:r.name,note:r.note,icon:r.icon});
      
      // Afternoon: secondary interest (different from morning)
      const a = pick(afternoonInt === morningInt ? (dayInterests[(d+2)%dayInterests.length]||"natura") : afternoonInt);
      day.push({time:"16:30",name:a.name,note:a.note,icon:a.icon});
      
      // Sunset suggestion on even days
      if (d % 2 === 0) {
        day.push({time:"19:30",name:tr({CA:"Capvespre al Trabucador",ES:"Atardecer en el Trabucador",EN:"Sunset at El Trabucador",FR:"Coucher de soleil au Trabucador",DE:"Sonnenuntergang am Trabucador",NL:"Zonsondergang bij Trabucador",PT:"Pôr do sol no Trabucador"},lang),note:"🌅",icon:"🌅"});
      }
      result.push(day);
    }
    return result;
  };
  const [generating, setGenerating] = useState(false);
  const [planMode, setPlanMode] = useState("ai"); // "ai" | "local" | "fallback"

  // Build a compact, real-data context for the AI so itineraries use actual delta places
  const generatePlanAI = async () => {
    const interestKeys = ["playas","natura","gastro","activ","pobles","relax"];
    const interestNames = ["beaches","nature","gastronomy","activities","villages","relax"];
    const picked = interests.map(i => interestNames[i]).filter(Boolean);
    const langNames = {CA:"Catalan",ES:"Spanish",EN:"English",FR:"French",DE:"German",NL:"Dutch",PT:"Portuguese"};
    const langName = langNames[lang] || "Spanish";
    const profileName = (profOpts[profile]) || "traveller";
    const interestsTxt = picked.length ? picked.join(", ") : "beaches, nature, gastronomy";

    // Real place names (in the user's language)
    const beaches = (typeof D_BEACH !== "undefined" ? D_BEACH : []).map(b=>tr(b.name,lang));
    const nats = (typeof D_NAT !== "undefined" ? D_NAT : []).map(n=>tr(n.name,lang));
    const acts = (typeof D_ACT !== "undefined" ? D_ACT : []).map(a=>tr(a.name,lang));
    const puebs = (typeof D_PUEB !== "undefined" ? D_PUEB : []).map(p=>tr(p.name,lang));
    const rests = Object.values(D_REST).flat().filter(r=>r.rating>=4.3).map(r=>r.name+" ("+r.addr.split("·").pop().trim()+")").slice(0,30);

    const sys = "You are a local travel expert for the Delta de l'Ebre (Ebro Delta), Catalonia. You design realistic, geographically coherent day-by-day itineraries using ONLY the real places provided by the user. Respond with valid JSON ONLY — no markdown fences, no commentary.";
    const prompt =
`Design a ${days}-day itinerary for the Delta de l'Ebre.
Traveller: ${profileName}. Interests: ${interestsTxt}. Travelling by car: ${car ? "yes" : "no, relies on walking/cycling/transit"}.
Write every "name" and "note" value in ${langName}.
Use ONLY these real places (do not invent any):
BEACHES: ${beaches.join("; ")}
NATURE / LAGOONS: ${nats.join("; ")}
ACTIVITIES: ${acts.join("; ")}
VILLAGES: ${puebs.join("; ")}
RESTAURANTS: ${rests.join("; ")}
Rules:
- Each day has 3-4 stops with realistic times: a morning stop (~09:30), lunch at a restaurant (~13:30), an afternoon stop (~16:30), and optionally a sunset spot (~19:30).
- Cluster each day geographically so travel makes sense; weight choices toward the stated interests and profile.
- Keep every "note" under 8 words (a short, useful tip).
- Pick a fitting emoji for "icon": 🏖️ beach, 🦩 nature, 🍽️ restaurant, 🚣 activity, 🏘️ village, 🌅 sunset.
Return JSON exactly as: {"days":[[{"time":"09:30","name":"...","note":"...","icon":"🏖️"}]]} with exactly ${days} inner day arrays.`;

    const resp = await fetch(AI_PLANNER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: sys,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!resp.ok) throw new Error("api "+resp.status);
    const data = await resp.json();
    const text = (data.content || []).map(b => b.type === "text" ? b.text : "").join("").trim();
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);
    const out = Array.isArray(parsed) ? parsed : parsed.days;
    if (!Array.isArray(out) || !out.length) throw new Error("bad shape");
    const norm = out.map(day => (Array.isArray(day) ? day : [])
      .map(s => ({ time: s.time || "", name: s.name || "", note: s.note || "", icon: s.icon || "📍" }))
      .filter(s => s.name));
    if (!norm.some(d => d.length)) throw new Error("empty");
    return norm;
  };

  const handleGenerate = async () => {
    // Sense proxy d'IA configurat: generem el pla localment (instantani, sense
    // dependències externes). No es promet IA enlloc en aquest cas.
    if (!AI_PLANNER_ENDPOINT) {
      setPlan(generatePlanLocal());
      setPlanMode("local");
      return;
    }
    setGenerating(true); setPlanMode("ai");
    try {
      const ai = await generatePlanAI();
      setPlan(ai);
      setPlanMode("ai");
    } catch (e) {
      // Fallback elegant: mai deixem l'usuari sense pla
      trackEvent('planner_ai_fallback', {});
      setPlan(generatePlanLocal());
      setPlanMode("fallback");
    } finally {
      setGenerating(false);
    }
  };

  if (plan) return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.planTitle} onBack={()=>setPlan(null)}/>
    <h2 className="text-lg font-semibold mb-1" style={{fontFamily:"Georgia,serif",color:V.title}}>✨ {ui.planTitle}</h2>
    <p className="text-xs mb-4" style={{color:planMode==="fallback"?"#e8b86d":"#5dcaa5",opacity:.8}}>{
        planMode==="fallback"
      ? tr({CA:"Generat sense connexió (mode bàsic). Torna-ho a provar més tard.",ES:"Generado sin conexión (modo básico). Inténtalo de nuevo más tarde.",EN:"Generated offline (basic mode). Try again later.",FR:"Généré hors ligne (mode simple). Réessayez plus tard.",DE:"Offline erstellt (Basismodus). Versuche es später erneut.",NL:"Offline gegenereerd (basismodus). Probeer later opnieuw.",PT:"Gerado offline (modo básico). Tenta novamente mais tarde."},lang)
      : planMode==="ai"
      ? tr({CA:"🤖 Itinerari personalitzat generat amb IA",ES:"🤖 Itinerario personalizado generado con IA",EN:"🤖 Personalised itinerary generated with AI",FR:"🤖 Itinéraire personnalisé généré par IA",DE:"🤖 Personalisierte Route mit KI erstellt",NL:"🤖 Persoonlijke route met AI gegenereerd",PT:"🤖 Itinerário personalizado gerado com IA"},lang)
      : tr({CA:"Itinerari personalitzat segons les teves preferències",ES:"Itinerario personalizado según tus preferencias",EN:"Personalised itinerary based on your preferences",FR:"Itinéraire personnalisé selon vos préférences",DE:"Personalisierte Route nach deinen Vorlieben",NL:"Persoonlijke route op basis van je voorkeuren",PT:"Itinerário personalizado segundo as tuas preferências"},lang)}</p>
    {plan.map((day,d)=><div key={d} className="mb-5">
      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-55">{tr({CA:`Dia ${d+1}`,ES:`Día ${d+1}`,EN:`Day ${d+1}`,FR:`Jour ${d+1}`,DE:`Tag ${d+1}`,NL:`Dag ${d+1}`,PT:`Dia ${d+1}`},lang)}</h3>
      {day.map((item,i)=><div key={i} className="flex gap-3 px-3 py-2.5 rounded-xl mb-1.5" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
        <div className="shrink-0 text-center" style={{width:36}}><div className="text-lg" aria-hidden="true">{item.icon}</div><div className="text-xs font-mono opacity-45 mt-0.5">{item.time}</div></div>
        <div className="min-w-0"><div className="text-sm font-medium">{item.name}</div><div className="text-xs opacity-55">{item.note}</div></div>
      </div>)}
    </div>)}
    <div className="flex gap-2">
      <button onClick={()=>setPlan(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{background:V.w6,border:`1px solid ${V.w14}`}}>← {tr({CA:"Modificar",ES:"Modificar",EN:"Edit",FR:"Modifier",DE:"Ändern",NL:"Wijzigen",PT:"Modificar"},lang)}</button>
      <button onClick={()=>{
        const text = plan.map((day,d)=>"--- "+tr({CA:"Dia",ES:"Día",EN:"Day",FR:"Jour",DE:"Tag",NL:"Dag",PT:"Dia"},lang)+" "+(d+1)+" ---\n"+day.map(i=>i.time+" "+i.icon+" "+i.name).join("\n")).join("\n\n");
        if(navigator.share) navigator.share({title:"Delta de l'Ebre - Itinerari",text}).catch(()=>{});
        else navigator.clipboard?.writeText(text);
      }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{background:"rgba(93,202,165,.12)",border:"1px solid rgba(93,202,165,.3)",color:"#5dcaa5"}}>📤 {tr({CA:"Comparteix",ES:"Compartir",EN:"Share",FR:"Partager",DE:"Teilen",NL:"Delen",PT:"Partilhar"},lang)}</button>
    </div>
  </div>);

  if(step===0) return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-1" style={{fontFamily:"Georgia,serif",color:V.title}}>{ui.planTitle}</h2>
    <p className="text-xs opacity-55 mb-5">{ui.planStep1}</p>
    <div className="flex flex-col gap-2 mb-5">{dayOpts.map((d,i)=><button key={i} onClick={()=>{setDays(i+1);setStep(1);}} className="w-full py-3 rounded-xl text-sm font-medium transition-all" style={{background:V.w6,border:`1px solid ${V.w14}`}}>{d}</button>)}</div></div>);
  
  if(step===1) return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.planTitle} onBack={()=>setStep(0)}/>
    <p className="text-sm opacity-60 mb-4">{ui.planStep2}</p>
    <div className="flex flex-wrap gap-2 mb-5" role="group">{intOpts.map((int,i)=><button key={i} aria-pressed={interests.includes(i)} onClick={()=>setInts(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i])} className="px-3 py-2 rounded-xl text-xs font-medium" style={{background:interests.includes(i)?"rgba(93,202,165,.16)":V.w5,border:`1.5px solid ${interests.includes(i)?"#5dcaa5":V.w12}`,color:interests.includes(i)?"#5dcaa5":"inherit"}}>{int}</button>)}</div>
    <button onClick={()=>setStep(2)} className="w-full py-2.5 rounded-xl text-sm font-medium" style={{background:"rgba(93,202,165,.16)",border:"1px solid rgba(93,202,165,.4)",color:"#5dcaa5"}}>{tr({CA:"Següent",ES:"Siguiente",EN:"Next",FR:"Suivant",DE:"Weiter",NL:"Volgende",PT:"Seguinte"},lang)} →</button></div>);
  
  if(step===2) return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.planTitle} onBack={()=>setStep(1)}/>
    <p className="text-sm opacity-60 mb-4">{ui.planStep3}</p>
    <div className="flex flex-col gap-2 mb-5">{profOpts.map((p,i)=><button key={i} onClick={()=>{setProfile(i);setStep(3);}} className="w-full py-3 rounded-xl text-sm font-medium" style={{background:V.w6,border:`1px solid ${V.w14}`}}>{p}</button>)}</div></div>);

  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title={ui.planTitle} onBack={()=>setStep(2)}/>
    <p className="text-sm opacity-60 mb-4">{ui.planStep4}</p>
    <div className="flex gap-3 mb-6" role="group">{(ui.planCar||["Yes","No"]).map((c,i)=><button key={i} aria-pressed={car===(i===0)} onClick={()=>{setCar(i===0);}} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{background:car===(i===0)?"rgba(93,202,165,.16)":V.w5,border:`1.5px solid ${car===(i===0)?"#5dcaa5":V.w12}`,color:car===(i===0)?"#5dcaa5":"inherit"}}>{c}</button>)}</div>
    <button onClick={handleGenerate} disabled={generating} aria-busy={generating} className="w-full py-3 rounded-xl text-sm font-bold transition-all" style={{background:"rgba(93,202,165,.2)",border:"1px solid rgba(93,202,165,.5)",color:"#5dcaa5",opacity:generating?.7:1}}>{generating ? "⏳ "+tr({CA:"Creant el teu itinerari amb IA…",ES:"Creando tu itinerario con IA…",EN:"Building your AI itinerary…",FR:"Création de votre itinéraire IA…",DE:"KI-Route wird erstellt…",NL:"AI-route maken…",PT:"A criar o teu itinerário com IA…"},lang) : "✨ "+ui.planGen}</button>
    {generating && <p className="text-xs opacity-55 text-center mt-3">{tr({CA:"Pot trigar uns segons.",ES:"Puede tardar unos segundos.",EN:"This may take a few seconds.",FR:"Cela peut prendre quelques secondes.",DE:"Dies kann einige Sekunden dauern.",NL:"Dit kan enkele seconden duren.",PT:"Pode demorar alguns segundos."},lang)}</p>}
    </div>);
}

/* ═══════════ SEARCH ═══════════ */
function SearchScreen({lang, nav, ui, favs, toggleFav}) {
  const [q,setQ]=useState("");
  const match = useCallback((item, ...fields) => {
    if (!q || q.length < 2) return false;
    const s = q.toLowerCase();
    return fields.some(f => { const v=item[f]; if(!v) return false; return (typeof v==='string'?v:tr(v,lang)).toLowerCase().includes(s); });
  }, [q, lang]);
  const res=useMemo(()=>{if(!q||q.length<2)return {};const s=q.toLowerCase();return{
    r:Object.values(D_REST).flat().filter(r=>r.name.toLowerCase().includes(s)||(r.addr||"").toLowerCase().includes(s)||tr(D_CUISINE[r.c],lang).toLowerCase().includes(s)),
    b:D_BEACH.filter(b=>match(b,"name","tagline")),
    a:D_ALLOT.filter(a=>match(a,"name","town")),
    n:D_NAT.filter(n=>match(n,"name","tagline")),
    p:D_PUEB.filter(p=>match(p,"name","tagline")),
    v:D_ACT.filter(a=>match(a,"name","tagline")),
    fam:D_FAM.filter(f=>match(f,"name","desc")),
    bici:D_BICI.filter(b=>match(b,"name","tagline")),
    pesca:D_PESCA.filter(p=>match(p,"name","tagline")),
    mercats:D_MERCATS.filter(m=>match(m,"name","tagline")),
    rutes:D_RUTES_EXP.filter(r=>match(r,"name","tagline")),
  };},[q,lang,match]);
  const total=Object.values(res).reduce((s,a)=>s+(a?.length||0),0);
  const Section=({icon,label,items,onClick})=>items&&items.length>0&&<div className="mb-4">
    <h3 className="text-xs font-bold opacity-55 uppercase tracking-wider mb-2">{icon} {label} ({items.length})</h3>
    {items.slice(0,6).map((it,i)=><button key={i} onClick={()=>onClick(it,i)} className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg mb-1" style={{background:V.w4}}>
      <div className="min-w-0 flex-1"><div className="text-sm font-medium">{it.name?typeof it.name==='string'?it.name:tr(it.name,lang):''}</div></div></button>)}</div>;
  
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <SearchBar lang={lang} value={q} onChange={setQ} placeholder={tr({CA:"Cercar a tot el delta...",ES:"Buscar en todo el delta...",EN:"Search the delta...",FR:"Rechercher dans le delta...",DE:"Im Delta suchen...",NL:"Zoeken in de delta...",PT:"Pesquisar no delta..."},lang)}/>
    {q.length>=2&&total===0&&<Empty text={tr({CA:"Sense resultats",ES:"Sin resultados",EN:"No results",FR:"Aucun résultat",DE:"Keine Ergebnisse",NL:"Geen resultaten",PT:"Sem resultados"},lang)}/>}
    <Section icon="🍽️" label={ui.sRest} items={res.r} onClick={r=>nav.push("restDetail",{restaurant:r})}/>
    <Section icon="🏖️" label={ui.beachTitle} items={res.b} onClick={(b,i)=>nav.push("beachDetail",{beach:b,idx:i})}/>
    <Section icon="🏠" label={ui.allotTitle||"Allotjament"} items={res.a} onClick={a=>nav.push("allotDetail",{allot:a})}/>
    <Section icon="🦩" label={ui.natTitle} items={res.n} onClick={n=>nav.push("contentDetail",{item:n,parentTitle:ui.natTitle})}/>
    <Section icon="🏘️" label={ui.puebTitle} items={res.p} onClick={p=>nav.push("contentDetail",{item:p,parentTitle:ui.puebTitle})}/>
    <Section icon="🚣" label={ui.actTitle} items={res.v} onClick={a=>nav.push("contentDetail",{item:a,parentTitle:ui.actTitle})}/>
    <Section icon="👨‍👩‍👧" label={ui.fam||"Família"} items={res.fam} onClick={f=>nav.push("contentDetail",{item:f,parentTitle:ui.fam})}/>
    <Section icon="🚲" label={ui.biciTitle} items={res.bici} onClick={b=>nav.push("contentDetail",{item:b,parentTitle:ui.biciTitle})}/>
    <Section icon="🎣" label={ui.pescaTitle} items={res.pesca} onClick={p=>nav.push("contentDetail",{item:p,parentTitle:ui.pescaTitle})}/>
    <Section icon="🛒" label={ui.sMerc||"Mercats"} items={res.mercats} onClick={m=>nav.push("contentDetail",{item:m,parentTitle:ui.sMerc})}/>
    <Section icon="🍷" label={ui.sRutas||"Rutes"} items={res.rutes} onClick={r=>nav.push("contentDetail",{item:r,parentTitle:ui.sRutas})}/>
    {q.length<2&&<div className="text-center opacity-40 py-8"><div className="text-3xl mb-2" aria-hidden="true">🔍</div><p className="text-xs">{tr({CA:"Escriu 2+ lletres",ES:"Escribe 2+ letras",EN:"Type 2+ letters",FR:"Tapez 2+ lettres",DE:"2+ Buchstaben eingeben",NL:"Typ 2+ letters",PT:"Escreva 2+ letras"},lang)}</p></div>}
  </div>);
}

/* ═══════════ FAVORITES ═══════════ */
function FavsScreen({lang, nav, ui, favs, toggleFav}) {
  const items=useMemo(()=>{const r=[];favs.forEach(key=>{const[type,...rest]=key.split("_");const id=rest.join("_");
    if(type==="rest"){const f=Object.values(D_REST).flat().find(r=>r.name===id);if(f)r.push({type:"rest",item:f,key});}
    else if(type==="beach"){const idx=parseInt(id);if(D_BEACH[idx])r.push({type:"beach",item:D_BEACH[idx],idx,key});}
    else if(type==="allot"){const f=D_ALLOT.find(a=>a.id===id);if(f)r.push({type:"allot",item:f,key});}});return r;},[favs]);
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-4" style={{fontFamily:"Georgia,serif",color:V.title}}>❤️ {tr({CA:"Favorits",ES:"Favoritos",EN:"Favourites",FR:"Favoris",DE:"Favoriten",NL:"Favorieten",PT:"Favoritos"},lang)} ({items.length})</h2>
    {items.length===0&&<Empty icon="❤️" text={tr({CA:"Encara no has guardat res",ES:"Aún no has guardado nada",EN:"No saved items yet",FR:"Rien enregistré pour le moment",DE:"Noch nichts gespeichert",NL:"Nog niets opgeslagen",PT:"Ainda não guardou nada"},lang)}/>}
    {items.map(({type,item,idx,key})=>
    <div key={key} className="relative mb-1.5">
      <button onClick={()=>{
      if(type==="rest")nav.push("restDetail",{restaurant:item});
      else if(type==="beach")nav.push("beachDetail",{beach:item,idx});
      else if(type==="allot")nav.push("allotDetail",{allot:item});
    }} className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 pr-14 rounded-xl" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <span className="text-lg">{type==="rest"?"🍽️":type==="beach"?"🏖️":"🏠"}</span>
      <div className="min-w-0 flex-1"><div className="text-sm font-medium">{type==="rest"?item.name:tr(item.name,lang)}</div></div>
      </button>
      <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10"><FavBtn on={true} toggle={()=>toggleFav(key)}/></div>
    </div>)}
  </div>);
}

/* ═══════════ LANG MODAL ═══════════ */
function LangModal({current, onSelect, onClose}) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0" style={{background:V.fg==="#1a2e38"?"rgba(200,195,185,.7)":"rgba(4,10,18,.8)",backdropFilter:"blur(6px)"}}/>
    <div role="dialog" aria-modal="true" aria-label="Idioma / Language" className="relative rounded-2xl p-4 w-72 max-w-[90vw]" onClick={e=>e.stopPropagation()} style={{background:V.fg==="#1a2e38"?"rgba(245,240,232,.97)":"rgba(10,30,42,.95)",border:`1px solid ${V.w12}`,color:V.fg}}>
      <div className="text-xs opacity-55 text-center mb-3">Idioma / Language</div>
      <div className="grid grid-cols-2 gap-1.5">{LANG_META.map(l=><button key={l.code} onClick={()=>{onSelect(l.code);onClose();}} className="py-2.5 rounded-xl text-center text-xs font-medium" style={{background:current===l.code?"rgba(93,202,165,.16)":V.w5,border:`1px solid ${current===l.code?"#5dcaa5":V.w12}`,color:current===l.code?"#5dcaa5":"inherit"}}>{l.name}</button>)}</div>
      <button onClick={onClose} aria-label="Tancar / Close" className="block mx-auto mt-3 text-xs opacity-55">✕</button></div></div>);
}

/* ═══════════ APP ROOT ═══════════ */
/* ═══════════ ABOUT / LEGAL ═══════════ */
function AccessibilityScreen({lang, nav}) {
  const t = (o) => tr(o, lang);
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <div className="flex items-center gap-3 mb-4"><span className="text-2xl" aria-hidden="true">♿</span>
      <h2 className="text-lg font-semibold" style={{fontFamily:"Georgia,serif",color:V.title}}>{t({CA:"Accessibilitat",ES:"Accesibilidad",EN:"Accessibility",FR:"Accessibilité",DE:"Barrierefreiheit",NL:"Toegankelijkheid",PT:"Acessibilidade"})}</h2></div>
    <div className="rounded-xl p-4" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
      <p className="text-xs opacity-60 leading-relaxed">{t({CA:"La declaració d'accessibilitat d'aquesta aplicació serà elaborada i publicada per l'organisme responsable.",ES:"La declaración de accesibilidad de esta aplicación será elaborada y publicada por el organismo responsable.",EN:"The accessibility statement for this application will be prepared and published by the responsible body.",FR:"La déclaration d'accessibilité de cette application sera élaborée et publiée par l'organisme responsable.",DE:"Die Erklärung zur Barrierefreiheit dieser Anwendung wird von der zuständigen Stelle erstellt und veröffentlicht.",NL:"De toegankelijkheidsverklaring van deze applicatie wordt opgesteld en gepubliceerd door de verantwoordelijke instantie.",PT:"A declaração de acessibilidade desta aplicação será elaborada e publicada pelo organismo responsável."})}</p>
    </div>
  </div>);
}

function AboutScreen({lang, nav}) {
  return (<div className="max-w-md mx-auto w-full px-5 py-5">
    <Header title="Delta de l'Ebre" onBack={()=>nav.pop()}/>
    <h2 className="text-lg font-semibold mb-3" style={{fontFamily:"Georgia,serif",color:V.title}}>{tr({CA:"Sobre aquesta guia",ES:"Sobre esta guía",EN:"About this guide",FR:"À propos",DE:"Über diesen Reiseführer",NL:"Over deze gids",PT:"Sobre este guia"},lang)}</h2>
    <div className="rounded-xl p-4 mb-3" style={{background:V.w5,border:`1px solid ${V.w12}`}}>
      <p className="text-xs opacity-60 leading-relaxed mb-3">{tr({CA:"Guia turística no oficial del Delta de l'Ebre. La informació es proporciona tal qual i pot contenir errors o dades desactualitzades. Recomanem sempre verificar horaris, preus i disponibilitat directament amb els establiments.",ES:"Guía turística no oficial del Delta del Ebro. La información se proporciona tal cual y puede contener errores. Recomendamos verificar horarios, precios y disponibilidad directamente con los establecimientos.",EN:"Unofficial tourist guide to the Ebro Delta. Information is provided as-is and may contain errors. We recommend verifying schedules, prices and availability directly with establishments.",FR:"Guide touristique non officiel du Delta de l'Èbre. Les informations sont fournies telles quelles. Nous recommandons de vérifier horaires et prix directement.",DE:"Inoffizieller Reiseführer des Ebrodeltas. Informationen werden ohne Gewähr bereitgestellt. Wir empfehlen, Öffnungszeiten und Preise direkt zu überprüfen.",NL:"Onofficiële reisgids van de Ebrodelta. Informatie zonder garantie. We raden aan om openingstijden en prijzen rechtstreeks te controleren.",PT:"Guia turístico não oficial do Delta do Ebro. A informação é fornecida tal como está. Recomendamos verificar horários e preços diretamente."},lang)}</p>
      <p className="text-xs opacity-55 leading-relaxed mb-3">{tr({CA:"Meteorologia: dades d'Open-Meteo (open-meteo.com). Mapa: coordenades aproximades. Les fotografies no estan incloses en aquesta versió.",ES:"Meteorología: datos de Open-Meteo. Mapa: coordenadas aproximadas. Las fotografías no están incluidas en esta versión.",EN:"Weather: Open-Meteo data. Map: approximate coordinates. Photos are not included in this version.",FR:"Météo : données Open-Meteo. Carte : coordonnées approximatives. Photos non incluses.",DE:"Wetter: Open-Meteo-Daten. Karte: ungefähre Koordinaten. Fotos nicht enthalten.",NL:"Weer: Open-Meteo data. Kaart: benaderende coördinaten. Foto\'s niet inbegrepen.",PT:"Meteorologia: dados Open-Meteo. Mapa: coordenadas aproximadas. Fotos não incluídas."},lang)}</p>
    </div>
    <div className="rounded-xl p-4 mb-3" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <h3 className="text-xs font-bold opacity-55 uppercase tracking-wider mb-2">{tr({CA:"Privacitat",ES:"Privacidad",EN:"Privacy",FR:"Confidentialité",DE:"Datenschutz",NL:"Privacy",PT:"Privacidade"},lang)}</h3>
      <p className="text-xs opacity-50 leading-relaxed">{tr({CA:"Aquesta app no recull dades personals. Les preferències (idioma, favorits, tema) es guarden localment al teu dispositiu i no es transmeten a cap servidor. La consulta meteorològica envia les coordenades del delta (no les teves) a Open-Meteo.",ES:"Esta app no recoge datos personales. Las preferencias se guardan localmente y no se transmiten a ningún servidor. La consulta meteorológica envía las coordenadas del delta (no las tuyas) a Open-Meteo.",EN:"This app does not collect personal data. Preferences are stored locally on your device and not sent to any server. The weather query sends delta coordinates (not yours) to Open-Meteo.",FR:"Cette app ne collecte pas de données personnelles. Les préférences sont stockées localement. La requête météo envoie les coordonnées du delta (pas les vôtres) à Open-Meteo.",DE:"Diese App sammelt keine persönlichen Daten. Einstellungen werden lokal gespeichert. Die Wetterabfrage sendet Deltakoordinaten (nicht Ihre) an Open-Meteo.",NL:"Deze app verzamelt geen persoonsgegevens. Voorkeuren worden lokaal opgeslagen. De weerquery stuurt deltacoördinaten (niet je locatie) naar Open-Meteo.",PT:"Esta app não recolhe dados pessoais. As preferências são guardadas localmente. A consulta meteorológica envia coordenadas do delta (não as suas) a Open-Meteo."},lang)}</p>
    </div>
    <div className="rounded-xl p-4 mb-3" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <h3 className="text-xs font-bold opacity-55 uppercase tracking-wider mb-2">{tr({CA:"Contacte",ES:"Contacto",EN:"Contact",FR:"Contact",DE:"Kontakt",NL:"Contact",PT:"Contacto"},lang)}</h3>
      <p className="text-xs opacity-50 leading-relaxed mb-2">{tr({CA:"Tens una correcció, suggeriment o vols col·laborar?",ES:"¿Tienes una corrección, sugerencia o quieres colaborar?",EN:"Have a correction, suggestion or want to collaborate?",FR:"Vous avez une correction, une suggestion ou souhaitez collaborer ?",DE:"Haben Sie eine Korrektur, einen Vorschlag oder möchten Sie mitarbeiten?",NL:"Heb je een correctie, suggestie of wil je samenwerken?",PT:"Tem alguma correção, sugestão ou deseja colaborar?"},lang)}</p>
      <a href="mailto:info@delta-ebre.app" className="inline-flex items-center gap-1.5 text-xs font-medium no-underline" style={{color:"#5dcaa5"}}>✉️ info@delta-ebre.app</a>
    </div>
    <button onClick={()=>nav.push("accessibility")} className="w-full flex items-center gap-3 rounded-xl p-4 mb-3 text-left" style={{background:V.w4,border:`1px solid ${V.w10}`}}>
      <span className="text-lg" aria-hidden="true">♿</span>
      <span className="flex-1 text-xs font-medium">{tr({CA:"Accessibilitat",ES:"Accesibilidad",EN:"Accessibility",FR:"Accessibilité",DE:"Barrierefreiheit",NL:"Toegankelijkheid",PT:"Acessibilidade"},lang)}</span>
      <Ic d={I.chev} size={16} cls="opacity-40"/>
    </button>
    <p className="text-xs text-center opacity-35 mt-4">v1.0 · {new Date().getFullYear()} · Delta de l\'Ebre</p>
  </div>);
}

// ─── Càrrega de dades des del CMS (Sveltia/GitHub) ───────────────
// Si els JSON existeixen (web publicada), substitueixen les dades
// integrades. Si no (preview, sense connexió), es mantenen les de sota.
 // carpeta on el CMS desa els JSON

// ─── Planificador: proxy d'IA (opcional) ───
// Deixa-ho BUIT per usar el generador local (recomanat si no tens backend).
// Si muntes un proxy (p. ex. un Cloudflare Worker que hi afegeix la teva clau
// d'Anthropic i reenvia la petició), posa aquí la seva URL i el planificador
// generarà itineraris amb IA. Mai posis una clau d'API directament al codi.


// ─── Accessibilitat (RD 1112/2018) ───
// Omple aquestes dades amb les de l'organisme abans de publicar.
  // URL de la declaració d'accessibilitat completa publicada
  // contacte d'accessibilitat
    // enllaç al procediment de reclamació (art. 13)

// ─── Emmagatzematge persistent ───
// Funciona a la web publicada (localStorage) i també dins de Claude (window.storage).

// ─── Fotografies per secció (gestionades des del CMS) ───
// Cada secció té un fitxer data/photos-<secció>.json amb {ref,label,photo}.
// L'administració hi puja les seves imatges; aquí es fusionen sobre les dades
// del codi (només si la foto és una imatge real). Si el fitxer no existeix o
// falla, es conserva la dada original → mai trenca res (fallback segur).
const PHOTO_MANIFESTS = [
  ["photos-platges.json",      D_BEACH],
  ["photos-allotjaments.json", D_ALLOT],
  ["photos-pobles.json",       D_PUEB],
  ["photos-natura.json",       D_NAT],
  ["photos-activitats.json",   D_ACT],
  ["photos-patrimoni.json",    D_HERITAGE],
  ["photos-familia.json",      D_FAM],
  ["photos-pesca.json",        D_PESCA],
  ["photos-bici.json",         D_BICI],
  ["photos-rutes.json",        D_RUTES_EXP],
  ["photos-mercats.json",      D_MERCATS],
];

async function mergeSectionPhotos() {
  for (const [file, arr] of PHOTO_MANIFESTS) {
    try {
      const r = await fetch(CMS_DATA_BASE + "/" + file, { cache: "no-store" });
      if (!r.ok) continue;
      const dd = await r.json();
      const list = Array.isArray(dd) ? dd : (dd.items || []);
      const byRef = {};
      for (const e of list) { if (e && e.ref != null) byRef[String(e.ref)] = e.photo; }
      arr.forEach((item, i) => {
        const key = (item && item.id != null) ? String(item.id) : String(i);
        if (isRealPhoto(byRef[key])) item.photo = byRef[key];
      });
    } catch (e) { /* conserva la dada del codi */ }
  }
}

async function loadCMSData() {
  const get = async (f) => {
    const r = await fetch(CMS_DATA_BASE + "/" + f, { cache: "no-store" });
    if (!r.ok) throw new Error(f + " " + r.status);
    const d = await r.json();
    const items = Array.isArray(d) ? d : d.items;
    if (!items || !items.length) throw new Error(f + " buit");
    return items;
  };
  try { // restaurants: llista plana → reagrupar per població
    const items = await get("restaurants.json");
    const g = {};
    for (const r of items) { (g[r.town] = g[r.town] || []).push(r); }
    setRest(g);
  } catch (e) {}
  // Només restaurants i events es gestionen via CMS; la resta de seccions usen les dades del codi.
  try { setEvents(await get("events.json")); } catch (e) {}
  await mergeSectionPhotos();
}

function AppInner() {
  const [lang, setLang] = useState(null);
  const [dark, setDark] = useState(true);
  const [navStack, setNavStack] = useState([{screen:"lang"}]);
  const [favs, setFavs] = useState(new Set());
  const [showLM, setShowLM] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [consent, setConsent] = useState(null);
  const [recent, setRecent] = useState([]);
  const [dataTick, setDataTick] = useState(0);

  // Accessibilitat: en navegar entre pantalles, mou el focus al contingut principal
  // perquè els lectors de pantalla i la navegació amb teclat no quedin perduts (WCAG 2.4.3).
  useEffect(() => {
    const m = document.getElementById("main");
    if (m && typeof m.focus === "function") m.focus();
  }, [navStack]);

  // Carrega les dades del CMS si estan disponibles (només a la web publicada)
  useEffect(() => {
    let alive = true;
    loadCMSData().then(() => { if (alive) setDataTick(t => t + 1); });
    return () => { alive = false; };
  }, []);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await store.get("delta-lang");
        const savedFavs = await store.get("delta-favs");
        const savedTheme = await store.get("delta-theme");
        const savedConsent = await store.get("delta-consent");
        if (savedConsent?.value) setConsent(savedConsent.value === "full");
        if (savedLang?.value) { setLang(savedLang.value); setNavStack([{screen:"home"}]); }
        if (savedFavs?.value) { try { setFavs(new Set(JSON.parse(savedFavs.value))); } catch(e){} }
        if (savedTheme?.value) { setDark(savedTheme.value === "dark"); }
      } catch(e) {}
      // Check URL hash for deep link
      const hash = window.location.hash.slice(1);
      if(hash && !savedLang?.value) {
        // Hash exists but no saved lang — still need lang selection first
      } else if(hash && savedLang?.value) {
        const parts = hash.split("~");
        const screen = parts[0];
        if(screen === "restDetail" && parts[2]) {
          const name = decodeURIComponent(parts[2]);
          const r = Object.values(D_REST).flat().find(r=>r.name===name);
          if(r) setNavStack([{screen:"home"},{screen:"restDetail",restaurant:r}]);
        } else if(screen === "beachDetail" && parts[2]) {
          const idx = parseInt(parts[2]);
          if(D_BEACH[idx]) setNavStack([{screen:"home"},{screen:"beachDetail",beach:D_BEACH[idx],idx}]);
        } else if(["gastro","beaches","nature","villages","activities","practical","allot","events","birding","fishing","nightlife","mapScreen","planner","accessibility"].includes(screen)) {
          setNavStack([{screen:"home"},{screen}]);
        }
      }
      setLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist language
  const setLangPersist = (code) => {
    setLang(code);
    try { store.set("delta-lang", code); } catch(e) {}
  };

  // Persist theme
  const setDarkPersist = (d) => {
    const val = typeof d === 'function' ? d(dark) : d;
    setDark(val);
    try { store.set("delta-theme", val ? "dark" : "light"); } catch(e) {}
  };

  // Push browser history entry on each screen change
  const scrollPos = useRef({});
  const prevDepth = useRef(1);
  const nav = useMemo(() => ({
    push: (screen, params={}) => {
      scrollPos.current[navStack.length] = window.scrollY;
      setNavStack(s => [...s, {screen, ...params}]);
      try{const hash=screen+(params.restaurant?"~r~"+encodeURIComponent(params.restaurant.name):params.beach?"~b~"+params.idx:"");window.location.hash=hash;history.pushState(null,"","#"+hash)}catch(e){}
      // Track for recently viewed
      const label = params.restaurant?.name || (params.beach?.name ? tr(params.beach.name,lang) : params.allot ? tr(params.allot.name,lang) : params.item ? tr(params.item.name,lang) : null);
      trackEvent('screen_view',{screen}); if(label) setRecent(prev => {const n=[{screen,label,...params},...prev.filter(r=>r.label!==label)];return n.slice(0,5);});
    },
    pop: () => { setNavStack(s => s.length > 1 ? s.slice(0,-1) : s); },
    goHome: () => { scrollPos.current[1]=0; setNavStack([{screen:"home"}]); try{window.location.hash=""}catch(e){} },
    current: navStack[navStack.length - 1],
  }), [navStack]);
  // Handle browser back button
  useEffect(() => {
    const onPop = () => { setNavStack(s => s.length > 1 ? s.slice(0,-1) : s); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Restaura la posició de scroll en tornar enrere; va amunt del tot en avançar.
  useLayoutEffect(() => {
    const depth = navStack.length, prev = prevDepth.current;
    if (depth < prev) window.scrollTo(0, scrollPos.current[depth] || 0);
    else if (depth > prev) window.scrollTo(0, 0);
    prevDepth.current = depth;
  }, [navStack.length]);

  const toggleFav = useCallback(key => {
    setFavs(prev => {
      const n = new Set(prev);
      const added = !n.has(key); trackEvent(added?'add_fav':'remove_fav',{key});
      added ? n.add(key) : n.delete(key);
      try { store.set("delta-favs", JSON.stringify([...n])); } catch(e) {}
      setToast(added ? "❤️" : "💔");
      setTimeout(() => setToast(""), 1200);
      return n;
    });
  }, []);

  const ui = lang ? (D_I18N[lang] || D_I18N.ES || {}) : {};
  const c = nav.current;
  // Dynamic page title for SEO
  useEffect(() => {
    const titles = {home:"Delta de l'Ebre",gastro:ui.gastroTitle,beaches:ui.beachTitle,nature:ui.natTitle,villages:ui.puebTitle,
      activities:ui.actTitle,practical:ui.pracTitle,allot:ui.allotTitle,events:ui.agendaTitle,birding:"Birding",
      fishing:ui.pescaTitle,planner:ui.planTitle,mapScreen:"Mapa",about:"Info",accessibility:"Accessibilitat"};
    const t = titles[c?.screen] || "Delta de l'Ebre";
    document.title = t + " | Delta de l'Ebre";
    if (ui.htmlLang) document.documentElement.lang = ui.htmlLang;
  }, [c?.screen, ui]);
  const handleLang = code => { trackEvent('select_language',{lang:code}); setLangPersist(code); setNavStack([{screen:"home"}]); };
  // Update module-level theme ref so all components can access it
  setV(dark ? {
    bg:"linear-gradient(165deg,#06303a 0%,#0a3f44 50%,#0d4940 100%)",fg:"#eef7f9",title:"#f4fbfd",
    w3:"rgba(255,255,255,.03)",w4:"rgba(255,255,255,.04)",w5:"rgba(255,255,255,.05)",
    w6:"rgba(255,255,255,.06)",w7:"rgba(255,255,255,.07)",w8:"rgba(255,255,255,.08)",
    w10:"rgba(255,255,255,.1)",w12:"rgba(255,255,255,.12)",w13:"rgba(255,255,255,.13)",
    w14:"rgba(255,255,255,.14)",w15:"rgba(255,255,255,.15)",
    hero1:"linear-gradient(135deg,#0f4a52,#2c6a5c)",hero2:"linear-gradient(135deg,#0d5a6a,#1a7a6c)",
    homeBg:"linear-gradient(165deg,#06303a 0%,#0a3f44 50%,#0d4940 100%)",
    tagBg:"rgba(240,153,123,.14)",tagFg:"#f3c8b3",favBtnBg:"rgba(6,24,32,.7)",floatBg:"rgba(20,40,30,.8)",
  } : {
    bg:"linear-gradient(165deg,#f5f2eb 0%,#eae6dd 50%,#f0ede6 100%)",fg:"#1a2e38",title:"#0f2028",
    w3:"rgba(0,0,0,.02)",w4:"rgba(0,0,0,.03)",w5:"rgba(0,0,0,.035)",
    w6:"rgba(0,0,0,.04)",w7:"rgba(0,0,0,.045)",w8:"rgba(0,0,0,.05)",
    w10:"rgba(0,0,0,.06)",w12:"rgba(0,0,0,.08)",w13:"rgba(0,0,0,.09)",
    w14:"rgba(0,0,0,.1)",w15:"rgba(0,0,0,.1)",
    hero1:"linear-gradient(135deg,#d4e8e0,#b8d4c8)",hero2:"linear-gradient(135deg,#c4dcd4,#aacec2)",
    homeBg:"linear-gradient(165deg,#f5f2eb 0%,#eae6dd 50%,#f0ede6 100%)",
    tagBg:"rgba(180,90,50,.1)",tagFg:"#a0522d",favBtnBg:"rgba(255,255,255,.85)",floatBg:"rgba(255,255,255,.9)",
  });
  const bg = {background:V.bg,color:V.fg,minHeight:"100vh",paddingBottom:64};
  const geo = useGeo();

  if (!lang) return <LangSelect onSelect={handleLang}/>;
  const cp = {lang, nav, ui, favs, toggleFav, geo};

  return (
    <div style={bg}>
      <a href="#main" className="skip-link">{tr({CA:"Salta al contingut principal",ES:"Saltar al contenido principal",EN:"Skip to main content",FR:"Aller au contenu principal",DE:"Zum Hauptinhalt springen",NL:"Naar hoofdinhoud",PT:"Saltar para o conteúdo principal"},lang)}</a>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(.97)}100%{transform:scale(1)}}.press:active{transform:scale(.97);transition:transform .1s}.card-hover{transition:transform .15s,box-shadow .15s}.card-hover:active{transform:scale(.98)}a:focus-visible,button:focus-visible,[tabindex]:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #5dcaa5;outline-offset:2px;border-radius:8px}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}"}</style>
      {consent===null && lang && <ConsentBanner lang={lang} onAccept={(full)=>{setConsent(full);try{store.set("delta-consent",full?"full":"essential")}catch(e){}}}/>}
      <Toast msg={toast}/>
      {showLM && <LangModal current={lang} onSelect={setLangPersist} onClose={()=>setShowLM(false)}/>}
      
      <main id="main" tabIndex={-1} key={dataTick+"-"+navStack.length+"-"+c.screen} style={{animation:"fadeIn .2s ease",outline:"none"}}>{c.screen==="home" && <HomeScreen {...cp} onLangClick={()=>setShowLM(true)} onThemeToggle={()=>setDarkPersist(d=>!d)} dark={dark}/>}
      {c.screen==="gastro" && <GastroScreen {...cp}/>}
      {c.screen==="restList" && <RestListScreen {...cp} town={c.town}/>}
      {c.screen==="restDetail" && <RestDetailScreen {...cp} restaurant={c.restaurant}/>}
      {c.screen==="beaches" && <BeachesScreen {...cp}/>}
      {c.screen==="beachDetail" && <BeachDetailScreen {...cp} beach={c.beach} idx={c.idx}/>}
      {c.screen==="allot" && <AllotScreen {...cp}/>}
      {c.screen==="allotDetail" && <AllotDetailScreen {...cp} allot={c.allot}/>}
      {c.screen==="nature" && <ContentScreen data={D_NAT} {...cp} title={ui.natTitle} intro={ui.natIntro} emoji="🦩" gradient="linear-gradient(135deg,rgba(201,160,220,.2),rgba(93,202,165,.15))" extraLinks={[{icon:"🐦",label:"Birding",go:()=>nav.push("birding")},{icon:"🌾",label:tr({CA:"Cicle de l'arròs",ES:"Ciclo del arroz",EN:"Rice cycle",FR:"Cycle du riz",DE:"Reiszyklus",NL:"Rijstcyclus",PT:"Ciclo do arroz"},lang),go:()=>nav.push("riceCycle")}]}/>}
      {c.screen==="villages" && <ContentScreen data={D_PUEB} {...cp} title={ui.puebTitle} intro={ui.puebIntro} emoji="🏘️" gradient="linear-gradient(135deg,rgba(232,184,109,.15),rgba(240,153,123,.1))"/>}
      {c.screen==="activities" && <ContentScreen data={D_ACT} {...cp} title={ui.actTitle} intro={ui.actIntro} emoji="🚣" gradient="linear-gradient(135deg,rgba(93,202,165,.15),rgba(133,183,235,.1))"/>}
      {c.screen==="practical" && <ContentScreen data={D_PRAC} {...cp} title={ui.pracTitle} intro={ui.pracIntro} emoji="ℹ️"/>}
      {c.screen==="bikes" && <ContentScreen data={D_BICI} {...cp} title={ui.biciTitle} intro={ui.biciIntro} emoji="🚲"/>}
      {c.screen==="heritage" && <ContentScreen data={D_HERITAGE} {...cp} title={ui.patri||"Patrimoni"} emoji="🏛️"/>}
      {c.screen==="family" && <ContentScreen data={D_FAM} {...cp} title={ui.fam||"Família"} emoji="👨‍👩‍👧"/>}
      {c.screen==="products" && <ProductsScreen {...cp}/>}
      {c.screen==="events" && <EventsScreen {...cp}/>}
      {c.screen==="search" && <SearchScreen {...cp}/>}
      {c.screen==="favs" && <FavsScreen {...cp}/>}
      {c.screen==="emergencies" && <EmergencyScreen lang={lang} nav={nav}/>}
      {c.screen==="nightlife" && <NightlifeScreen lang={lang} nav={nav} ui={ui}/>}
      {c.screen==="mapScreen" && <MapScreen {...cp}/>}
      {c.screen==="planner" && <PlannerScreen lang={lang} nav={nav} ui={ui}/>}
      {c.screen==="birding" && <BirdingScreen {...cp}/>}
      {c.screen==="fishing" && <FishingScreen {...cp}/>}
      {c.screen==="riceCycle" && <RiceCycleScreen lang={lang}/>}
      {c.screen==="markets" && <MarketsScreen {...cp}/>}
      {c.screen==="rutesExp" && <RutesExpScreen {...cp}/>}
      {c.screen==="about" && <AboutScreen lang={lang} nav={nav}/>}
      {c.screen==="accessibility" && <AccessibilityScreen lang={lang} nav={nav}/>}
      {c.screen==="transport" && <ContentScreen data={D_TRANSPORT_ITEMS} {...cp} title={tr({CA:"Com arribar i moure's",ES:"Cómo llegar y moverse",EN:"Getting there & around",FR:"Comment s'y rendre et se déplacer",DE:"Anreise & Fortbewegung",NL:"Bereikbaarheid & vervoer",PT:"Como chegar e deslocar-se"},lang)} emoji="🚗"/>}
      {c.screen==="contentDetail" && <ContentDetailScreen {...cp} item={c.item} parentTitle={c.parentTitle}/>}</main>

      {c.screen!=="home" && c.screen!=="lang" && (
        <nav aria-label={tr({CA:"Navegació principal",ES:"Navegación principal",EN:"Main navigation",FR:"Navigation principale",DE:"Hauptnavigation",NL:"Hoofdnavigatie",PT:"Navegação principal"},lang)} className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-4" style={{background:V.floatBg,backdropFilter:"blur(12px)",borderTop:`1px solid ${V.w10}`,paddingBottom:"max(8px,env(safe-area-inset-bottom))"}}>
          <button onClick={()=>nav.goHome()} aria-current={c.screen==="home"?"page":undefined} aria-label="Home" className="flex flex-col items-center gap-0.5 px-3 py-1 press" style={{color:c.screen==="home"?"#5dcaa5":"inherit",opacity:c.screen==="home"?1:.4}}>
            <Ic d={I.home} size={20}/><span className="text-xs">Home</span></button>
          <button onClick={()=>nav.push("search")} aria-current={c.screen==="search"?"page":undefined} aria-label={tr({CA:"Cerca",ES:"Buscar",EN:"Search",FR:"Rechercher",DE:"Suchen",NL:"Zoeken",PT:"Pesquisar"},lang)} className="flex flex-col items-center gap-0.5 px-3 py-1 press" style={{color:c.screen==="search"?"#5dcaa5":"inherit",opacity:c.screen==="search"?1:.4}}>
            <Ic d={I.search} size={20}/><span className="text-xs">{tr({CA:"Cerca",ES:"Buscar",EN:"Search",FR:"Rechercher",DE:"Suchen",NL:"Zoeken",PT:"Pesquisar"},lang)}</span></button>
          <button onClick={()=>nav.push("mapScreen")} aria-current={c.screen==="mapScreen"?"page":undefined} aria-label={tr({CA:"Mapa",ES:"Mapa",EN:"Map",FR:"Carte",DE:"Karte",NL:"Kaart",PT:"Mapa"},lang)} className="flex flex-col items-center gap-0.5 px-3 py-1 press" style={{color:c.screen==="mapScreen"?"#5dcaa5":"inherit",opacity:c.screen==="mapScreen"?1:.4}}>
            <Ic d={I.map} size={20}/><span className="text-xs">{tr({CA:"Mapa",ES:"Mapa",EN:"Map",FR:"Carte",DE:"Karte",NL:"Kaart",PT:"Mapa"},lang)}</span></button>
          <button onClick={()=>nav.push("favs")} aria-current={c.screen==="favs"?"page":undefined} aria-label={tr({CA:"Favorits",ES:"Favoritos",EN:"Saved",FR:"Favoris",DE:"Favoriten",NL:"Favorieten",PT:"Favoritos"},lang)} className="flex flex-col items-center gap-0.5 px-3 py-1 press" style={{color:c.screen==="favs"?"#5dcaa5":"inherit",opacity:c.screen==="favs"?1:.4}}>
            <Ic d={I.heart} size={20}/><span className="text-xs">{tr({CA:"Favorits",ES:"Favoritos",EN:"Saved",FR:"Favoris",DE:"Favoriten",NL:"Favorieten",PT:"Favoritos"},lang)}</span></button>
        </nav>
      )}
    </div>
  );
}

export default function App() { return <ErrorBoundary><AppInner/></ErrorBoundary>; }