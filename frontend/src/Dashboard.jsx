import React, { useState, useEffect } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditUserModal from './EditUserModal';
import AddFaqModal from './AddFaqModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import NotificationModal from './NotificationModal';
import './Dashboard.css';

// Componente para a linha arrastável da tabela
const SortableFaqRow = ({ item, handleEditFaq, excluirPergunta }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f0f7ff' : 'transparent'
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>#{item.id}</td>
      <td>{item.pergunta}</td>
      <td>
        <span className={`badge ${item.privado ? 'badge-visitante' : 'badge-admin'}`}>
          {item.privado ? 'Privado' : 'Público'}
        </span>
      </td>
      <td>
        <div className="dashboard-actions-cell">
          <button 
            className="dashboard-drag-handle" 
            title="Arrastar para reordenar"
            {...attributes} 
            {...listeners}
          >
            <i className="fas fa-grip-vertical"></i>
          </button>
          <button className="dashboard-edit-btn" title="Editar" onClick={() => handleEditFaq(item)}>✏️</button>
          <button className="dashboard-delete-btn" title="Excluir" onClick={() => excluirPergunta(item.id)}>🗑️</button>
        </div>
      </td>
    </tr>
  );
};

const Dashboard = () => {
  // Estado para os dados do Dashboard
  const [perguntas, setPerguntas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({
    total_faqs: 0,
    total_users: 0,
    logins_month: 0,
    satisfaction: 0,
    chart_data: [0, 0, 0, 0, 0, 0, 0]
  });
  const [loading, setLoading] = useState(true);

  // Sensores para o Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimento para começar a arrastar
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Estados para os Modais
  const [editingUser, setEditingUser] = useState(null); 
  const [editingFaq, setEditingFaq] = useState(null); // Para editar FAQ
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Estados para o Modal de Confirmação de Exclusão
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'faq' ou 'user'
    id: null,
    title: '',
    message: ''
  });

  // Estados para o Modal de Notificação (Sucesso/Erro)
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  // Carregar dados do Backend
  const fetchData = async () => {
    try {
      setLoading(true);
      // Busca estatísticas
      const statsRes = await fetch('http://10.0.0.161:8000/api/stats/');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Busca lista de FAQs
      const faqsRes = await fetch('http://10.0.0.161:8000/api/faqs/');
      const faqsData = await faqsRes.json();
      setPerguntas(faqsData);

      // Busca lista de Usuários
      const usersRes = await fetch('http://10.0.0.161:8000/api/users/');
      const usersData = await usersRes.json();
      setUsuarios(usersData);
    } catch (error) {
      console.error("Erro ao carregar dados do Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log('Dashboard conectado ao backend com sucesso!');
  }, []);

  // Funções de Ação - Perguntas
  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setShowAddFaqModal(true);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = perguntas.findIndex((p) => p.id === active.id);
      const newIndex = perguntas.findIndex((p) => p.id === over.id);

      const newOrderedList = arrayMove(perguntas, oldIndex, newIndex);
      setPerguntas(newOrderedList);

      // Salvar a nova ordem no backend
      const faqsWithNewOrder = newOrderedList.map((faq, index) => ({
        id: faq.id,
        ordem: index
      }));

      try {
        const response = await fetch('http://10.0.0.161:8000/api/faqs/reorder/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ faqs: faqsWithNewOrder }),
        });
        
        if (!response.ok) {
          throw new Error('Erro ao salvar nova ordem');
        }
      } catch (error) {
        console.error("Erro ao salvar nova ordem:", error);
        alert("Erro ao salvar a nova ordem das perguntas.");
        fetchData(); // Reverte para a ordem do servidor em caso de erro
      }
    }
  };

  const handleSaveFaq = async (faqId, faqData) => {
    const url = faqId 
      ? `http://10.0.0.161:8000/api/faqs/update/${faqId}/`
      : 'http://10.0.0.161:8000/api/faqs/create/';

    try {
      // Usar FormData para enviar arquivos
      const formData = new FormData();
      formData.append('pergunta', faqData.pergunta);
      formData.append('descricao', faqData.descricao);
      formData.append('solucao', faqData.solucao);
      formData.append('privado', faqData.privado);
      
      if (faqData.midia) {
        formData.append('midia', faqData.midia);
      }

      const response = await fetch(url, {
        method: 'POST',
        // Não definimos o Content-Type ao enviar FormData, o navegador faz isso automaticamente com o boundary correto
        body: formData,
      });

      if (response.ok) {
        setNotification({
          isOpen: true,
          title: 'Sucesso!',
          message: faqId ? 'Pergunta atualizada com sucesso!' : 'Nova pergunta adicionada ao FAQ!',
          type: 'success'
        });
        setShowAddFaqModal(false);
        setEditingFaq(null);
        fetchData();
      } else {
        const error = await response.json();
        setNotification({
          isOpen: true,
          title: 'Erro',
          message: `Ocorreu um erro: ${error.error}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error);
      setNotification({
        isOpen: true,
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        type: 'error'
      });
    }
  };

  const excluirPergunta = (id) => {
    setDeleteModal({
      isOpen: true,
      type: 'faq',
      id: id,
      title: 'Excluir Pergunta',
      message: `Tem certeza que deseja excluir a pergunta #${id}? Esta ação não pode ser desfeita.`
    });
  };

  const excluirUsuario = (userId, username) => {
    setDeleteModal({
      isOpen: true,
      type: 'user',
      id: userId,
      title: 'Excluir Usuário',
      message: `Tem certeza que deseja excluir o usuário "${username}"? Esta ação não pode ser desfeita.`
    });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    const url = type === 'faq' 
      ? `http://10.0.0.161:8000/api/faqs/delete/${id}/`
      : `http://10.0.0.161:8000/api/users/delete/${id}/`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        if (type === 'faq') {
          setPerguntas(perguntas.filter(p => p.id !== id));
        } else {
          setUsuarios(usuarios.filter(u => u.id !== id));
        }
        fetchData();
        setDeleteModal({ ...deleteModal, isOpen: false });
      } else {
        alert(`Erro ao excluir o ${type === 'faq' ? 'pergunta' : 'usuário'}.`);
      }
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error);
    }
  };

  // Funções de Ação - Usuários
  const handleEditUser = (user) => {
    setIsCreatingUser(false);
    setEditingUser(user);
  };

  const handleAddUser = () => {
    setIsCreatingUser(true);
    setEditingUser(null); 
  };

  const handleSaveUser = async (userId, userData) => {
    const url = userId 
      ? `http://10.0.0.161:8000/api/users/update/${userId}/`
      : 'http://10.0.0.161:8000/api/users/create/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setNotification({
          isOpen: true,
          title: 'Sucesso!',
          message: userId ? 'Dados do usuário atualizados!' : 'Novo usuário cadastrado no sistema!',
          type: 'success'
        });
        setEditingUser(null);
        setIsCreatingUser(false);
        fetchData();
      } else {
        const error = await response.json();
        setNotification({
          isOpen: true,
          title: 'Erro',
          message: `Ocorreu um erro: ${error.error}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Erro na operação de usuário:", error);
      setNotification({
        isOpen: true,
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content-wrapper" style={{textAlign: 'center', paddingTop: '100px'}}>
          <h2 style={{color: '#0d4a83'}}>Carregando dados do Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content-wrapper">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <h1>📊 Dashboard - Centro de FAQ</h1>
            <p className="subtitle">Análise e Métricas do Sistema</p>
          </div>
          <div className="dashboard-user-info">
            <span>👤 Admin</span>
          </div>
        </header>

        {/* Cards de Métricas */}
        <section className="dashboard-metrics">
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-icon">📝</div>
            <div className="dashboard-metric-content">
              <h3>Perguntas Cadastradas</h3>
              <p className="dashboard-metric-value">{stats.total_faqs}</p>
            </div>
          </div>

          <div className="dashboard-metric-card">
            <div className="dashboard-metric-icon">👥</div>
            <div className="dashboard-metric-content">
              <h3>Usuários Registrados</h3>
              <p className="dashboard-metric-value">{stats.total_users}</p>
            </div>
          </div>
        </section>

        {/* Tabela de Perguntas */}
        <section className="dashboard-table-section">
          <div className="table-header-with-action">
            <h2>Últimas Perguntas Cadastradas</h2>
            <button className="add-button" onClick={() => { setEditingFaq(null); setShowAddFaqModal(true); }}>
              <span>+</span> Adicionar Pergunta
            </button>
          </div>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="dashboard-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pergunta</th>
                  <th>Visibilidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <SortableContext 
                items={perguntas.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {perguntas.map((item) => (
                    <SortableFaqRow 
                      key={item.id} 
                      item={item} 
                      handleEditFaq={handleEditFaq} 
                      excluirPergunta={excluirPergunta} 
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </section>

        {/* Tabela de Usuários */}
        <section className="dashboard-table-section">
          <div className="table-header-with-action">
            <h2>Gestão de Usuários</h2>
            <button className="add-button" onClick={handleAddUser}>
              <span>+</span> Adicionar Usuário
            </button>
          </div>
          <table className="dashboard-data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Data de Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.is_staff ? 'badge-admin' : 'badge-visitante'}`}>
                        {user.is_staff ? 'Administrador' : 'Visitante'}
                    </span>
                  </td>
                  <td>{user.date_joined}</td>
                  <td>
                    <button className="dashboard-edit-btn" onClick={() => handleEditUser(user)} title="Editar">✏️</button>
                    <button className="dashboard-delete-btn" title="Excluir" onClick={() => excluirUsuario(user.id, user.username)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>&copy; 2026 Dashboard FAQ - Todos os direitos reservados</p>
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </footer>
      </div>

      {/* Modais */}
      {(editingUser || isCreatingUser) && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => { setEditingUser(null); setIsCreatingUser(false); }} 
          onSave={handleSaveUser} 
        />
      )}

      {showAddFaqModal && (
        <AddFaqModal 
          faq={editingFaq}
          onClose={() => { setShowAddFaqModal(false); setEditingFaq(null); }} 
          onSave={handleSaveFaq} 
        />
      )}

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={deleteModal.title}
        message={deleteModal.message}
      />
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default Dashboard;
