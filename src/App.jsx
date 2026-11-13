
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load tasks from Spring Boot backend
  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Failed to load tasks')
      }

      const data = await response.json()
      setTasks(data)
      setError('')
    } catch (err) {
      setError('Unable to connect to backend. Please check the server.')
    } finally {
      setLoading(false)
    }
  }

  // Add a new task
  async function addTask(e) {
    e.preventDefault()

    if (!newTask.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.trim(),
          completed: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const addedTask = await response.json()
      setTasks([...tasks, addedTask])
      setNewTask('')
      setError('')
    } catch (err) {
      setError('Unable to add task. Please try again.')
    }
  }

  // Mark task as completed or incomplete
  async function toggleTask(id) {
    const task = tasks.find(item => item.id === id)

    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()

      setTasks(tasks.map(item =>
        item.id === id ? updatedTask : item
      ))
      setError('')
    } catch (err) {
      setError('Unable to update task. Please try again.')
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(tasks.filter(task => task.id !== id))
      setError('')
    } catch (err) {
      setError('Unable to delete task. Please try again.')
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Task Management</h1>
        <p>Manage your daily tasks efficiently</p>
      </header>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="task-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available. Add your first task!</p>
        ) : (
          tasks.map(task => (
            <div className="task" key={task.id}>
              <span
                className={task.completed ? 'completed' : ''}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? '✓' : '○'} {task.title}
              </span>

              <button
                type="button"
                className="delete"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <footer>Total Tasks: {tasks.length}</footer>
    </div>
  )
}

export default App
