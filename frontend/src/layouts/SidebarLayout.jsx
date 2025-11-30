import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const SidebarLayout = ({ aoSair }) => {
    return (
        // Container principal que engloba a sidebar e o conteúdo principal
        <section className="app-container">
            {/* Sidebar lateral, recebe a função de logout */}
            <Sidebar aoSair={aoSair} />
            
            {/* Outlet é o local onde as rotas filhas serão renderizadas */}
            <Outlet />
        </section>
    );
}

export default SidebarLayout;
