import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isToday, startOfDay } from 'date-fns';
import { Loader2, Lock, Unlock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { availabilityAPI } from '../../utils/api';

const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function AdminAvailability() {
  const [current, setCurrent] = useState(new Date());
  const [avail, setAvail] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [acting, setActing] = useState(null);

  useEffect(() => { load(current); }, [current]);

  const load = async (d) => {
    setLoading(true);
    try {
      const r = await availabilityAPI.month(d.getFullYear(), d.getMonth() + 1);
      const map = {};
      r.data.days.forEach((day) => { map[day.date] = { available: day.is_available, reason: day.reason }; });
      setAvail(map);
    } catch { toast.error('Failed to load availability'); }
    finally { setLoading(false); }
  };

  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) });
  const offset = days[0].getDay();

  const handleDay = (d) => {
    if (isBefore(d, startOfDay(new Date()))) return;
    setSelected(d);
    setReason('');
  };

  const block = async () => {
    if (!selected) return;
    const ds = format(selected, 'yyyy-MM-dd');
    setActing(ds);
    try {
      await availabilityAPI.block({ date: ds, reason: reason || null });
      setAvail(a => ({ ...a, [ds]: { available: false, reason: reason || 'blocked' } }));
      toast.success(`${ds} blocked`);
      setSelected(null);
    } catch (e) { toast.error(e.response?.data?.detail || 'Failed'); }
    finally { setActing(null); }
  };

  const unblock = async (ds) => {
    setActing(ds);
    try {
      await availabilityAPI.unblock(ds);
      setAvail(a => ({ ...a, [ds]: { available: true, reason: null } }));
      toast.success(`${ds} unblocked`);
      setSelected(null);
    } catch (e) { toast.error(e.response?.data?.detail || 'Failed'); }
    finally { setActing(null); }
  };

  const selDs = selected ? format(selected, 'yyyy-MM-dd') : null;
  const selData = selDs ? avail[selDs] : null;

  const navBtn = (style) => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px',
    fontFamily: 'Montserrat,sans-serif', fontSize: '0.75rem', color: 'var(--fg-3)',
    transition: 'color 0.25s', ...style
  });

  return (
    <div style={{ padding: '36px 32px' }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Management</span>
        <h1 style={{ fontFamily: 'Cormorant,serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--fg)', margin: 0 }}>Availability</h1>
        <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: 'var(--fg-4)', marginTop: '6px', fontWeight: 300 }}>
          Click a date to block or unblock it. Blocked dates cannot be booked by clients.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        {/* Calendar */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '24px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button style={navBtn()} onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))}>←</button>
            <div style={{ fontFamily: 'Cormorant,serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--fg)' }}>
              {format(current, 'MMMM yyyy')}
            </div>
            <button style={navBtn()} onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))}>→</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '4px' }}>
            {WEEKDAYS.map(w => (
              <div key={w} style={{ textAlign: 'center', fontFamily: 'Montserrat,sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-4)', padding: '6px 0' }}>{w}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
              {[...Array(35)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: '2px' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
              {[...Array(offset)].map((_, i) => <div key={`e${i}`} />)}
              {days.map(d => {
                const ds = format(d, 'yyyy-MM-dd');
                const info = avail[ds];
                const isPast = isBefore(d, startOfDay(new Date()));
                const isBlocked = info && !info.available;
                const isTodayDate = isToday(d);
                const isSel = selDs === ds;
                const isActing = acting === ds;

                let bg = 'transparent', color = 'var(--fg-3)', borderColor = 'transparent';
                if (isPast) { color = 'var(--fg-4)'; }
                else if (isBlocked) { bg = 'rgba(192,80,80,0.1)'; color = '#c05050'; borderColor = 'rgba(192,80,80,0.25)'; }
                else if (info?.available) { bg = 'rgba(45,168,118,0.07)'; color = '#2da876'; borderColor = 'rgba(45,168,118,0.2)'; }
                if (isSel) { borderColor = 'var(--gold)'; bg = 'rgba(191,160,106,0.12)'; color = 'var(--gold)'; }
                if (isTodayDate && !isSel) { borderColor = 'rgba(191,160,106,0.4)'; }

                return (
                  <button key={ds} onClick={() => handleDay(d)} disabled={isPast || isActing}
                    style={{
                      aspectRatio: '1', borderRadius: '2px', border: `1px solid ${borderColor}`,
                      background: bg, color, fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem',
                      cursor: isPast ? 'default' : 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: isPast ? 0.3 : 1,
                    }}
                    onMouseEnter={e => { if (!isPast && !isSel) e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = borderColor; }}
                  >
                    {isActing ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : d.getDate()}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            {[
              { color: 'rgba(45,168,118,0.07)', border: 'rgba(45,168,118,0.2)', text: '#2da876', label: 'Available' },
              { color: 'rgba(192,80,80,0.1)', border: 'rgba(192,80,80,0.25)', text: '#c05050', label: 'Blocked' },
              { color: 'transparent', border: 'rgba(191,160,106,0.4)', text: 'var(--gold)', label: 'Today' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: l.color, border: `1px solid ${l.border}` }} />
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', color: 'var(--fg-4)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {selected ? (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '22px' }}>
              <span className="section-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.58rem' }}>Selected</span>
              <div style={{ fontFamily: 'Cormorant,serif', fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 300, marginBottom: '16px' }}>
                {format(selected, 'EEEE, d MMMM')}
              </div>
              {selData && !selData.available ? (
                <>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: 'var(--fg-3)', marginBottom: '14px', fontWeight: 300 }}>
                    This date is currently blocked{selData.reason ? ` — ${selData.reason}` : ''}.
                  </p>
                  <button onClick={() => unblock(selDs)}
                    style={{ width: '100%', padding: '11px', border: '1px solid rgba(45,168,118,0.3)', background: 'rgba(45,168,118,0.07)', color: '#2da876', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s' }}>
                    <Unlock size={11} /> Unblock Date
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: '6px' }}>Reason (optional)</div>
                  <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Personal commitment"
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-2)', color: 'var(--fg)', fontFamily: 'Montserrat,sans-serif', fontSize: '0.8rem', padding: '8px 0', width: '100%', outline: 'none', marginBottom: '16px', fontWeight: 300 }}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
                    onBlur={e => e.target.style.borderBottomColor = 'var(--border-2)'}
                  />
                  <button onClick={block}
                    style={{ width: '100%', padding: '11px', border: '1px solid rgba(192,80,80,0.3)', background: 'rgba(192,80,80,0.07)', color: '#c05050', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s' }}>
                    <Lock size={11} /> Block Date
                  </button>
                </>
              )}
              <button onClick={() => setSelected(null)}
                style={{ width: '100%', marginTop: '8px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', color: 'var(--fg-4)', letterSpacing: '0.1em' }}>
                Deselect
              </button>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '22px', textAlign: 'center' }}>
              <Calendar size={22} style={{ color: 'var(--gold)', opacity: 0.3, margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: 'var(--fg-4)', lineHeight: 1.7, fontWeight: 300 }}>
                Click a date on the calendar to block or unblock it.
              </p>
            </div>
          )}

          {/* Stats */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '18px' }}>
            <span className="section-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.58rem' }}>This Month</span>
            {[
              ['Available', Object.values(avail).filter(v => v.available).length, '#2da876'],
              ['Blocked',   Object.values(avail).filter(v => !v.available).length, '#c05050'],
              ['Total days', Object.keys(avail).length, 'var(--fg)'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', color: 'var(--fg-3)' }}>{label}</span>
                <span style={{ fontFamily: 'Cormorant,serif', fontSize: '1.1rem', color, fontWeight: 300 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
