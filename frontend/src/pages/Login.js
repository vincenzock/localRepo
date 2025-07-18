import React, { useState } from 'react';

function Spinner() {
  return <div className="flex justify-center"><div className="w-5 h-5 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
}

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  gender: '',
  dob: '',
  country: '',
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const url = isLogin ? 'http://127.0.0.1:8000/login' : 'http://127.0.0.1:8000/register';
    const payload = isLogin
      ? { email: form.email, password: form.password, name: 'dummy' }
      : { ...form };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed');
      const data = await res.json();
      localStorage.setItem('docvita_user', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-green-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="input" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
              <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" className="input" />
              <input name="dob" value={form.dob} onChange={handleChange} placeholder="Date of Birth" type="date" className="input" />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input" />
            </>
          )}
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" type="email" className="input" />
          <input name="password" value={form.password} onChange={handleChange} required placeholder="Password" type="password" className="input" />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold mt-2 shadow hover:bg-blue-700 transition-colors flex items-center justify-center" disabled={loading}>
            {loading ? <Spinner /> : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          {isLogin ? (
            <>
              New here?{' '}
              <button className="text-blue-600 underline" onClick={() => setIsLogin(false)}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="text-blue-600 underline" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        .input {
          @apply border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition-shadow shadow-sm;
        }
      `}</style>
    </div>
  );
} 