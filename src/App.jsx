/** @format */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import ChatPage from './pages/ChatPage';
import ReviewPage from './pages/ReviewPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminPackages from './pages/admin/AdminPackages';
import AdminAvailability from './pages/admin/AdminAvailability';
import AdminChat from './pages/admin/AdminChat';
import AdminInbox from './pages/admin/AdminInbox';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: 'var(--bg-2)',
              color: 'var(--fg)',
              border: '1px solid var(--gold-border)',
              fontFamily: "'Montserrat',sans-serif",
              fontSize: '13px',
              fontWeight: 300,
            },
            success: {
              iconTheme: { primary: 'var(--gold)', secondary: 'var(--bg)' },
            },
            error: {
              iconTheme: { primary: '#c05050', secondary: 'var(--bg)' },
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/portfolio' element={<PortfolioPage />} />
            <Route path='/services' element={<ServicesPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/book' element={<BookingPage />} />
            <Route
              path='/booking/confirm/:bookingId'
              element={<BookingConfirmPage />}
            />
            <Route path='/chat/:bookingId' element={<ChatPage />} />
            <Route path='/review/:bookingId' element={<ReviewPage />} />
          </Route>
          <Route path='/admin/login' element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path='/admin' element={<AdminDashboard />} />
              <Route path='/admin/bookings' element={<AdminBookings />} />
              <Route
                path='/admin/bookings/:bookingId'
                element={<AdminBookingDetail />}
              />
              <Route path='/admin/portfolio' element={<AdminPortfolio />} />
              <Route path='/admin/packages' element={<AdminPackages />} />
              <Route
                path='/admin/availability'
                element={<AdminAvailability />}
              />
              <Route path='/admin/chats' element={<AdminInbox />} />
              <Route path='/admin/chat/:bookingId' element={<AdminChat />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
