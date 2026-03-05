import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Outfit } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import { headers } from 'next/headers'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers();
  const host = headerList.get('host');
  const envKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const testKey = 'pk_test_aW5mb3JtZWQtb3dsLTUzLmNsZXJrLmFjY291bnRzLmRldiQ';
  
  const isPreview = host?.includes('.run.app') || host?.includes('localhost');
  
  // CRITICAL FIX: Clerk production keys (pk_live_...) are strictly locked to their domain.
  // Using them in the AI Studio preview environment causes "failed_to_load_clerk_js" or 
  // "Production Keys are only allowed for domain..." errors.
  // We force the test key in the preview environment if a production key is detected.
  const isProdKey = envKey?.startsWith('pk_live_');
  const publishableKey = isPreview && isProdKey ? testKey : (envKey || testKey);
  
  // Use a non-NEXT_PUBLIC variable to prevent Clerk from automatically picking it up
  // on the client side in environments where we don't want it (like the preview).
  const customDomain = process.env.CLERK_CUSTOM_DOMAIN;

  // Only use custom domain if the current host matches the domain
  // and we are NOT in the AI Studio preview environment.
  const clerkDomain = customDomain && host?.includes(customDomain) && !isPreview ? customDomain : undefined;

  return (
    /* @ts-ignore - Clerk types are strict about conditional domain props */
    <ClerkProvider 
      publishableKey={publishableKey} 
      domain={clerkDomain}
    >
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
        <body className="antialiased font-sans bg-[#0a0a12] text-white">
          {isPreview && isProdKey && (
            <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-black text-[10px] font-bold py-1 px-4 text-center">
              ⚠️ PREVIEW MODE: Production Clerk Key detected. Using a temporary Test Key for this preview. 
              Login with production accounts will only work on <span className="underline">axiscreatorhub.com</span>.
            </div>
          )}
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
