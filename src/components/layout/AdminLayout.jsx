import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Image, Package, CalendarOff, MessageSquare, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const NAV = [
  { to:'/admin',              label:'Dashboard',   icon:LayoutDashboard, end:true },
  { to:'/admin/bookings',     label:'Bookings',    icon:Calendar },
  { to:'/admin/portfolio',    label:'Portfolio',   icon:Image },
  { to:'/admin/packages',     label:'Packages',    icon:Package },
  { to:'/admin/availability', label:'Availability',icon:CalendarOff },
];

export default function AdminLayout() {
  const { adminEmail, adminName, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/admin/login'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Sidebar */}
      <motion.aside initial={{ x:-240 }} animate={{ x:0 }} transition={{ duration:0.4, ease:[0.4,0,0.2,1] }}
        style={{ width:'224px', background:'var(--bg-2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', position:'fixed', height:'100vh', zIndex:40 }}>
        <div style={{ padding:'22px 20px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.05rem', letterSpacing:'0.2em', color:'var(--fg)' }}>BEBETO</div>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.52rem', letterSpacing:'0.4em', color:'var(--gold)', textTransform:'uppercase', marginTop:'1px' }}>Admin Panel</div>
        </div>
        <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:'2px' }}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => isActive ? 'admin-sidebar-link active' : 'admin-sidebar-link'}>
              <Icon size={14} /> {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding:'12px 10px', borderTop:'1px solid var(--border)' }}>
          <div style={{ padding:'8px 12px', marginBottom:'4px' }}>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.55rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--fg-4)' }}>Signed in as</div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.72rem', color:'var(--fg-3)', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{adminEmail}</div>
          </div>
          <a href="/" target="_blank" rel="noopener" className="admin-sidebar-link" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none', marginBottom:'2px' }}>
            <ExternalLink size={13} /> View Site
          </a>
          <button onClick={handleLogout} className="admin-sidebar-link"
            style={{ width:'100%', border:'none', cursor:'pointer', textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.color='#c05050'}
            onMouseLeave={e => e.currentTarget.style.color=''}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </motion.aside>
      {/* Content */}
      <main style={{ flex:1, marginLeft:'224px', minHeight:'100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
