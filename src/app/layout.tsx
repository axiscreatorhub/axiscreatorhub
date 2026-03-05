import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Outfit } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'AXIS Creator Hub AI',
  description: 'The AI-Powered Operating System for Modern Creators.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmstYnVpbGQtZHVtbXktMTIzNDU2Nzg5MA==';

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
        <body className="antialiased font-sans bg-[#0a0a12] text-white">
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
