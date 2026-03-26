import{useState,useEffect}from'react';import{useParams,Link}from'react-router-dom';import{motion}from'framer-motion';import{ArrowLeft,MessageSquare,FileText,Loader2,Check}from'lucide-react';import toast from'react-hot-toast';import{bookingsAPI}from'../../utils/api';
const fmt=(n)=>`£${Number(n||0).toLocaleString('en-GB')}`;
const ACTIONS=[
  {status:'confirmed',label:'Confirm Booking',style:{color:'#2da876',borderColor:'rgba(45,168,118,0.3)',bg:'rgba(45,168,118,0.08)'}},
  {status:'rejected', label:'Reject',          style:{color:'#c05050',borderColor:'rgba(192,80,80,0.3)',bg:'rgba(192,80,80,0.08)'}},
  {status:'completed',label:'Mark Completed',  style:{color:'#8a6ac8',borderColor:'rgba(138,106,200,0.3)',bg:'rgba(138,106,200,0.08)'}},
  {status:'cancelled',label:'Cancel',          style:{color:'var(--fg-3)',borderColor:'var(--border-2)',bg:'transparent'}},
];
export default function AdminBookingDetail(){
const{bookingId}=useParams();
const[booking,setBooking]=useState(null);const[loading,setLoading]=useState(true);const[note,setNote]=useState('');const[updating,setUpdating]=useState(false);
useEffect(()=>{bookingsAPI.getById(bookingId).then(r=>setBooking(r.data)).catch(()=>toast.error('Booking not found')).finally(()=>setLoading(false));},[bookingId]);
const update=async(status)=>{setUpdating(true);try{const r=await bookingsAPI.updateStatus(bookingId,{status,admin_note:note||null});setBooking(r.data);toast.success(`Booking ${status}`);}catch(e){toast.error(e.response?.data?.detail||'Update failed');}finally{setUpdating(false);};};
const badge=(st)=>{const m={pending:'badge-pending',confirmed:'badge-confirmed',rejected:'badge-rejected',completed:'badge-completed',cancelled:'badge-cancelled'};return<span className={m[st]||''} style={{fontSize:'0.62rem',padding:'3px 10px',borderRadius:'2px',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'Montserrat,sans-serif'}}>{st}</span>;};
if(loading)return<div style={{padding:'36px',display:'flex',justifyContent:'center'}}><Loader2 size={22} style={{color:'var(--gold)',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style></div>;
if(!booking)return<div style={{padding:'36px',textAlign:'center',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'var(--fg-4)'}}>Booking not found.</div>;
const price=booking.price||{};
return(<div style={{padding:'36px 32px'}}>
<Link to="/admin/bookings" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',letterSpacing:'0.12em',color:'var(--fg-4)',textDecoration:'none',marginBottom:'28px',transition:'color 0.25s'}} onMouseEnter={e=>e.currentTarget.style.color='var(--fg)'} onMouseLeave={e=>e.currentTarget.style.color='var(--fg-4)'}>
<ArrowLeft size={12}/> All Bookings
</Link>
<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'28px',flexWrap:'wrap',gap:'12px'}}>
<div>
<span className="section-label" style={{display:'block',marginBottom:'6px'}}>Booking #{bookingId.slice(-8).toUpperCase()}</span>
<h1 style={{fontFamily:'Cormorant,serif',fontSize:'2.2rem',fontWeight:300,color:'var(--fg)',margin:0}}>{booking.client_name}</h1>
</div>
<div style={{display:'flex',gap:'10px',alignItems:'center'}}>
{badge(booking.status)}
{booking.invoice_url&&<a href={booking.invoice_url} target="_blank" rel="noopener" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',border:'1px solid var(--gold-border)',padding:'6px 12px',textDecoration:'none'}}><FileText size={11}/>Invoice</a>}
</div>
</div>

<div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'20px'}}>
<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
<div style={{background:'var(--bg-2)',border:'1px solid var(--border)',padding:'24px'}}>
<span className="section-label" style={{display:'block',marginBottom:'14px',fontSize:'0.58rem'}}>Session Details</span>
{[['Package',booking.package_name],['Category',booking.category],['Date',new Date(booking.booking_date).toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})],['Location',booking.location],['Email',booking.client_email],['Phone',booking.client_phone]].map(([k,v])=>v&&(
<div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
<span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--fg-4)'}}>{k}</span>
<span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'var(--fg)',textAlign:'right',maxWidth:'55%',textTransform:'capitalize'}}>{v}</span>
</div>
))}
</div>
{booking.notes&&<div style={{background:'var(--bg-2)',border:'1px solid var(--border)',padding:'20px'}}><span className="section-label" style={{display:'block',marginBottom:'10px',fontSize:'0.58rem'}}>Client Notes</span><p style={{fontFamily:'EB Garamond,serif',fontSize:'1rem',color:'var(--fg-2)',lineHeight:1.75,margin:0}}>{booking.notes}</p></div>}
<div style={{background:'var(--bg-2)',border:'1px solid var(--border)',padding:'24px'}}>
<span className="section-label" style={{display:'block',marginBottom:'14px',fontSize:'0.58rem'}}>Pricing</span>
<div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem'}}><span style={{color:'var(--fg-3)'}}>Base price</span><span style={{color:'var(--fg)'}}>{fmt(price.base_price)}</span></div>
{(price.extras||[]).map((e,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem'}}><span style={{color:'var(--fg-3)'}}>{e.name}</span><span style={{color:'var(--fg)'}}>+{fmt(e.price)}</span></div>)}
<div style={{height:'1px',background:'var(--gold)',opacity:0.3,margin:'12px 0'}}/>
<div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--fg-2)'}}>Total</span><span style={{fontFamily:'Cormorant,serif',fontSize:'1.6rem',color:'var(--gold)',fontWeight:300}}>{fmt(price.total_price)}</span></div>
</div>
</div>

<div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
<div style={{background:'var(--bg-2)',border:'1px solid var(--border)',padding:'22px'}}>
<span className="section-label" style={{display:'block',marginBottom:'14px',fontSize:'0.58rem'}}>Update Status</span>
<div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--fg-4)',marginBottom:'8px'}}>Admin Note (optional)</div>
<textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Message to client..."
style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--fg)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',padding:'10px 12px',width:'100%',outline:'none',resize:'none',marginBottom:'14px',fontWeight:300}}
onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
<div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
{ACTIONS.filter(a=>a.status!==booking.status).map(a=>(
<button key={a.status} onClick={()=>update(a.status)} disabled={updating}
style={{padding:'10px 14px',border:`1px solid ${a.style.borderColor}`,background:a.style.bg,color:a.style.color,fontFamily:'Montserrat,sans-serif',fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',transition:'opacity 0.25s',opacity:updating?0.6:1}}>
{updating&&<Loader2 size={11} style={{animation:'spin 1s linear infinite'}}/>}{a.label}
</button>))}
</div>
</div>
<Link to={`/admin/chat/${bookingId}`} style={{display:'flex',alignItems:'center',gap:'12px',background:'var(--bg-2)',border:'1px solid var(--border)',padding:'18px',textDecoration:'none',transition:'border-color 0.25s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold-border)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
<MessageSquare size={16} style={{color:'var(--gold)',flexShrink:0}}/>
<div><div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'var(--fg)'}}>Open Chat</div><div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.62rem',color:'var(--fg-4)',marginTop:'2px'}}>Message this client</div></div>
</Link>
</div>
</div>
</motion.div>
<style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
</div>);}
