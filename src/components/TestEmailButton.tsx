'use client';

import { useState } from 'react';

export function TestEmailButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendTestEmail = async () => {
    setLoading(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'avishaann@gmail.com' }), // Using user's email from context
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Test email sent successfully!');
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={sendTestEmail}
        disabled={loading}
        className="btn-primary !px-10 !py-4"
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      {status === 'success' && <p className="text-brand-purple font-medium text-sm">{message}</p>}
      {status === 'error' && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
}
