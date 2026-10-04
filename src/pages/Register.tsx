import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', organizationName: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create organizationId automatically based on time since it's required by the DB
      const submissionData = {
        ...formData,
        organizationId: `org-${Date.now()}`
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server xatosi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Ro'yxatdan o'tish</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">F.I.Sh</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-lg" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input type="password" required className="w-full px-4 py-2 border rounded-lg" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">MTT nomi (Tashkilot)</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-lg" value={formData.organizationName} onChange={e => setFormData({...formData, organizationName: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-2">Ro'yxatdan o'tish</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Akkauntingiz bormi? <Link to="/login" className="text-blue-600 hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
