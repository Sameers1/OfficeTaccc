"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Truck, FileText, CreditCard, FileEdit } from "lucide-react"
import { createTask, Task } from "@/lib/services/tasks"

const TaskType = {
  Shipment: "Shipment",
  Invoice: "Invoice",
  Payment: "Payment",
  Custom: "Custom",
} as const

type TaskTypeValue = typeof TaskType[keyof typeof TaskType]

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum([TaskType.Shipment, TaskType.Invoice, TaskType.Payment, TaskType.Custom]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Due date is required"),
  origin: z.string().optional(),
  destination: z.string().optional(),
  shipmentType: z.enum(["Air", "Sea", "Land"]).optional(),
  weight: z.string().optional(),
  amount: z.string().optional(),
  clientName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  paymentMethod: z.enum(["Credit Card", "Bank Transfer", "Cash"]).optional(),
  reference: z.string().optional(),
})

const shipmentSchema = baseSchema.extend({
  type: z.literal("Shipment"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  shipmentType: z.enum(["Air", "Sea", "Land"]),
  weight: z.string().min(1, "Weight is required"),
})

const invoiceSchema = baseSchema.extend({
  type: z.literal("Invoice"),
  amount: z.string().min(1, "Amount is required"),
  clientName: z.string().min(1, "Client name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
})

const paymentSchema = baseSchema.extend({
  type: z.literal("Payment"),
  amount: z.string().min(1, "Amount is required"),
  paymentMethod: z.enum(["Credit Card", "Bank Transfer", "Cash"]),
  reference: z.string().min(1, "Reference is required"),
})

const customSchema = baseSchema

type TaskFormValues = z.infer<typeof baseSchema>

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: (task: Task) => void
}

export function NewTaskDialog({ open, onOpenChange, onTaskCreated }: NewTaskDialogProps) {
  const { toast } = useToast()
  const [taskType, setTaskType] = useState<TaskTypeValue>(TaskType.Custom)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(customSchema),
    defaultValues: {
      title: "",
      description: "",
      type: TaskType.Custom,
      priority: "medium",
      dueDate: "",
      origin: "",
      destination: "",
      shipmentType: "Air",
      weight: "",
      amount: "",
      clientName: "",
      invoiceNumber: "",
      paymentMethod: "Credit Card",
      reference: "",
    },
  })

  // Update form schema when taskType changes
  useEffect(() => {
    const newSchema = 
      taskType === TaskType.Shipment ? shipmentSchema :
      taskType === TaskType.Invoice ? invoiceSchema :
      taskType === TaskType.Payment ? paymentSchema :
      customSchema

    form.reset({
      ...form.getValues(),
      type: taskType,
    }, {
      keepDefaultValues: true,
    })
  }, [taskType, form])

  const taskTypes = [
    {
      type: TaskType.Shipment,
      icon: Truck,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      type: TaskType.Invoice,
      icon: FileText,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      type: TaskType.Payment,
      icon: CreditCard,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      type: TaskType.Custom,
      icon: FileEdit,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ] as const

  async function onSubmit(data: TaskFormValues) {
    try {
      // Transform the data to match the database schema
      const taskData = {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: "pending" as const,
        due_date: data.dueDate,
        assigned_to: undefined,
        organization_id: '00000000-0000-0000-0000-000000000000', // Add default organization
        // Optional fields based on type
        origin: data.origin || undefined,
        destination: data.destination || undefined,
        shipment_type: data.shipmentType || undefined,
        weight: data.weight || undefined,
        amount: data.amount || undefined,
        client_name: data.clientName || undefined,
        invoice_number: data.invoiceNumber || undefined,
        payment_method: data.paymentMethod || undefined,
        reference: data.reference || undefined,
      }

      // Log the task data before sending
      console.log('Submitting task data:', {
        formData: data,
        transformedData: taskData
      })

      const createdTask = await createTask(taskData)
      console.log('Task created successfully:', createdTask)
      
      toast({
        title: "Success",
        description: "New task created successfully.",
      })
      
      // Call the onTaskCreated callback with the new task
      if (onTaskCreated) {
        onTaskCreated(createdTask)
      }
      
      form.reset({
        title: "",
        description: "",
        type: TaskType.Custom,
        priority: "medium",
        dueDate: "",
        origin: "",
        destination: "",
        shipmentType: "Air",
        weight: "",
        amount: "",
        clientName: "",
        invoiceNumber: "",
        paymentMethod: "Credit Card",
        reference: "",
      })
      setTaskType(TaskType.Custom)
      onOpenChange(false)
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    setTaskType(TaskType.Custom)
    form.reset({
      title: "",
      description: "",
      type: TaskType.Custom,
      priority: "medium",
      dueDate: "",
      origin: "",
      destination: "",
      shipmentType: "Air",
      weight: "",
      amount: "",
      clientName: "",
      invoiceNumber: "",
      paymentMethod: "Credit Card",
      reference: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{taskType ? `Create ${taskType} Task` : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {taskType
              ? `Fill in the details for the new ${taskType} task.`
              : "Select the type of task you want to create."}
          </DialogDescription>
        </DialogHeader>

        {!taskType ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            {taskTypes.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="flex h-28 w-full flex-col items-center justify-center gap-3 p-4 border-2 hover:border-blue-200 hover:bg-blue-50"
                  onClick={() => setTaskType(item.type)}
                >
                  <div className={`rounded-full ${item.color} p-3`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <span className="font-medium">{item.type}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof taskType) => {
                        field.onChange(value)
                        setTaskType(value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TaskType.Shipment}>Shipment</SelectItem>
                        <SelectItem value={TaskType.Invoice}>Invoice</SelectItem>
                        <SelectItem value={TaskType.Payment}>Payment</SelectItem>
                        <SelectItem value={TaskType.Custom}>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter task description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {taskType === TaskType.Shipment && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter origin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter destination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shipmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipment Type</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Air">Air</SelectItem>
                              <SelectItem value="Sea">Sea</SelectItem>
                              <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {taskType === TaskType.Invoice && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter invoice number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {taskType === TaskType.Payment && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter payment reference" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {!taskType && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
