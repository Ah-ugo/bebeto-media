import{useState,useEffect}from'react';import{Link}from'react-router-dom';import{motion}from'framer-motion';import{Search}from'lucide-react';import{bookingsAPI}from'../../utils/api';
const STATUSES=['all','pending','confirmed','completed','rejected','cancelled'];
const fmt=(n)=>`£${Number(n||0).toLocaleString('en-GB')}`;
export default function AdminBookings(){
const[bookings,setBookings]=useState([]);const[loading,setLoading]=useState(true);const[status,setStatus]=useState('all');const[search,setSearch]=useState('');
const load=(s)=>{setLoading(true);bookingsAPI.getAll(s!=='all'?{status:s}:{}).then(r=>setBookings(r.data.items||[])).finally(()=>setLoading(false));};
useEffect(()=>{load(status);},[status]);
const filtered=bookings.filter(b=>!search||[b.client_name,b.client_email,b.package_name].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
const badge=(st)=>{const m={pending:'badge-pending',confirmed:'badge-confirmed',rejected:'badge-rejected',completed:'badge-completed',cancelled:'badge-cancelled'};return<span className={m[st]||''} style={{fontSize:'0.58rem',padding:'2px 8px',borderRadius:'2px',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'Montserrat,sans-serif'}}>{st}</span>;};
return(<div style={{padding:'36px 32px'}}>
<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{marginBottom:'28px'}}>
<span className="section-label" style={{display:'block',marginBottom:'8px'}}>Management</span>
<h1 style={{fontFamily:'Cormorant,serif',fontSize:'2.5rem',fontWeight:300,color:'var(--fg)',margin:0}}>Bookings</h1>
</motion.div>
<div style={{display:'flex',gap:'12px',marginBottom:'20px',flexWrap:'wrap',alignItems:'center'}}>
<div style={{position:'relative',flex:1,minWidth:'200px'}}>
<Search size={13} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'var(--fg-4)'}}/>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients, packages..." style={{width:'100%',paddingLeft:'32px',paddingRight:'12px',paddingTop:'9px',paddingBottom:'9px',background:'var(--bg-2)',border:'1px solid var(--border)',color:'var(--fg)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',outline:'none'}} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
</div>
<div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
{STATUSES.map(s=><button key={s} onClick={()=>setStatus(s)} style={{padding:'7px 14px',border:`1px solid ${status===s?'var(--gold)':'var(--border)'}`,background:status===s?'var(--gold-dim)':'transparent',color:status===s?'var(--gold)':'var(--fg-3)',fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.2s'}}>{s}</button>)}
</div>
</div>
<div style={{background:'var(--bg-2)',border:'1px solid var(--border)'}}>
{loading?<div style={{padding:'24px'}}>{[...Array(4)].map((_,i)=><div key={i} className="skeleton" style={{height:'52px',marginBottom:'2px'}}/>)}</div>:
filtered.length===0?<div style={{padding:'48px',textAlign:'center',fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'var(--fg-4)'}}>No bookings found.</div>:
<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
<thead><tr style={{borderBottom:'1px solid var(--border)'}}>
{['Client','Package','Date','Location','Total','Status',''].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontFamily:'Montserrat,sans-serif',fontSize:'0.55rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--fg-4)',fontWeight:500}}>{h}</th>)}
</tr></thead>
<tbody>{filtered.map(b=>(
<tr key={b.id} style={{borderBottom:'1px solid var(--border)'}} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-3)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
<td style={{padding:'12px 14px'}}><div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'var(--fg)'}}>{b.client_name}</div><div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.63rem',color:'var(--fg-4)'}}>{b.client_email}</div></td>
<td style={{padding:'12px 14px',fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'var(--fg-2)'}}>{b.package_name}</td>
<td style={{padding:'12px 14px',fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'var(--fg-2)',whiteSpace:'nowrap'}}>{new Date(b.booking_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</td>
<td style={{padding:'12px 14px',fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',color:'var(--fg-3)',maxWidth:'140px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.location}</td>
<td style={{padding:'12px 14px',fontFamily:'Cormorant,serif',fontSize:'1.1rem',color:'var(--gold)',fontWeight:300,whiteSpace:'nowrap'}}>{fmt(b.price?.total_price)}</td>
<td style={{padding:'12px 14px'}}>{badge(b.status)}</td>
<td style={{padding:'12px 14px'}}><Link to={`/admin/bookings/${b.id}`} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',textDecoration:'none',whiteSpace:'nowrap'}}>Manage →</Link></td>
</tr>))}</tbody></table></div>}
</div>
</div>);}
