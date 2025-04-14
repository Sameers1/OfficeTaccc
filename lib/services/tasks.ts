import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

// Cache for tasks
let tasksCache: Task[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface Task {
  id: string
  title: string
  description: string
  type: "Shipment" | "Invoice" | "Payment" | "Custom"
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  due_date: string
  assigned_to?: string
  organization_id: string
  created_at?: string
  updated_at?: string
  // Additional fields based on type
  origin?: string
  destination?: string
  shipment_type?: "Air" | "Sea" | "Land"
  weight?: string
  amount?: string
  client_name?: string
  invoice_number?: string
  payment_method?: "Credit Card" | "Bank Transfer" | "Cash"
  reference?: string
}

// Helper function to handle Supabase errors
function handleSupabaseError(error: PostgrestError, operation: string) {
  console.error(`Error ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  })
  throw new Error(`Failed to ${operation}: ${error.message}`)
}

// Helper function to transform task data
function transformTaskData(data: any): Task {
  return {
    ...data,
    ...data.task_details?.[0],
    task_details: undefined
  }
}

export async function getTasks(forceRefresh = false): Promise<Task[]> {
  const now = Date.now()
  
  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh && tasksCache && (now - lastFetchTime) < CACHE_DURATION) {
    return tasksCache
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_details (
          shipment_type,
          origin,
          destination,
          weight,
          amount,
          client_name,
          invoice_number,
          payment_method,
          reference
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      handleSupabaseError(error, 'fetching tasks')
    }

    if (!data) {
      throw new Error('No data returned from Supabase when fetching tasks')
    }

    const transformedData = data.map(transformTaskData)
    
    // Update cache
    tasksCache = transformedData
    lastFetchTime = now

    return transformedData
  } catch (error) {
    // If there's an error but we have cached data, return that
    if (tasksCache) {
      console.warn('Using cached data due to error:', error)
      return tasksCache
    }
    throw error
  }
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  try {
    // Optimistic update: Add a temporary ID for the new task
    const tempId = `temp-${Date.now()}`
    const optimisticTask: Task = {
      ...task,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // First, create the main task
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .insert([{
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        status: task.status,
        due_date: new Date(task.due_date).toISOString(),
        assigned_to: task.assigned_to,
        organization_id: task.organization_id,
      }])
      .select()
      .single()

    if (taskError) {
      handleSupabaseError(taskError, 'creating task')
    }

    if (!taskData) {
      throw new Error('No data returned from Supabase when creating task')
    }

    // Then, create the task details if needed
    const detailsData = {
      task_id: taskData.id,
      shipment_type: task.shipment_type,
      origin: task.origin,
      destination: task.destination,
      weight: task.weight,
      amount: task.amount,
      client_name: task.client_name,
      invoice_number: task.invoice_number,
      payment_method: task.payment_method,
      reference: task.reference,
    }

    // Only insert task details if there are any non-null values
    if (Object.values(detailsData).some(value => value !== undefined)) {
      const { error: detailsError } = await supabase
        .from('task_details')
        .insert([detailsData])

      if (detailsError) {
        handleSupabaseError(detailsError, 'creating task details')
      }
    }

    // Invalidate cache
    tasksCache = null

    // Return the created task with its details
    const { data: fullTaskData, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_details (
          shipment_type,
          origin,
          destination,
          weight,
          amount,
          client_name,
          invoice_number,
          payment_method,
          reference
        )
      `)
      .eq('id', taskData.id)
      .single()

    if (fetchError) {
      handleSupabaseError(fetchError, 'fetching created task')
    }

    return transformTaskData(fullTaskData)
  } catch (error) {
    console.error('Error in createTask:', error)
    throw error
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  try {
    // Optimistic update: Update the task in cache if it exists
    if (tasksCache) {
      tasksCache = tasksCache.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, 'updating task')
    }

    // Invalidate cache
    tasksCache = null

    return data
  } catch (error) {
    // Revert optimistic update on error
    if (tasksCache) {
      tasksCache = null
      await getTasks(true)
    }
    throw error
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    // Optimistic update: Remove the task from cache if it exists
    if (tasksCache) {
      tasksCache = tasksCache.filter(task => task.id !== id)
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      handleSupabaseError(error, 'deleting task')
    }

    // Invalidate cache
    tasksCache = null

    return true
  } catch (error) {
    // Revert optimistic update on error
    if (tasksCache) {
      tasksCache = null
      await getTasks(true)
    }
    throw error
  }
} 