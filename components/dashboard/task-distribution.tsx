"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface TaskDistributionProps {
  className?: string
}

interface TaskCount {
  status: string
  count: number
  color: string
}

export function TaskDistribution({ className }: TaskDistributionProps) {
  const [data, setData] = useState<TaskCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTaskDistribution() {
      try {
        setLoading(true)
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('status')

        if (tasksError) throw tasksError

        const completed = tasks?.filter(task => task.status === 'completed').length || 0
        const inProgress = tasks?.filter(task => task.status === 'in-progress').length || 0
        const pending = tasks?.filter(task => task.status === 'pending').length || 0

        setData([
          { status: "Completed", count: completed, color: "text-green-500" },
          { status: "In Progress", count: inProgress, color: "text-purple-500" },
          { status: "Pending", count: pending, color: "text-amber-500" },
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTaskDistribution()
  }, [])

  if (loading) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-lg font-semibold text-muted">...</span>
            <span className="text-sm text-muted-foreground">Loading</span>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {data.map((item) => (
        <div key={item.status} className="flex items-center gap-1.5">
          <span className={cn("text-lg font-semibold", item.color)}>{item.count}</span>
          <span className="text-sm text-muted-foreground">{item.status}</span>
        </div>
      ))}
    </div>
  )
}
