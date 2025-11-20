import React from 'react';
import './ForgotPassword.css';
export default function ForgotPassword(){
return (
<div className="forgot-wrap">
<div className="forgot-card">
<h2>Esqueci minha senha</h2>
<p>Insira seu email e enviaremos instruções.</p>
<input placeholder="Email" className="input" />
<button className="btn-primary">Enviar</button>
</div>
</div>
)
}