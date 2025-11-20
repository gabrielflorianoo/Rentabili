import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';


export default function App(){
return (
<Routes>
<Route path="/" element={<Login/>} />
<Route path="/login" element={<Login/>} />
<Route path="/signup" element={<Login/>} />
<Route path="/forgot" element={<ForgotPassword/>} />


<Rout