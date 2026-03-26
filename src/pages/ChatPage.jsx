import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { useChat } from '../hooks/useChat';
import { bookingsAPI } from '../utils/api';

export default function ChatPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [input, setInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  const { messages, connected, isTyping, send, sendTyping } = useChat(
    nameSet ? bookingId : null, 'client', clientName
  );

  useEffect(() => { bookingsAPI.getById(bookingId).then((r) => setBooking(r.data)).catch(() => {}); }, [bookingId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input.trim());
    setInput('');
    sendTyping(false);
    clearTimeout(typingTimer.current);
  };

  if (!nameSet) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ maxWidth:'360px', width:'100%', background:'var(--bg-2)', border:'1px solid var(--border)', padding:'40px 32px' }}>
        <span className="section-label" style={{ display:'block', marginBottom:'10px' }}>Booking Chat</span>
        <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'2rem', fontWeight:300, color:'var(--fg)', marginBottom:'8px' }}>Join the Chat</h2>
        <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'28px', fontWeight:300 }}>
          Enter your name to chat with Bebeto Media about your session.
        </p>
        <input value={clientName} onChange={(e) => setClientName(e.target.value)}
          onKeyDown={(e) => e.key==='Enter' && clientName.trim() && setNameSet(true)}
          placeholder="Your name"
          style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)', color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.9rem', padding:'10px 0', width:'100%', outline:'none', marginBottom:'24px' }} />
        <button onClick={() => clientName.trim() && setNameSet(true)} disabled={!clientName.trim()} className="btn-primary"
          style={{ width:'100%', padding:'14px', justifyContent:'center', opacity: clientName.trim() ? 1 : 0.5 }}>
          <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em' }}>Enter Chat</span>
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ background:'var(--surface)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, marginTop:'72px' }}>
        <div>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'2px' }}>Live Chat</div>
          {booking && <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.15rem', color:'var(--fg)', fontWeight:400 }}>{booking.package_name}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem' }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: connected ? '#2da876' : '#c05050' }} />
          {connected ? <Wifi size={11} style={{ color:'#2da876' }} /> : <WifiOff size={11} style={{ color:'var(--fg-4)' }} />}
          <span style={{ color: connected ? '#2da876' : 'var(--fg-4)' }}>{connected ? 'Live' : 'Reconnecting'}</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:'14px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 0', fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-4)' }}>
            Start the conversation with Bebeto Media.
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_type === 'client';
            return (
              <motion.div key={msg.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'72%', display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap:'3px' }}>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.1em', color: isMe ? 'var(--gold)' : 'var(--fg-3)' }}>
                    {msg.sender_name}
                  </div>
                  <div className={isMe ? 'bubble-client' : 'bubble-admin'}>
                    <p style={{ padding:'11px 15px', fontFamily:'Montserrat,sans-serif', fontSize:'0.82rem', color:'var(--fg)', lineHeight:1.65, fontWeight:300 }}>{msg.content}</p>
                  </div>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', color:'var(--fg-4)' }}>
                    {msg.created_at ? format(new Date(msg.created_at), 'HH:mm') : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ display:'flex', gap:'3px' }}>
              {[0,1,2].map(i => <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--gold)', opacity:0.6, animation:`bounce 1s ${i*0.15}s infinite` }} />)}
            </div>
            <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'var(--fg-4)' }}>{isTyping} is typing...</span>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ background:'var(--surface)', backdropFilter:'blur(20px)', borderTop:'1px solid var(--border)', padding:'14px 24px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:'10px', alignItems:'flex-end', maxWidth:'800px', margin:'0 auto' }}>
          <textarea value={input}
            onChange={(e) => { setInput(e.target.value); sendTyping(true); clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => sendTyping(false), 1500); }}
            onKeyDown={(e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            style={{ flex:1, background:'var(--bg-3)', border:'1px solid var(--border)', color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.85rem', padding:'10px 14px', resize:'none', minHeight:'42px', maxHeight:'110px', outline:'none', fontWeight:300, lineHeight:1.5, transition:'border-color 0.3s' }}
            onFocus={e => e.target.style.borderColor='var(--gold)'}
            onBlur={e => e.target.style.borderColor='var(--border)'}
          />
          <button onClick={handleSend} disabled={!input.trim() || !connected} className="btn-primary"
            style={{ padding:'10px 14px', flexShrink:0, opacity: input.trim() && connected ? 1 : 0.45 }}>
            <span><Send size={14} /></span>
          </button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}
