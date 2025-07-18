import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Spinner() {
  return <div className="flex justify-center"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
}

export default function Booking({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const therapist = location.state?.therapist;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!therapist) {
    return <div className="p-4">No therapist selected.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    const dateTime = new Date(`${date}T${time}`);
    try {
      const res = await fetch('http://127.0.0.1:8000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapist_id: therapist.id,
          date: dateTime.toISOString(),
          duration,
          status: 'upcoming',
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed');
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Book Appointment</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-4 transition-transform duration-150 hover:scale-[1.01] hover:shadow-lg">
        <div className="font-semibold text-blue-900 text-lg">{therapist.name}</div>
        <div className="text-gray-700 text-sm mb-1">{therapist.intro}</div>
        <div className="text-xs text-green-700 font-medium">Specialization: {therapist.specialization}</div>
        <div className="text-xs text-gray-400">{therapist.country}</div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">Date</label>
        <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input" />
        <label className="text-sm">Time</label>
        <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="input" />
        <label className="text-sm">Duration (minutes)</label>
        <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="input">
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
        </select>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && (
          <div className="flex flex-col items-center text-green-600 text-sm text-center">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Booking successful!
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold mt-2 shadow hover:bg-blue-700 transition-colors flex items-center justify-center" disabled={loading}>
          {loading ? <Spinner /> : 'Book Appointment'}
        </button>
      </form>
      <style>{`
        .input {
          @apply border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition-shadow shadow-sm;
        }
      `}</style>
    </div>
  );
} 