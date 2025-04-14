import { TaskForm } from '@/components/TaskForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        <TaskForm />
      </div>
    </div>
  )
}

export default App 