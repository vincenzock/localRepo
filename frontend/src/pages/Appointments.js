import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse flex flex-col gap-2">
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-100 rounded" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
    </div>
  );
}

export default function Appointments({ user }) {
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://127.0.0.1:8000/therapists').then(r => r.json()),
      fetch(`http://127.0.0.1:8000/appointments?user_id=${user.id}`).then(r => r.json())
    ])
      .then(([therapistsData, appointmentsData]) => {
        setTherapists(therapistsData);
        setAppointments(appointmentsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Your Appointments</h2>
      {loading && (
        <div className="flex flex-col gap-2 mb-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-6">
        {!loading && appointments.length === 0 ? (
          <div className="flex flex-col items-center text-gray-400 mt-8">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
            <span>No appointments yet. Book your first session!</span>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {appointments.map(a => (
              <li key={a.id} className="bg-white rounded-xl shadow p-4 flex flex-col transition-transform duration-150 hover:scale-[1.02] hover:shadow-lg">
                <span className="font-semibold text-blue-800 mb-1">{a.status === 'upcoming' ? 'Upcoming' : 'Past'} Appointment</span>
                <span className="text-gray-700 text-sm">Date: {new Date(a.date).toLocaleString()}</span>
                <span className="text-gray-700 text-sm">Duration: {a.duration} min</span>
                <span className="text-gray-700 text-sm">Therapist ID: {a.therapist_id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 className="text-xl font-bold text-blue-900 mb-2">Available Therapists</h2>
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : therapists.map(t => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-1 transition-transform duration-150 hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-semibold text-blue-900">{t.name}</div>
                <div className="text-xs text-gray-400">{t.country}</div>
              </div>
            </div>
            <div className="mt-2 text-gray-700 text-sm">{t.intro}</div>
            <div className="mt-1 text-xs text-green-700 font-medium">Specialization: {t.specialization}</div>
            <button className="mt-2 bg-blue-600 text-white rounded py-1 font-semibold shadow hover:bg-blue-700 transition-colors" onClick={() => navigate('/booking', { state: { therapist: t } })}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
} 