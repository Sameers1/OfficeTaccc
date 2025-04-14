"use client"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-auto bg-white p-8">
      {children}
    </main>
  )
}
