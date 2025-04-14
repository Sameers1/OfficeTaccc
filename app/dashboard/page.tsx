"use client"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { TaskList, TaskListSkeleton } from "@/components/dashboard/task-list"
import { TaskMetrics } from "@/components/dashboard/task-metrics"
import { NewTaskButton } from "@/components/new-task-button"
import { TaskChart } from "@/components/dashboard/task-chart"
import { TaskDistribution } from "@/components/dashboard/task-distribution"
import { ProtectedRoute } from "@/components/protected-route"
import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0)

  const handleTaskCreated = () => {
    setTaskUpdateTrigger(prev => prev + 1)
  }

  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your tasks.</p>
          </div>
          <div className="flex items-center gap-6">
            <Suspense fallback={<Skeleton className="h-10 w-40" />}>
              <TaskDistribution />
            </Suspense>
            <NewTaskButton onTaskCreated={handleTaskCreated} />
          </div>
        </div>

        <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-[120px]" /></div>}>
          <TaskMetrics onTaskCreated={() => {}} />
        </Suspense>

        <Suspense fallback={<Card className="p-6"><Skeleton className="h-[300px]" /></Card>}>
          <TaskChart className="w-full" />
        </Suspense>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Link href="/my-tasks">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Suspense fallback={<TaskListSkeleton />}>
            <TabsContent value="all">
              <TaskList filter="all" />
            </TabsContent>
            <TabsContent value="pending">
              <TaskList filter="pending" />
            </TabsContent>
            <TabsContent value="in-progress">
              <TaskList filter="in-progress" />
            </TabsContent>
            <TabsContent value="completed">
              <TaskList filter="completed" />
            </TabsContent>
          </Suspense>
        </Tabs>
      </PageContainer>
    </ProtectedRoute>
  )
}
