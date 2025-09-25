import './App.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

type Todo = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

async function fetchTodos(): Promise<Todo[]> {
  const res = await axios.get(`${API_BASE}/todos`)
  // backend returns { status, message, data: { todos: [] } }
  return res.data?.data?.todos ?? []
}

function useTodos() {
  const queryClient = useQueryClient()
  const todosQuery = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; description?: string }) => {
      const res = await axios.post(`${API_BASE}/todos`, payload)
      return res.data?.data as Todo
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await axios.put(`${API_BASE}/todos/${todo.id}`, {
        completed: !todo.completed,
      })
      return res.data?.data as Todo
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE}/todos/${id}`)
      return id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return { todosQuery, createMutation, toggleMutation, deleteMutation }
}

export default function App() {
  const { todosQuery, createMutation, toggleMutation, deleteMutation } = useTodos()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({ title, description: description || undefined })
    setTitle('')
    setDescription('')
  }

  return (
    <div className="app">
      <h1>Todos</h1>

      <form onSubmit={onAdd} className="todo-form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button disabled={createMutation.isPending}>Add</button>
      </form>

      {todosQuery.isLoading ? (
        <p>Loading...</p>
      ) : todosQuery.isError ? (
        <p>Error loading todos</p>
      ) : (
        <ul className="todo-list">
          {todosQuery.data?.map((t) => (
            <li key={t.id} className={t.completed ? 'done' : ''}>
              <div className="todo-main">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleMutation.mutate(t)}
                />
                <div className="todo-text">
                  <div className="title">{t.title}</div>
                  {t.description && <div className="desc">{t.description}</div>}
                </div>
              </div>
              <button className="delete" onClick={() => deleteMutation.mutate(t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
