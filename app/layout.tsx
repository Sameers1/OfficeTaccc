import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/sidebar-context"
import { AuthProvider } from "./context/auth-context"
import SupabaseAuthProvider from "@/components/providers/supabase-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Modern Task Management",
  description: "Enhanced task management system for administrative teams",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SupabaseAuthProvider>
              <SidebarProvider>
                <div className="h-full relative">
                  <div className="fixed inset-0 flex">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto bg-background">
                      {children}
                    </main>
                  </div>
                </div>
                <Toaster />
              </SidebarProvider>
            </SupabaseAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'