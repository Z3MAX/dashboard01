import React from 'react';

const DashboardSelector = ({ departments, onSelect }) => {
  const departmentList = [
    { 
      key: 'ti', 
      icon: '💻', 
      description: 'Gestão de despesas, fornecedores e ativos de TI' 
    },
    { 
      key: 'rh', 
      icon: '👥', 
      description: 'Análise de folha de pagamento, turnover e benefícios' 
    },
    { 
      key: 'vendas', 
      icon: '📈', 
      description: 'Performance de vendas, clientes e produtos' 
    },
    { 
      key: 'financeiro', 
      icon: '💰', 
      description: 'Fluxo de caixa, receitas e controle de despesas' 
    },
    { 
      key: 'marketing', 
      icon: '🎯', 
      description: 'Campanhas, ROI e análise de canais' 
    }
  ];

  return (
    <div className="department-selection">
      <h2>Escolha seu Departamento</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Selecione o departamento para começar a análise de dados
      </p>
      
      <div className="department-grid">
        {departmentList.map(dept => {
          const config = departments[dept.key];
          return (
            <div
              key={dept.key}
              className="department-card"
              onClick={() => onSelect(dept.key)}
              style={{ 
                '--department-color': config.color,
                cursor: 'pointer'
              }}
            >
              <div className="department-icon">{dept.icon}</div>
              <h3 style={{ color: config.color }}>{config.name}</h3>
              <p>{dept.description}</p>
            </div>
          );
        })}
      </div>
      
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>🚀 Como funciona?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>1. Selecione</strong><br />
            Escolha seu departamento
          </div>
          <div>
            <strong>2. Dashboard</strong><br />
            Escolha o tipo de análise
          </div>
          <div>
            <strong>3. Upload</strong><br />
            Envie sua planilha Excel
          </div>
          <div>
            <strong>4. Analise</strong><br />
            Veja os insights gerados
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelector;
