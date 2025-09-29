"use client";
import { useEffect, useState } from 'react';

export default function TaskList({ user, projectId, setView, setEditItem }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/tasks?projectId=${projectId}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchTasks(); }, [projectId]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('¿Eliminar tarea?')) return;
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const filtered = tasks.filter(t => (user.role === 'gerente') || (t.assignedTo === user.id));

  return (
    <div>
      {filtered.length === 0 ? <p className="text-center text-gray-600">No hay tareas.</p> : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h4 className="font-medium">{t.title}</h4>
                <p className="text-sm text-gray-600">Estado: {t.status}</p>
              </div>
              <div>
                {user.role === 'usuario' && t.assignedTo === user.id ? (
                  <select value={t.status} onChange={(e)=>updateStatus(t.id, e.target.value)} className="border p-1 rounded">
                    <option>Por hacer</option>
                    <option>En progreso</option>
                    <option>Completada</option>
                  </select>
                ) : user.role === 'gerente' ? (
                  <div>
                    <button className="text-sm text-blue-600 mr-2" onClick={()=>{ setEditItem(t); setView('edit-task'); }}>Editar</button>
                    <button className="text-sm text-red-600" onClick={()=>deleteTask(t.id)}>Eliminar</button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
