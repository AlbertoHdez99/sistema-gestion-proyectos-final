"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const { login, setView } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        setError('Completa todos los campos.');
        return;
      }
      const existsRes = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}`);
      const exists = await existsRes.json();
      if (exists.length > 0) {
        setError('Ya existe un usuario con ese email.');
        return;
      }
      const createRes = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const newUser = await createRes.json();
      login(newUser);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la API.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Nombre</label>
          <input className="w-full p-2 border rounded mb-3" value={name} onChange={e=>setName(e.target.value)} required />
          <label className="block mb-2">Email</label>
          <input className="w-full p-2 border rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label className="block mb-2">Contraseña</label>
          <input type="password" className="w-full p-2 border rounded mb-3" value={password} onChange={e=>setPassword(e.target.value)} required />
          <label className="block mb-2">Rol</label>
          <select className="w-full p-2 border rounded mb-3" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="usuario">Usuario</option>
            <option value="gerente">Gerente</option>
          </select>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button className="w-full bg-green-600 text-white py-2 rounded">Crear cuenta</button>
        </form>
        <p className="mt-4 text-center">¿Ya tienes cuenta? <button className="text-blue-600 underline" onClick={()=>setView('login')}>Entrar</button></p>
      </div>
    </div>
  );
}
