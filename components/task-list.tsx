"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Clock, AlertCircle, MoreHorizontal, Truck, FileText, CreditCard, FileEdit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"

// Task type icons
const taskTypeIcons = {
  Shipment: <Truck className="h-4 w-4" />,
  Invoice: <FileText className="h-4 w-4" />,
  Payment: <CreditCard className="h-4 w-4" />,
  Custom: <FileEdit className="h-4 w-4" />,
}

// Status icons
const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  "in-progress": <AlertCircle className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
}

// Status colors for badges
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
}

// Priority colors
const priorityColors = {
  low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  medium: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  high: "bg-red-100 text-red-800 hover:bg-red-100",
}

interface Task {
  id: string
  title: string
  type: string
  status: string
  priority: string
  due_date: string
  assigned_to: string
  details: string
}

export function TaskList({ filter = "all" }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        let query = supabase
          .from('tasks')
          .select('*')

        if (filter !== 'all') {
          query = query.eq('status', filter)
        }

        const { data, error } = await query

        if (error) throw error
        setTasks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [filter])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">No tasks found</p>
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  {statusIcons[task.status as keyof typeof statusIcons]}
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.details}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                    <DropdownMenuItem>Reassign</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {taskTypeIcons[task.type as keyof typeof taskTypeIcons]}
                    {task.type}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Due: <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" alt={task.assigned_to} />
                      <AvatarFallback>{task.assigned_to.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
