/* AdminLoginPage.jsx */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { useAuthStore } from '../../store';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (d) => {
    setLoading(true);
    try {
      const r = await authAPI.login(d);
      setAuth(r.data.access_token, r.data.refresh_token, r.data.admin_email, r.data.admin_name);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
        style={{ width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', letterSpacing:'0.2em', color:'var(--fg)', marginBottom:'4px' }}>BEBETO MEDIA</div>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.4em', color:'var(--gold)', textTransform:'uppercase' }}>Admin Portal</div>
        </div>
        <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', padding:'36px 32px' }}>
          <div style={{ width:'44px', height:'44px', border:'1px solid var(--gold-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <Lock size={16} style={{ color:'var(--gold)' }} />
          </div>
          <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.6rem', fontWeight:300, color:'var(--fg)', textAlign:'center', marginBottom:'28px' }}>Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {[{k:'email',l:'Email',t:'email',p:'admin@bebetomedia.com'},{k:'password',l:'Password',t:'password',p:'••••••••'}].map(({k,l,t,p})=>(
              <div key={k} style={{ marginBottom:'20px' }}>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'8px' }}>{l}</div>
                <input {...register(k,{required:`${l} required`})} type={t} placeholder={p}
                  style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)', color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.9rem', padding:'10px 0', width:'100%', outline:'none', fontWeight:300 }}
                  onFocus={e=>e.target.style.borderBottomColor='var(--gold)'}
                  onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'} />
                {errors[k] && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.62rem', color:'#c05050', marginTop:'4px' }}>{errors[k].message}</div>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', padding:'14px', marginTop:'8px', justifyContent:'center', opacity:loading?0.7:1 }}>
              <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                {loading ? <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }} /> : <Lock size={12} />}
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>
        </div>
        <div style={{ textAlign:'center', marginTop:'20px' }}>
          <a href="/" style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.62rem', color:'var(--fg-4)', textDecoration:'none', letterSpacing:'0.1em' }}>← Back to site</a>
        </div>
      </motion.div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
