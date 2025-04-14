"use client"

import React, { useState, memo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Clock, AlertCircle, MoreHorizontal, Truck, FileText, CreditCard, FileEdit, LucideIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { TaskDetailSidebar } from "@/components/task-detail-sidebar"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { getTasks, updateTask, deleteTask, Task } from "@/lib/services/tasks"
import { NewTaskButton } from "@/components/new-task-button"

type IconMap = {
  [K in Task["type"]]: LucideIcon;
};

const taskTypeIcons: IconMap = {
  Shipment: Truck,
  Invoice: FileText,
  Payment: CreditCard,
  Custom: FileEdit,
}

type StatusIconMap = {
  [K in Task["status"]]: LucideIcon;
};

const statusIcons: StatusIconMap = {
  pending: Clock,
  "in-progress": AlertCircle,
  completed: CheckCircle2,
}

// Status colors for badges
const statusColors: Record<Task["status"], string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
  "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
}

// Priority colors
const priorityColors: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-700 ring-red-700/10",
  medium: "bg-amber-100 text-amber-700 ring-amber-700/10",
  low: "bg-emerald-100 text-emerald-700 ring-emerald-700/10"
}

interface TaskListProps {
  filter: "all" | "pending" | "in-progress" | "completed"
}

interface TaskListItemProps {
  task: Task
  onUpdate: (task: Task) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClick: (task: Task) => void
}

const TaskListItem = memo(function TaskListItem({ task, onUpdate, onDelete, onClick }: TaskListItemProps) {
  const StatusIcon = statusIcons[task.status]
  const TypeIcon = taskTypeIcons[task.type]
  
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:scale-[1.02] active:scale-[0.99]",
        "cursor-pointer border border-gray-100"
      )}
      onClick={() => onClick(task)}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b p-4 bg-gray-50/50 group-hover:bg-gray-50/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <StatusIcon className={cn("h-4 w-4", statusColors[task.status])} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={statusColors[task.status]}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_to || 'unassigned'}`} alt={task.assigned_to || 'Unassigned'} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {task.assigned_to 
                  ? task.assigned_to.split(" ").map((n) => n[0]).join("")
                  : "UN"}
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

export const TaskList = memo(function TaskList({ filter }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const tasks = await getTasks()
      setTasks(tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks])
    toast({
      title: "Success",
      description: "Task created successfully",
    })
  }

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDetailSidebarOpen(true)
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      )
      setSelectedTask(updatedTask)

      await updateTask(updatedTask.id, updatedTask)
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error) {
      await loadTasks()
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      setSelectedTask(null)
      setDetailSidebarOpen(false)

      await deleteTask(taskId)
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      await loadTasks()
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <TaskListSkeleton />
  }

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Card className="border-none shadow-lg bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-semibold">Task List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tasks</h2>
            <NewTaskButton onTaskCreated={handleTaskCreated} />
          </div>
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex h-32 items-center justify-center rounded-lg border border-dashed"
              >
                <p className="text-muted-foreground">No tasks found</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task: Task, index) => (
                  <motion.div
                    layout
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <TaskListItem
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      onClick={handleTaskClick}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSidebar
          open={detailSidebarOpen}
          onOpenChange={setDetailSidebarOpen}
          task={selectedTask}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </>
  )
})

export function TaskListSkeleton() {
  return (
    <Card className="border-none shadow-lg bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold">Task List</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden border border-gray-100">
              <div className="p-4 border-b bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
