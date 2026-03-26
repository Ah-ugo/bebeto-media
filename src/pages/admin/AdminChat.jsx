/** @format */

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { useChat } from '../../hooks/useChat';
import { bookingsAPI } from '../../utils/api';

export default function AdminChat() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  // Get token for authenticated WebSocket connection
  const auth = JSON.parse(localStorage.getItem('bebeto-auth') || '{}');
  const token = auth?.state?.token || auth?.state?.access_token;

  const { messages, connected, isTyping, roomCount, send, sendTyping } =
    useChat(bookingId, 'admin', 'Bebeto Media', token);

  useEffect(() => {
    if (bookingId?.startsWith('support_')) return; // No booking for support rooms
    bookingsAPI
      .getById(bookingId)
      .then((r) => setBooking(r.data))
      .catch(() => {});
  }, [bookingId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    // Ensure we send the full payload if the hook doesn't do it automatically
    send(input.trim());

    setInput('');
    sendTyping(false);
    clearTimeout(typingTimer.current);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to={
              bookingId?.startsWith('support_')
                ? '/admin/chats'
                : `/admin/bookings/${bookingId}`
            }
            style={{
              color: 'var(--fg-3)',
              transition: 'color 0.25s',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-3)')}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: '0.58rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '2px',
              }}
            >
              Admin Chat
            </div>
            {bookingId?.startsWith('support_') ? (
              <div
                style={{
                  fontFamily: 'Cormorant,serif',
                  fontSize: '1.15rem',
                  color: 'var(--fg)',
                  fontWeight: 400,
                }}
              >
                General Support Enquiry
              </div>
            ) : (
              booking && (
                <div
                  style={{
                    fontFamily: 'Cormorant,serif',
                    fontSize: '1.15rem',
                    color: 'var(--fg)',
                    fontWeight: 400,
                  }}
                >
                  {booking.client_name} — {booking.package_name}
                </div>
              )
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.6rem',
              color: 'var(--fg-4)',
            }}
          >
            {roomCount} online
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: connected ? '#2da876' : '#c05050',
              }}
            />
            {connected ? (
              <Wifi size={11} style={{ color: '#2da876' }} />
            ) : (
              <WifiOff size={11} style={{ color: 'var(--fg-4)' }} />
            )}
            <span
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: '0.6rem',
                color: connected ? '#2da876' : 'var(--fg-4)',
              }}
            >
              {connected ? 'Live' : 'Reconnecting'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'var(--bg)',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 0',
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.75rem',
              color: 'var(--fg-4)',
            }}
          >
            No messages yet. Waiting for the client to initiate.
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAdmin = msg.sender_type === 'admin';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAdmin ? 'flex-end' : 'flex-start',
                    gap: '3px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.58rem',
                      letterSpacing: '0.1em',
                      color: isAdmin ? 'var(--gold)' : 'var(--fg-3)',
                    }}
                  >
                    {msg.sender_name}
                  </div>
                  <div className={isAdmin ? 'bubble-admin' : 'bubble-client'}>
                    <p
                      style={{
                        padding: '11px 15px',
                        fontFamily: 'Montserrat,sans-serif',
                        fontSize: '0.82rem',
                        color: 'var(--fg)',
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {msg.content}
                    </p>
                  </div>
                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.58rem',
                      color: 'var(--fg-4)',
                    }}
                  >
                    {msg.created_at &&
                    !isNaN(new Date(msg.created_at).getTime())
                      ? format(new Date(msg.created_at), 'HH:mm')
                      : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    opacity: 0.6,
                    animation: `bounce 1s ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: '0.65rem',
                color: 'var(--fg-4)',
              }}
            >
              {isTyping} is typing...
            </span>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          padding: '14px 24px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              sendTyping(true);
              clearTimeout(typingTimer.current);
              typingTimer.current = setTimeout(() => sendTyping(false), 1500);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder='Reply as Bebeto Media...'
            style={{
              flex: 1,
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--fg)',
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.85rem',
              padding: '10px 14px',
              resize: 'none',
              minHeight: '42px',
              maxHeight: '110px',
              outline: 'none',
              fontWeight: 300,
              lineHeight: 1.5,
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            className='btn-primary'
            style={{
              padding: '10px 14px',
              flexShrink: 0,
              opacity: input.trim() && connected ? 1 : 0.45,
            }}
          >
            <span>
              <Send size={14} />
            </span>
          </button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}
