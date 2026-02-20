import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses } = evt.data
    const email = email_addresses[0]?.email_address

    if (!email) {
      return new Response('No email found', { status: 400 })
    }

    await prisma.user.upsert({
      where: { clerkUserId: id },
      update: { email },
      create: {
        clerkUserId: id,
        email,
        subscription: {
          create: {
            plan: 'STARTER',
            status: 'ACTIVE',
          }
        }
      },
    })

    // Send welcome email
    try {
      const { sendEmail } = await import('@/lib/resend')
      await sendEmail({
        to: email,
        subject: 'Welcome to AXIS OS',
        html: `<h1>Welcome to the Future of Content.</h1><p>Your AXIS Node is now active. Start generating high-fidelity assets today.</p>`
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
      await prisma.user.delete({
        where: { clerkUserId: id },
      })
    }
  }

  return new Response('', { status: 200 })
}
