import { supabase } from '@/lib/supabase'

export interface Task {
  id: string
  title: string
  description: string
  type: "Shipment" | "Invoice" | "Payment" | "Custom"
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  due_date: string
  assigned_to?: string
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

export async function getTasks() {
  console.log('Fetching tasks...')
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
  console.log('Tasks fetched:', data)
  return data
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  console.log('Creating task:', task)
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        error
      })
      throw error
    }

    if (!data) {
      console.error('No data returned from Supabase')
      throw new Error('No data returned from Supabase')
    }

    console.log('Task created:', data)
    return data
  } catch (error) {
    console.error('Error in createTask:', error)
    throw error
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  console.log('Updating task:', id, updates)
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    throw error
  }
  console.log('Task updated:', data)
  return data
}

export async function deleteTask(id: string) {
  console.log('Deleting task:', id)
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }
  console.log('Task deleted:', id)
  return true
} 