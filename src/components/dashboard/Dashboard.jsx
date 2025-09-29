"use client";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TaskList from './TaskList';
import ProjectForm from '../forms/ProjectForm';
import TaskForm from '../forms/TaskForm';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState('list');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ fetchProjects(); }, []);

  const handleViewTasks = (project) => {
    setSelectedProject(project);
    setView('tasks');
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('¿Eliminar proyecto y sus tareas?')) return;
    try {
      await fetch(`http://localhost:5000/projects/${id}`, { method: 'DELETE' });
      const tasksRes = await fetch(`http://localhost:5000/tasks?projectId=${id}`);
      const tasks = await tasksRes.json();
      for (const t of tasks) {
        await fetch(`http://localhost:5000/tasks/${t.id}`, { method: 'DELETE' });
      }
      fetchProjects();
      setView('list');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div>
            <span className="mr-4">{user.name} ({user.role})</span>
            <button className="bg-red-600 text-white py-1 px-3 rounded" onClick={logout}>Cerrar Sesión</button>
          </div>
        </div>
        {view === 'list' && (
          <div>
            <div className="grid md:grid-cols-3 gap-4">
              {projects.map(p=> (
                <div key={p.id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-blue-600" style={{width: p.progress + '%'}}></div>
                    </div>
                    <span className="ml-2 text-sm">{p.progress}%</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <button className="text-blue-600 underline" onClick={()=>handleViewTasks(p)}>Ver tareas</button>
                    {user.role === 'gerente' && (
                      <div>
                        <button className="text-sm text-blue-600 mr-3" onClick={()=>{ setEditItem(p); setView('edit-project'); }}>Editar</button>
                        <button className="text-sm text-red-600" onClick={()=>handleDeleteProject(p.id)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {user.role === 'gerente' && <div className="mt-6 text-right"><button className="bg-green-600 text-white py-2 px-4 rounded" onClick={()=>setView('create-project')}>Crear Nuevo Proyecto</button></div>}
          </div>
        )}
        {view === 'tasks' && selectedProject && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">Tareas de {selectedProject.name}</h2>
              <div>
                <button className="bg-gray-200 py-1 px-3 rounded mr-2" onClick={()=>setView('list')}>Volver</button>
                {user.role === 'gerente' && <button className="bg-green-600 text-white py-1 px-3 rounded" onClick={()=>{ setView('create-task'); }}>Crear Tarea</button>}
              </div>
            </div>
            <TaskList user={user} projectId={selectedProject.id} setView={setView} setEditItem={setEditItem} />
          </div>
        )}
        {view === 'create-project' && <ProjectForm onSuccess={()=>{ setView('list'); fetchProjects(); }} />}
        {view === 'edit-project' && <ProjectForm project={editItem} onSuccess={()=>{ setView('list'); fetchProjects(); }} />}
        {view === 'create-task' && <TaskForm projectId={selectedProject?.id} onSuccess={()=>{ setView('tasks'); }} />}
        {view === 'edit-task' && <TaskForm task={editItem} onSuccess={()=>{ setView('tasks'); fetchProjects(); }} />}
      </div>
    </div>
  );
}
