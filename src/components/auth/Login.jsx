"use client";
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const { login, setView } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await res.json();
      if (users.length > 0) {
        login(users[0]);
      } else {
        setError('Email o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con la API.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Email</label>
          <input className="w-full p-2 border rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label className="block mb-2">Contraseña</label>
          <input type="password" className="w-full p-2 border rounded mb-3" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
        </form>
        <p className="mt-4 text-center">¿No tienes cuenta? <button className="text-blue-600 underline" onClick={()=>setView('register')}>Registrar</button></p>
      </div>
    </div>
  );
}
