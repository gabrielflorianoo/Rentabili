import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';


export default function LoginForm({ mode = 'login' }) {
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [username, setUsername] = useState('');


function handleLogin(e) {
e.preventDefault();
// fake auth: store a token
localStorage.setItem('rentabil_user', JSON.stringify({ email, username: username || 'Usuário' }));
navigate('/dashboard');
}


return (
<form className="login-form" onSubmit={handleLogin}>
{mode === 'signup' && (
<>
<label className="sr-only">Nome de usuário</label>
<input
placeholder="Nome de usuario"
value={username}
onChange={(e) => setUsername(e.target.value)}
className="input"
/>
</>
)}


<label className="sr-only">Email</label>
<input
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="input"
/>


<label className="sr-only">Senha</label>
<input
placeholder="Senha"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="input"
/>


<button type="submit" className="btn-primary">
{mode === 'login' ? 'Entrar' : 'Criar'}
</button>
</form>
);
}