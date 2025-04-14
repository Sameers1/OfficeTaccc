"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, AlertCircle, BarChart } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TaskMetrics {
  total: number
  pending: number
  inProgress: number
  completed: number
  lastWeekTotal: number
}

interface TaskMetricsProps {
  onTaskCreated?: () => void
}

export function TaskMetrics({ onTaskCreated }: TaskMetricsProps) {
  const [metrics, setMetrics] = useState<TaskMetrics>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    lastWeekTotal: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        
        // Fetch tasks from the default organization
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('status, created_at')
          .eq('organization_id', '00000000-0000-0000-0000-000000000000')

        if (tasksError) throw tasksError

        // Calculate current metrics
        const currentMetrics = {
          total: tasks?.length || 0,
          pending: tasks?.filter(task => task.status === 'pending').length || 0,
          inProgress: tasks?.filter(task => task.status === 'in-progress').length || 0,
          completed: tasks?.filter(task => task.status === 'completed').length || 0,
          lastWeekTotal: 0
        }

        // Calculate last week's total
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        
        const lastWeekTasks = tasks?.filter(task => {
          const taskDate = new Date(task.created_at)
          return taskDate < oneWeekAgo
        }) || []

        currentMetrics.lastWeekTotal = lastWeekTasks.length

        setMetrics(currentMetrics)
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [onTaskCreated])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loading...</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">...</h2>
                    <span className="text-xs text-muted-foreground">...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metricsData = [
    {
      title: "Total Tasks",
      value: metrics.total.toString(),
      subtext: `+${metrics.total - metrics.lastWeekTotal} from last week`,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      icon: BarChart,
    },
    {
      title: "Pending",
      value: metrics.pending.toString(),
      subtext: "Requires attention",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      icon: AlertCircle,
    },
    {
      title: "In Progress",
      value: metrics.inProgress.toString(),
      subtext: "Currently being worked on",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      icon: Clock,
    },
    {
      title: "Completed",
      value: metrics.completed.toString(),
      subtext: "Finished tasks",
      color: "bg-green-500",
      textColor: "text-green-500",
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {metric.value}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {metric.subtext}
                  </span>
                </div>
              </div>
              {metric.icon && (
                <div className={`p-2 rounded-full ${metric.color}/10`}>
                  <metric.icon className={`h-5 w-5 ${metric.textColor}`} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${metric.color}`}
                  style={{ width: `${(parseInt(metric.value) / metrics.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
