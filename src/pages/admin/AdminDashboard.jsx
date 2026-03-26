/** @format */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Users,
  Star,
  Clock,
  CheckCircle,
  DollarSign,
  MessageSquare,
  Image,
  Mail,
} from 'lucide-react';
import { dashboardAPI, bookingsAPI } from '../../utils/api';

const fmt = (n) =>
  `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 0 })}`;
const S = ({ label, value, icon: Icon, sub, accent }) => (
  <div
    style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    }}
  >
    <div
      style={{ position: 'absolute', top: '14px', right: '16px', opacity: 0.1 }}
    >
      <Icon size={26} style={{ color: 'var(--fg)' }} />
    </div>
    <div
      style={{
        fontFamily: 'Montserrat,sans-serif',
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--fg-4)',
        marginBottom: '8px',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: 'Cormorant,serif',
        fontSize: '2.2rem',
        fontWeight: 300,
        color: accent || 'var(--fg)',
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div
        style={{
          fontFamily: 'Montserrat,sans-serif',
          fontSize: '0.6rem',
          color: 'var(--fg-4)',
          marginTop: '4px',
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.stats(), bookingsAPI.getAll({ page_size: 6 })])
      .then(([s, b]) => {
        setStats(s.data);
        setRecent(b.data.items || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const badge = (status) => {
    const map = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      rejected: 'badge-rejected',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return (
      <span
        className={map[status] || ''}
        style={{
          fontSize: '0.58rem',
          padding: '2px 8px',
          borderRadius: '2px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'Montserrat,sans-serif',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '36px 32px' }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <span
          className='section-label'
          style={{ display: 'block', marginBottom: '8px' }}
        >
          Overview
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
          Dashboard
        </h1>
      </motion.div>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '2px',
            marginBottom: '24px',
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} className='skeleton' style={{ height: '100px' }} />
          ))}
        </div>
      ) : (
        stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: '2px',
              marginBottom: '24px',
            }}
          >
            <S
              label='Total Bookings'
              value={stats.total_bookings}
              icon={Calendar}
            />
            <S
              label='Pending'
              value={stats.pending_bookings}
              icon={Clock}
              accent='var(--gold)'
            />
            <S
              label='Confirmed'
              value={stats.confirmed_bookings}
              icon={CheckCircle}
              accent='#2da876'
            />
            <S
              label='Total Revenue'
              value={fmt(stats.total_revenue)}
              icon={DollarSign}
              accent='var(--gold)'
            />
            <S
              label='This Month'
              value={fmt(stats.monthly_revenue)}
              icon={TrendingUp}
            />
            <S label='Clients' value={stats.total_clients} icon={Users} />
            <S
              label='Avg Rating'
              value={`${stats.average_rating}★`}
              icon={Star}
              accent='var(--gold)'
            />
            <Link to='/admin/chats' style={{ textDecoration: 'none' }}>
              <S
                label='Unread Messages'
                value={stats.unread_messages}
                icon={MessageSquare}
                accent={stats.unread_messages > 0 ? 'var(--gold)' : null}
              />
            </Link>
          </div>
        )
      )}

      <div
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontFamily: 'Cormorant,serif',
              fontSize: '1.2rem',
              color: 'var(--fg)',
            }}
          >
            Recent Bookings
          </div>
          <Link
            to='/admin/bookings'
            style={{
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              fontFamily: 'Montserrat,sans-serif',
              fontSize: '0.75rem',
              color: 'var(--fg-4)',
            }}
          >
            No bookings yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Client', 'Package', 'Date', 'Total', 'Status', ''].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontFamily: 'Montserrat,sans-serif',
                          fontSize: '0.55rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'var(--fg-4)',
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'var(--bg-3)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '')
                    }
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div
                        style={{
                          fontFamily: 'Montserrat,sans-serif',
                          fontSize: '0.8rem',
                          color: 'var(--fg)',
                        }}
                      >
                        {b.client_name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Montserrat,sans-serif',
                          fontSize: '0.65rem',
                          color: 'var(--fg-4)',
                          marginTop: '1px',
                        }}
                      >
                        {b.client_email}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'Montserrat,sans-serif',
                        fontSize: '0.78rem',
                        color: 'var(--fg-2)',
                      }}
                    >
                      {b.package_name}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'Montserrat,sans-serif',
                        fontSize: '0.78rem',
                        color: 'var(--fg-2)',
                      }}
                    >
                      {new Date(b.booking_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'Cormorant,serif',
                        fontSize: '1.1rem',
                        color: 'var(--gold)',
                        fontWeight: 300,
                      }}
                    >
                      {fmt(b.price?.total_price)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{badge(b.status)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        to={`/admin/bookings/${b.id}`}
                        style={{
                          fontFamily: 'Montserrat,sans-serif',
                          fontSize: '0.58rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--gold)',
                          textDecoration: 'none',
                        }}
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
