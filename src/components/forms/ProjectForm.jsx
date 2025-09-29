"use client";
import { useState } from 'react';

export default function ProjectForm({ project, onSuccess }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [progress, setProgress] = useState(project?.progress || 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProj = { name, description, progress: parseInt(progress), managerId: 1 };
    try {
      if (project) {
        await fetch(`http://localhost:5000/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProj)
        });
      } else {
        await fetch('http://localhost:5000/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProj)
        });
      }
      onSuccess();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-lg">
        <h3 className="text-lg font-semibold mb-3">{project ? 'Editar Proyecto' : 'Crear Proyecto'}</h3>
        <input className="w-full p-2 border rounded mb-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" required />
        <textarea className="w-full p-2 border rounded mb-2" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" required />
        <input type="number" className="w-full p-2 border rounded mb-2" value={progress} onChange={e=>setProgress(e.target.value)} min="0" max="100" required />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">{project ? 'Guardar' : 'Crear'}</button>
      </form>
    </div>
  );
}
