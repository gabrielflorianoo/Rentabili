import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import { activesApi } from '../services/apis';
import { generateActive } from '../utils/fakeData';
import './Ativos.css';
import Sidebar from '../components/Sidebar';

export default function Ativos() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [actives, setActives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', type: '' });

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);
        loadActives();
    }, [navigate]);

    const loadActives = async () => {
        try {
            setLoading(true);
            const res = await activesApi.list();
            setActives(res.data || []);
        } catch (err) {
            console.error('Erro ao carregar ativos:', err);
            if (err?.response?.status === 401) {
                servicoAutenticacao.sair();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        servicoAutenticacao.sair();
        navigate('/');
    };

    const openModal = (item = null) => {
        if (item) {
            setEditing(item);
            setForm({ name: item.name, type: item.type });
        } else {
            setEditing(null);
            setForm({ name: '', type: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (editing) {
                await activesApi.update(editing.id, payload);
            } else {
                await activesApi.create(payload);
            }
            closeModal();
            loadActives();
        } catch (err) {
            console.error('Erro ao salvar ativo:', err);
            alert('Erro ao salvar ativo: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Excluir este ativo?')) return;
        try {
            await activesApi.remove(id);
            loadActives();
        } catch (err) {
            console.error('Erro ao excluir ativo:', err);
            alert('Erro ao excluir ativo: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="actives" />
            <div className="content">
                <header className="content-head">
                    <h2>Ativos</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                <div className="actions-bar">
                    <button className="btn-primary" onClick={() => openModal()}>+ Novo Ativo</button>
                </div>

                {loading ? (
                    <div className="loading">Carregando ativos...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actives.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                            Nenhum ativo cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    actives.map((a) => (
                                        <tr key={a.id}>
                                            <td>{a.id}</td>
                                            <td>{a.name}</td>
                                            <td>{a.type}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => openModal(a)}>✏️</button>
                                                <button className="btn-delete" onClick={() => handleDelete(a.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>{editing ? 'Editar Ativo' : 'Novo Ativo'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Tipo</label>
                                    <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setForm(generateActive())}
                                        style={{ marginRight: 8 }}
                                    >
                                        Auto-preencher
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                                    <button type="submit" className="btn-save">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
