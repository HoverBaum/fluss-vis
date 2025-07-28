import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { FlussStoreProvider } from '@/stores/FlussStoreProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { SettingsStoreProvider } from '@/stores/SettingsStoreProvider'
import { ReactFlowProvider } from '@xyflow/react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Fluss Vis 🌊',
  description: 'Design your TypeScript flow visually.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // Suppress Hydration warning because plugins…
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsStoreProvider>
            <FlussStoreProvider>
              <ReactFlowProvider>{children}</ReactFlowProvider>
            </FlussStoreProvider>
          </SettingsStoreProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
