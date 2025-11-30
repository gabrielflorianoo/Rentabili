import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const SidebarLayout = ({ aoSair }) => {
    return (
        <section className="app-container">
            <Sidebar aoSair={aoSair} />
            <Outlet />
        </section>
    );
}

export default SidebarLayout;