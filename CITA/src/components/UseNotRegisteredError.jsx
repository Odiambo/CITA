'use client';

import React from 'react';

import { cita } from '@/api/citaClient';
import { useState } from 'react';

const UserNotRegisteredError = () => {
  const [registering, setRegistering] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSelfRegister = async () => {
    setRegistering(true);
    setError('');
    try {
      await cita.auth.updateMe({ full_name: '' });
      setDone(true);
      // Reload after a moment so auth context re-checks
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setError('Unable to register automatically. Please contact an administrator.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-teal-100">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Welcome to the Intake Portal</h1>
          {done ? (
            <p className="text-teal-600 font-medium">Registration successful! Loading your portal…</p>
          ) : (
            <>
              <p className="text-slate-600 mb-6">
                You're not yet registered as a participant. Click below to create your account and access your application portal.
              </p>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                onClick={handleSelfRegister}
                disabled={registering}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                {registering ? 'Registering…' : 'Register as Participant'}
              </button>
              <p className="text-xs text-slate-400 mt-4">
                If you are staff, contact an administrator to have the correct role assigned.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
