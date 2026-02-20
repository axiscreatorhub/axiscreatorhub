export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AXIS OS <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Resend error:', error);
    throw new Error('Failed to send email');
  }

  return res.json();
}
