"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomTaskForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Task Title</Label>
        <Input id="task-title" placeholder="Enter task title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Task Description</Label>
        <Textarea id="task-description" placeholder="Describe the task in detail" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input id="start-date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Input id="due-date" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="administrative">Administrative</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated-hours">Estimated Hours</Label>
        <Input id="estimated-hours" type="number" placeholder="0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assign To</Label>
        <Select>
          <SelectTrigger id="assignee">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="john">John Smith</SelectItem>
            <SelectItem value="sarah">Sarah Johnson</SelectItem>
            <SelectItem value="emily">Emily Davis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select defaultValue="medium">
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
