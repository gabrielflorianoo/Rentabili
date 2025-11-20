import React from 'react';
import { Navigate } from 'react-router-dom';


export default function ProtectedRoute({ children }) {
const user = localStorage.getItem('rentabil_user');
if (!user) return <Navigate to="/" replace />;
return children;
}