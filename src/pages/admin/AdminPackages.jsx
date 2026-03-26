import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { packagesAPI } from '../../utils/api';

const CATS = ['weddings','portraits','events','commercial','family'];
const EMPTY = { name:'', category:'weddings', description:'', base_price:'', duration_hours:'', includes:'', extras:[], is_active:true, sort_order:0 };

export default function AdminPackages() {
  const [pkgs, setPkgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [extraInput, setExtraInput] = useState({ name:'', price:'' });

  useEffect(() => { packagesAPI.getAll().then(r => setPkgs(r.data)).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => { setForm({ ...p, includes: (p.includes||[]).join(', '), extras: p.extras||[] }); setEditId(p.id); setModal(true); };
  const addExtra = () => { if (!extraInput.name || !extraInput.price) return; setForm(f => ({ ...f, extras: [...f.extras, { name: extraInput.name, price: parseFloat(extraInput.price) }] })); setExtraInput({ name:'', price:'' }); };
  const rmExtra = (i) => setForm(f => ({ ...f, extras: f.extras.filter((_,j) => j !== i) }));

  const save = async () => {
    if (!form.name || !form.base_price || !form.duration_hours) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      const payload = { ...form, base_price: parseFloat(form.base_price), duration_hours: parseInt(form.duration_hours), includes: form.includes ? form.includes.split(',').map(s=>s.trim()).filter(Boolean) : [] };
      if (editId) { const r = await packagesAPI.update(editId, payload); setPkgs(p => p.map(x => x.id===editId ? r.data : x)); toast.success('Updated'); }
      else { const r = await packagesAPI.create(payload); setPkgs(p => [r.data, ...p]); toast.success('Created'); }
      setModal(false);
    } catch (e) { toast.error(e.response?.data?.detail||'Failed'); }
    finally { setSaving(false); }
  };

  const deactivate = async (id) => { if (!confirm('Deactivate this package?')) return; try { await packagesAPI.delete(id); setPkgs(p => p.filter(x => x.id!==id)); toast.success('Deactivated'); } catch { toast.error('Failed'); } };

  const IS = { background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)', color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.85rem', padding:'9px 0', width:'100%', outline:'none', marginBottom:'16px' };

  return (
    <div style={{ padding:'36px 32px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px' }}>
        <div><span className="section-label" style={{ display:'block', marginBottom:'8px' }}>Management</span>
          <h1 style={{ fontFamily:'Cormorant,serif', fontSize:'2.5rem', fontWeight:300, color:'var(--fg)', margin:0 }}>Packages & Pricing</h1></div>
        <button onClick={openCreate} className="btn-primary" style={{ padding:'10px 20px' }}>
          <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}><Plus size={12}/> New Package</span>
        </button>
      </div>

      {loading ? <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'4px' }}>{[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height:'160px' }}/>)}</div> :
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'4px' }}>
          {pkgs.map(p => (
            <motion.div key={p.id} layout initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ background:'var(--bg-2)', border:'1px solid var(--border)', padding:'22px', transition:'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold-border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                <div>
                  <span className="section-label" style={{ fontSize:'0.52rem', display:'block', marginBottom:'4px', textTransform:'capitalize' }}>{p.category}</span>
                  <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.25rem', color:'var(--fg)', fontWeight:400 }}>{p.name}</div>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={() => openEdit(p)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--fg-3)', transition:'color 0.25s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--gold)'} onMouseLeave={e=>e.currentTarget.style.color='var(--fg-3)'}><Edit2 size={13}/></button>
                  <button onClick={() => deactivate(p.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--fg-3)', transition:'color 0.25s' }} onMouseEnter={e=>e.currentTarget.style.color='#c05050'} onMouseLeave={e=>e.currentTarget.style.color='var(--fg-3)'}><Trash2 size={13}/></button>
                </div>
              </div>
              <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.72rem', color:'var(--fg-3)', lineHeight:1.65, marginBottom:'14px', fontWeight:300 }}>{p.description}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', borderTop:'1px solid var(--border)', paddingTop:'12px' }}>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.62rem', color:'var(--fg-4)' }}>{p.duration_hours}h · {(p.extras||[]).length} extras</div>
                <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.5rem', color:'var(--gold)', fontWeight:300 }}>£{Number(p.base_price).toLocaleString('en-GB')}</div>
              </div>
            </motion.div>
          ))}
        </div>}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(12,11,9,0.88)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
              style={{ background:'var(--bg-2)', border:'1px solid var(--border)', padding:'32px', width:'100%', maxWidth:'580px', position:'relative', maxHeight:'90vh', overflowY:'auto' }}>
              <button onClick={() => setModal(false)} style={{ position:'absolute', top:'14px', right:'14px', background:'none', border:'none', cursor:'pointer', color:'var(--fg-3)' }}><X size={16}/></button>
              <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.6rem', fontWeight:300, color:'var(--fg)', marginBottom:'22px' }}>{editId ? 'Edit Package' : 'New Package'}</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px' }}>
                {[{k:'name',l:'Package Name',span:2},{k:'description',l:'Description',span:2},{k:'base_price',l:'Base Price (£)',t:'number'},{k:'duration_hours',l:'Duration (hours)',t:'number'}].map(({k,l,t,span})=>(
                  <div key={k} style={{ gridColumn: span===2?'span 2':'auto' }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'6px' }}>{l}</div>
                    {k==='description'
                      ? <textarea value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} rows={2} style={{ ...IS, resize:'none', height:'60px' }} onFocus={e=>e.target.style.borderBottomColor='var(--gold)'} onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'}/>
                      : <input type={t||'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={IS} onFocus={e=>e.target.style.borderBottomColor='var(--gold)'} onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'}/>
                    }
                  </div>
                ))}
              </div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'6px' }}>Category</div>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ ...IS, background:'var(--bg-3)' }}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'6px' }}>Includes (comma-separated)</div>
              <input value={form.includes} onChange={e=>setForm({...form,includes:e.target.value})} placeholder="8 hours, 300 images, online gallery" style={IS} onFocus={e=>e.target.style.borderBottomColor='var(--gold)'} onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'}/>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'10px' }}>Extras</div>
              {form.extras.map((e,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg-3)', marginBottom:'4px', alignItems:'center' }}>
                  <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg)' }}>{e.name}</span>
                  <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                    <span style={{ color:'var(--gold)', fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem' }}>£{Number(e.price).toLocaleString('en-GB')}</span>
                    <button onClick={() => rmExtra(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--fg-3)' }}><X size={12}/></button>
                  </div>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'8px', marginBottom:'20px' }}>
                <input value={extraInput.name} onChange={e=>setExtraInput({...extraInput,name:e.target.value})} placeholder="Extra name" style={{ ...IS, marginBottom:0 }} onFocus={e=>e.target.style.borderBottomColor='var(--gold)'} onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'}/>
                <input type="number" value={extraInput.price} onChange={e=>setExtraInput({...extraInput,price:e.target.value})} placeholder="Price" style={{ ...IS, marginBottom:0 }} onFocus={e=>e.target.style.borderBottomColor='var(--gold)'} onBlur={e=>e.target.style.borderBottomColor='var(--border-2)'}/>
                <button onClick={addExtra} className="btn-ghost" style={{ padding:'8px 12px', alignSelf:'flex-end', marginBottom:'0', whiteSpace:'nowrap' }}>
                  <span style={{ fontSize:'0.6rem', letterSpacing:'0.15em', display:'inline-flex', alignItems:'center', gap:'4px' }}><Plus size={10}/>Add</span>
                </button>
              </div>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ width:'100%', padding:'13px', justifyContent:'center', opacity:saving?0.7:1 }}>
                <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                  {saving ? <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> : <Check size={12}/>}
                  {saving ? 'Saving...' : editId ? 'Update Package' : 'Create Package'}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
