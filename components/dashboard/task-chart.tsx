"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface ChartData {
  name: string
  completed: number
  inProgress: number
  pending: number
}

interface TaskChartProps {
  className?: string
}

export function TaskChart({ className }: TaskChartProps) {
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([])
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTaskData() {
      try {
        setLoading(true)
        
        // Fetch all tasks with created_at timestamp
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('status, created_at')
          .order('created_at', { ascending: true })

        if (tasksError) throw tasksError

        // Process weekly data
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const weeklyStats = weekDays.map(day => ({
          name: day,
          completed: 0,
          inProgress: 0,
          pending: 0
        }))

        // Process monthly data (last 4 weeks)
        const monthlyStats = Array.from({ length: 4 }, (_, i) => ({
          name: `Week ${i + 1}`,
          completed: 0,
          inProgress: 0,
          pending: 0
        }))

        // Process tasks for weekly and monthly data
        tasks?.forEach(task => {
          const date = new Date(task.created_at)
          const dayIndex = date.getDay() - 1 // -1 because getDay() returns 0-6 (Sun-Sat)
          const weekIndex = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))

          // Update weekly stats
          if (dayIndex >= 0 && dayIndex < 7) {
            if (task.status === 'completed') weeklyStats[dayIndex].completed++
            if (task.status === 'in-progress') weeklyStats[dayIndex].inProgress++
            if (task.status === 'pending') weeklyStats[dayIndex].pending++
          }

          // Update monthly stats
          if (weekIndex >= 0 && weekIndex < 4) {
            if (task.status === 'completed') monthlyStats[weekIndex].completed++
            if (task.status === 'in-progress') monthlyStats[weekIndex].inProgress++
            if (task.status === 'pending') monthlyStats[weekIndex].pending++
          }
        })

        setWeeklyData(weeklyStats)
        setMonthlyData(monthlyStats.reverse()) // Reverse to show most recent week last
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTaskData()
  }, [])

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="text-base font-medium">Task Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="text-base font-medium">Task Overview</CardTitle>
          <p className="text-sm text-red-500">Error: {error}</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Task Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Task completion and status trends
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(142.1 76.2% 36.3%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inProgress" 
                  stroke="hsl(262.1 83.3% 57.8%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="hsl(48 96.5% 53.9%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(142.1 76.2% 36.3%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inProgress" 
                  stroke="hsl(262.1 83.3% 57.8%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="hsl(48 96.5% 53.9%)" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
