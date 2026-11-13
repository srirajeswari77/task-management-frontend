
import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Learn Spring Boot', completed: false },
    { id: 3, title: 'Learn Jenkins CI/CD', completed: true }
  ])

  const [newTask, setNewTask] = useState('')

  function addTask(e) {
    e.preventDefault()
    if (!newTask.trim()) return

    setTasks([
      ...tasks,
      { id: Date.now(), title: newTask, completed: false }
    ])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
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

      <div className="task-list">
        {tasks.map(task => (
          <div className="task" key={task.id}>
            <span
              className={task.completed ? 'completed' : ''}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? '✓' : '○'} {task.title}
            </span>
            <button
              className="delete"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <footer>Total Tasks: {tasks.length}</footer>
    </div>
  )
}

export default App
