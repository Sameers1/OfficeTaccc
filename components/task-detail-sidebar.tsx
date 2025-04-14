"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  FileText,
  CreditCard,
  FileEdit,
  Calendar,
  CheckCheck,
  X,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Task } from "@/lib/services/tasks"

interface TaskDetailSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onTaskUpdate: (task: Task) => Promise<void>
  onTaskDelete: (id: string) => Promise<void>
}

// Task type icons
const taskTypeIcons = {
  Shipment: <Truck className="h-5 w-5" />,
  Invoice: <FileText className="h-5 w-5" />,
  Payment: <CreditCard className="h-5 w-5" />,
  Custom: <FileEdit className="h-5 w-5" />,
} as const

// Status icons
const statusIcons = {
  pending: <Clock className="h-5 w-5 text-amber-500" />,
  "in-progress": <AlertCircle className="h-5 w-5 text-purple-500" />,
  completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
} as const

// Status colors for badges
const statusColors = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
} as const

// Priority colors
const priorityColors = {
  high: "bg-red-100 text-red-800 hover:bg-red-100",
  medium: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
} as const

// Team members for reassignment
const teamMembers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Emily Davis" },
  { id: 4, name: "Michael Brown" },
]

// Mock comments
const mockComments = [
  {
    id: 1,
    user: "John Smith",
    date: "2023-04-12T10:30:00",
    content: "I've started working on this task. Will update once the first part is complete.",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    date: "2023-04-13T14:15:00",
    content: "The client has requested additional information. I've sent them an email to clarify.",
  },
  {
    id: 3,
    user: "Emily Davis",
    date: "2023-04-14T09:45:00",
    content: "All documents have been received. Proceeding with the next steps.",
  },
]

export function TaskDetailSidebar({ open, onOpenChange, task, onTaskUpdate, onTaskDelete }: TaskDetailSidebarProps) {
  const [activeTab, setActiveTab] = useState<string>("details")
  const [changeStatusOpen, setChangeStatusOpen] = useState(false)
  const [reassignTaskOpen, setReassignTaskOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newAssignee, setNewAssignee] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setNewStatus(task.status)
      setNewAssignee(task.assigned_to ?? "")
    }
  }, [task])

  if (!task) return null

  const handleChangeStatus = () => {
    setChangeStatusOpen(true)
  }

  const handleReassignTask = () => {
    setReassignTaskOpen(true)
  }

  const handleDeleteTask = () => {
    setDeleteConfirmOpen(true)
  }

  const handleStatusChange = (newStatus: Task['status']) => {
    onTaskUpdate({
      ...task,
      status: newStatus
    })
    setChangeStatusOpen(false)
    toast({
      title: "Status updated",
      description: `Task status changed to ${newStatus}`,
    })
  }

  const confirmReassignTask = () => {
    const updatedTask = { ...task, assigned_to: newAssignee }
    onTaskUpdate(updatedTask)
    setReassignTaskOpen(false)
    toast({
      title: "Task reassigned",
      description: `Task reassigned to ${newAssignee}`,
    })
  }

  const confirmDeleteTask = () => {
    onTaskDelete(task.id)
    setDeleteConfirmOpen(false)
    onOpenChange(false)
    toast({
      title: "Task deleted",
      description: "The task has been permanently deleted",
    })
  }

  // Calculate task progress based on status
  const getTaskProgress = () => {
    switch (task.status) {
      case "pending":
        return 10
      case "in-progress":
        return 50
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[450px] sm:w-[540px] p-0 overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b">
            <SheetHeader className="p-6 pb-2 text-left">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {statusIcons[task.status]}
                  <SheetTitle className="text-xl">{task.title}</SheetTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SheetDescription className="mt-1">{task.description}</SheetDescription>
            </SheetHeader>

            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  {taskTypeIcons[task.type]}
                  <span>{task.type}</span>
                </Badge>
                <Badge variant="outline" className={`${priorityColors[task.priority]} px-3 py-1`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
                <Badge variant="outline" className={`${statusColors[task.status]} px-3 py-1`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{getTaskProgress()}%</span>
                </div>
                <Progress
                  value={getTaskProgress()}
                  className="h-2"
                  indicatorColor={
                    task.status === "completed"
                      ? "bg-green-500"
                      : task.status === "in-progress"
                        ? "bg-purple-500"
                        : "bg-amber-500"
                  }
                />
              </div>

              <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="p-6 pt-2">
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Assigned To</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt={task.assigned_to || 'Unassigned'} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {task.assigned_to 
                            ? task.assigned_to
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                            : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assigned_to || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Due Date</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {task.due_date && (
                        <div className="text-sm">
                          {format(new Date(task.due_date), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Created</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Additional Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Reference Number</p>
                      <p className="text-sm">{task.title.split("#")[1] || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm">Administration</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Attachments</p>
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <p className="text-sm text-gray-500">No attachments</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCheck className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">John Smith created this task</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task assigned</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">Task assigned to {task.assigned_to}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">Status changed to In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={comment.user} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {comment.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{comment.user}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleString()}</p>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Add Comment</p>
                  <textarea
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    placeholder="Type your comment here..."
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <SheetFooter className="sticky bottom-0 bg-white border-t p-4 flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleChangeStatus}>
                <CheckCheck className="mr-1 h-4 w-4" />
                Change Status
              </Button>
              <Button variant="outline" size="sm" onClick={handleReassignTask}>
                <UserPlus className="mr-1 h-4 w-4" />
                Reassign
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteTask}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Change Status Dialog */}
      <Dialog open={changeStatusOpen} onOpenChange={setChangeStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Task Status</DialogTitle>
            <DialogDescription>Update the status of "{task.title}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleStatusChange(newStatus as Task['status'])}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Task Dialog */}
      <Dialog open={reassignTaskOpen} onOpenChange={setReassignTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reassign Task</DialogTitle>
            <DialogDescription>Assign "{task.title}" to another team member</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReassignTask}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
