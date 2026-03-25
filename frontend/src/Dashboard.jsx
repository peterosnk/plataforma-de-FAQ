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

  // Funções de Ação
  const editarItem = (id, tipo) => {
    alert(`Editar ${tipo} #${id}\n\nFuncionalidade em desenvolvimento.`);
  };

  const excluirPergunta = async (id) => {
    if (window.confirm(`Tem certeza que deseja excluir a pergunta #${id}?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await fetch(`http://localhost:8000/delete/${id}/`, {
          method: 'POST',
        });
        setPerguntas(perguntas.filter(p => p.id !== id));
        alert(`Pergunta #${id} excluída com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir pergunta:", error);
      }
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
          <h2>Últimas Perguntas Cadastradas</h2>
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
                    <button 
                      className="dashboard-edit-btn" 
                      onClick={() => editarItem(item.id, 'pergunta')} 
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="dashboard-delete-btn" 
                      onClick={() => excluirPergunta(item.id)} 
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Tabela de Usuários */}
        <section className="dashboard-table-section">
          <h2>Gestão de Usuários</h2>
          <table className="dashboard-data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Data de Cadastro</th>
                <th>Última Vez Online</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.date_joined}</td>
                  <td>{user.last_login}</td>
                  <td>
                    <button 
                      className="dashboard-edit-btn" 
                      onClick={() => editarItem(user.username, 'usuário')} 
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="dashboard-delete-btn" 
                      title="Excluir"
                      onClick={() => alert('Funcionalidade de excluir usuário em desenvolvimento.')}
                    >
                      🗑️
                    </button>
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
    </div>
  );
};

export default Dashboard;
