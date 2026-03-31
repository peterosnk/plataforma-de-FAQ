import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import EditUserModal from './EditUserModal';
import AddFaqModal from './AddFaqModal';
import './Dashboard.css';

// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  
  // Estados para os Modais
  const [editingUser, setEditingUser] = useState(null); 
  const [editingFaq, setEditingFaq] = useState(null); // Para editar FAQ
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Carregar dados do Backend
  const fetchData = async () => {
    try {
      setLoading(true);
      // Busca estatísticas
      const statsRes = await fetch('http://localhost:8000/api/stats/');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Busca lista de FAQs
      const faqsRes = await fetch('http://localhost:8000/api/faqs/');
      const faqsData = await faqsRes.json();
      setPerguntas(faqsData);

      // Busca lista de Usuários
      const usersRes = await fetch('http://localhost:8000/api/users/');
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

  // Configuração do Gráfico (Dinâmica)
  const chartData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Usuários Cadastrados',
        data: stats.chart_data,
        borderColor: '#0d4a83',
        backgroundColor: 'rgba(13, 74, 131, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#0d4a83',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 14,
          },
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  // Funções de Ação - Perguntas
  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setShowAddFaqModal(true);
  };

  const handleSaveFaq = async (faqId, faqData) => {
    const url = faqId 
      ? `http://localhost:8000/api/faqs/update/${faqId}/`
      : 'http://localhost:8000/api/faqs/create/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData),
      });

      if (response.ok) {
        alert(faqId ? 'Pergunta atualizada!' : 'Pergunta adicionada!');
        setShowAddFaqModal(false);
        setEditingFaq(null);
        fetchData();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error);
    }
  };

  const excluirPergunta = async (id) => {
    if (window.confirm(`Tem certeza que deseja excluir a pergunta #${id}?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/faqs/delete/${id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPerguntas(perguntas.filter(p => p.id !== id));
          alert(`Pergunta #${id} excluída com sucesso!`);
          fetchData(); // Atualiza contador
        } else {
          alert("Erro ao excluir a pergunta.");
        }
      } catch (error) {
        console.error("Erro ao excluir pergunta:", error);
      }
    }
  };

  const excluirUsuario = async (userId, username) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${username}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/delete/${userId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsuarios(usuarios.filter(u => u.id !== userId));
          alert(`Usuário "${username}" excluído com sucesso!`);
          fetchData(); // Atualiza contador
        } else {
          alert("Erro ao excluir o usuário.");
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
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
      ? `http://localhost:8000/api/users/update/${userId}/`
      : 'http://localhost:8000/api/users/create/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert(userId ? 'Usuário atualizado!' : 'Novo usuário criado!');
        setEditingUser(null);
        setIsCreatingUser(false);
        fetchData();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro na operação de usuário:", error);
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

        {/* Gráfico */}
        <section className="dashboard-charts-section">
          <div className="dashboard-chart-container">
            <h2>Usuários Cadastrados - Últimos 7 Dias</h2>
            <div className="dashboard-chart-canvas">
              <Line data={chartData} options={chartOptions} />
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
          <table className="dashboard-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pergunta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {perguntas.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.pergunta}</td>
                  <td>
                    <button className="dashboard-edit-btn" title="Editar" onClick={() => handleEditFaq(item)}>✏️</button>
                    <button className="dashboard-delete-btn" title="Excluir" onClick={() => excluirPergunta(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default Dashboard;
