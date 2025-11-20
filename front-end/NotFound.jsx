import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
export default function NotFound(){
return (
<div className="nf">
<h1>404</h1>
<p>Página não encontrada.</p>
<Link to="/">Voltar ao início</Link>
</div>
)
}