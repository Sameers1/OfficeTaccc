"use client"

import { Suspense } from "react"
import { TaskList, TaskListSkeleton } from "@/components/dashboard/task-list"
import { NewTaskButton } from "@/components/new-task-button"
import { ProtectedRoute } from "@/components/protected-route"
import { PageContainer } from "@/components/page-container"

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground">Manage and track your tasks.</p>
          </div>
          <NewTaskButton />
        </div>
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList filter="all" />
        </Suspense>
      </PageContainer>
    </ProtectedRoute>
  )
}
