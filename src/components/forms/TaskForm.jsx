"use client";
import { useState, useEffect } from 'react';

export default function TaskForm({ task, projectId, onSuccess }) {
  const [title, setTitle] = useState(task?.title || '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || 2);
  const [status, setStatus] = useState(task?.status || 'Por hacer');
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const fetchUsers = async ()=>{
      const res = await fetch('http://localhost:5000/users');
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, assignedTo: parseInt(assignedTo), status, projectId: task?.projectId || projectId };
    try {
      if (task) {
        await fetch(`http://localhost:5000/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        });
      } else {
        await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        });
      }
      onSuccess();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-lg">
        <h3 className="text-lg font-semibold mb-3">{task ? 'Editar Tarea' : 'Crear Tarea'}</h3>
        <input className="w-full p-2 border rounded mb-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" required />
        <select className="w-full p-2 border rounded mb-2" value={assignedTo} onChange={e=>setAssignedTo(e.target.value)}>
          {users.map(u=> <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
        </select>
        <select className="w-full p-2 border rounded mb-2" value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Por hacer</option>
          <option>En progreso</option>
          <option>Completada</option>
        </select>
        <button className="bg-blue-600 text-white py-2 px-4 rounded">{task ? 'Guardar' : 'Crear'}</button>
      </form>
    </div>
  );
}
