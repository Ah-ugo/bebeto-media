/** @format */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, User, Clock, ChevronRight, Search } from 'lucide-react';
import { chatAPI } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminInbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (chatAPI.getConversations) {
      chatAPI
        .getConversations()
        .then((r) => setConversations(r.data))
        .finally(() => setLoading(false));
    } else {
      console.error(
        'chatAPI.getConversations is not defined. Ensure web/src/utils/api.js is updated.',
      );
      setLoading(false);
    }
  }, []);

  const safeFormat = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '...' : format(d, 'MMM d, HH:mm');
  };

  const filtered = conversations.filter(
    (c) =>
      (c.booking_id || '').toLowerCase().includes(search.toLowerCase()) ||
      c.last_message?.sender_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: '36px 32px' }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <span
          className='section-label'
          style={{ display: 'block', marginBottom: '8px' }}
        >
          Communication
        </span>
        <h1
          style={{
            fontFamily: 'Cormorant,serif',
            fontSize: '2.5rem',
            fontWeight: 300,
            color: 'var(--fg)',
            margin: 0,
          }}
        >
          Chat Inbox
        </h1>
      </motion.div>

      <div
        style={{
          marginBottom: '24px',
          position: 'relative',
          maxWidth: '400px',
        }}
      >
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--fg-4)',
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search conversations...'
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            color: 'var(--fg)',
            fontFamily: 'Montserrat,sans-serif',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>

      <div
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
      >
        {loading ? (
          <div
            style={{ padding: '40px', textAlign: 'center' }}
            className='skeleton-text'
          >
            Loading conversations...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '60px',
              textAlign: 'center',
              color: 'var(--fg-4)',
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.85rem',
            }}
          >
            <MessageSquare
              size={32}
              style={{ marginBottom: '12px', opacity: 0.2 }}
            />
            <p>No active conversations found.</p>
          </div>
        ) : (
          <div>
            {filtered.map((chat) => {
              const isSupport = chat.booking_id.startsWith('support_');
              return (
                <Link
                  key={chat.booking_id}
                  to={`/admin/chat/${chat.booking_id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--bg-3)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isSupport
                        ? 'rgba(201,168,76,0.1)'
                        : 'var(--bg-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {isSupport ? (
                      <User size={18} color='var(--gold)' />
                    ) : (
                      <MessageSquare size={18} color='var(--fg-3)' />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Cormorant,serif',
                          fontSize: '1.1rem',
                          color: 'var(--fg)',
                        }}
                      >
                        {isSupport
                          ? 'General Support Enquiry'
                          : `Booking Chat #${chat.booking_id.slice(-6).toUpperCase()}`}
                      </span>
                      {chat.last_message && (
                        <span
                          style={{
                            fontFamily: 'Montserrat,sans-serif',
                            fontSize: '0.65rem',
                            color: 'var(--fg-4)',
                          }}
                        >
                          {safeFormat(chat.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'Montserrat,sans-serif',
                          fontSize: '0.78rem',
                          color: 'var(--fg-3)',
                          margin: 0,
                          maxWidth: '500px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <strong
                          style={{ color: 'var(--gold)', fontWeight: 400 }}
                        >
                          {chat.last_message?.sender_name}:
                        </strong>{' '}
                        {chat.last_message?.content}
                      </p>
                      {chat.unread_count > 0 && (
                        <span
                          style={{
                            background: 'var(--gold)',
                            color: '#000',
                            fontSize: '0.6rem',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color='var(--border-2)' />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
