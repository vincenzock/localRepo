import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Login from './pages/Login';
import AppointmentsPage from './pages/Appointments';
import Booking from './pages/Booking';
import VideoCall from './pages/VideoCall';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

function Home({ user }) {
  const navigate = window.location;
  return (
    <div className="flex flex-col items-center py-6 px-2 relative w-full">
      <button
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-blue-50 transition-colors"
        onClick={() => (window.location.href = '/videocall')}
        title="Video Call with AI"
      >
        <VideoCameraIcon className="h-7 w-7 text-blue-600" />
      </button>
      <h1 className="text-3xl font-bold text-blue-900 mb-2">DocVita</h1>
      <p className="text-lg text-gray-700 mb-4">Meet Our Therapists</p>
      {/* Therapist cards will go here */}
    </div>
  );
}

function Journal() {
  return <div className="p-4">Journaling UI coming soon...</div>;
}

function Appointments() {
  return <div className="p-4">Appointments UI coming soon...</div>;
}

function Profile({ user }) {
  const handleLogout = () => {
    localStorage.removeItem('docvita_user');
    window.location.href = '/login';
  };
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 shadow-md">
        {user.name ? user.name.split(' ').map(n => n[0]).join('') : <span className="text-2xl text-gray-400">?</span>}
      </div>
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center transition-transform duration-150 hover:scale-[1.01] hover:shadow-lg">
        <div className="text-xl font-semibold text-blue-900 mb-2">{user.name || <span className='text-gray-400'>No name</span>}</div>
        <div className="text-gray-700 mb-1">{user.email || <span className='text-gray-400'>No email</span>}</div>
        <div className="text-gray-500 mb-1">{user.phone || <span className='text-gray-300'>No phone</span>}</div>
        <div className="text-gray-500 mb-1">{user.gender || <span className='text-gray-300'>No gender</span>}</div>
        <div className="text-gray-500 mb-1">{user.dob || <span className='text-gray-300'>No DOB</span>}</div>
        <div className="text-gray-500 mb-1">{user.country || <span className='text-gray-300'>No country</span>}</div>
        <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-6 py-2 rounded font-semibold shadow hover:bg-red-600 transition-colors">Logout</button>
      </div>
    </div>
  );
}

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/journal', icon: BookOpenIcon, label: 'Journal' },
  { to: '/appointments', icon: CalendarIcon, label: 'Appointments' },
  { to: '/profile', icon: UserCircleIcon, label: 'Profile' },
];

function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 shadow-md z-10">
      {navItems.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center text-xs group px-2 py-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}
            style={{ minWidth: 60 }}
          >
            <Icon className={`h-6 w-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`} />
            <span className={active ? 'font-semibold underline underline-offset-4' : ''}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem('docvita_user') || 'null');
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return React.cloneElement(children, { user });
}

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-16 bg-gradient-to-br from-blue-50 to-green-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/journal" element={<RequireAuth><Journal /></RequireAuth>} />
          <Route path="/appointments" element={<RequireAuth><AppointmentsPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/booking" element={<RequireAuth><Booking /></RequireAuth>} />
          <Route path="/videocall" element={<RequireAuth><VideoCall /></RequireAuth>} />
        </Routes>
        {window.location.pathname !== '/login' && window.location.pathname !== '/videocall' && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
