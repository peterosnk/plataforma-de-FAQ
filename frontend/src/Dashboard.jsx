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
  const editarPergunta = (id) => {
    alert(`Editar pergunta #${id}\n\nFuncionalidade em desenvolvimento para conectar com o endpoint de edição.`);
  };

  const excluirPergunta = async (id) => {
    if (window.confirm(`Tem certeza que deseja excluir a pergunta #${id}?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        const res = await fetch(`http://localhost:8000/delete/${id}/`, {
          method: 'POST', // O seu backend usa POST no faq_delete atual
          // Nota: Como estamos em desenvolvimento, o CSRF pode ser um problema aqui
          // Idealmente, usaríamos uma API RESTful completa com DELETE
        });
        
        // Atualiza a lista local após exclusão
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
          <h2 style={{color: 'white'}}>Carregando dados do Dashboard...</h2>
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

        {/* Tabela de Dados */}
        <section className="dashboard-table-section">
          <h2>Últimas Perguntas Cadastradas</h2>
          <table className="dashboard-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pergunta</th>
                <th>Data</th>
                <th>Visualizações</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {perguntas.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.pergunta}</td>
                  <td>-</td> {/* Data não existe no modelo atual */}
                  <td>-</td> {/* Visualizações não existe no modelo atual */}
                  <td>
                    <button 
                      className="dashboard-edit-btn" 
                      onClick={() => editarPergunta(item.id)} 
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
