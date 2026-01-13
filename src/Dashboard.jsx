import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = ({ data, department, dashboardType, config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Cores para gráficos
  const COLORS = ['#FF6B35', '#004E89', '#F4B942', '#8338EC', '#06FFA5', '#FF9F1C', '#2D3748', '#63B3ED'];

  // Dados filtrados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item)
        .some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      let matchesFilter = true;
      if (filterType !== 'all') {
        // Filtro específico por departamento
        switch (department) {
          case 'ti':
            matchesFilter = item.tipo?.toLowerCase() === filterType.toLowerCase();
            break;
          case 'vendas':
            matchesFilter = item.regiao?.toLowerCase() === filterType.toLowerCase();
            break;
          default:
            matchesFilter = true;
        }
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterType, department]);

  // Renderizar dashboard específico baseado no departamento e tipo
  const renderDashboard = () => {
    switch (department) {
      case 'ti':
        return renderTIDashboard();
      case 'rh':
        return renderRHDashboard();
      case 'vendas':
        return renderVendasDashboard();
      case 'financeiro':
        return renderFinanceiroDashboard();
      case 'marketing':
        return renderMarketingDashboard();
      default:
        return <div>Dashboard não configurado para este departamento</div>;
    }
  };

  const renderTIDashboard = () => {
    const totalGasto = filteredData.reduce((acc, item) => acc + (item.valor || 0), 0);
    const totalFornecedores = new Set(filteredData.map(item => item.fornecedor)).size;
    const mediaGasto = totalGasto / (filteredData.length || 1);

    // Dados por fornecedor
    const fornecedoresData = filteredData.reduce((acc, item) => {
      const fornecedor = item.fornecedor || 'Não informado';
      if (!acc[fornecedor]) {
        acc[fornecedor] = { name: fornecedor, valor: 0, count: 0 };
      }
      acc[fornecedor].valor += item.valor || 0;
      acc[fornecedor].count += 1;
      return acc;
    }, {});

    const fornecedoresChart = Object.values(fornecedoresData)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);

    // Dados por tipo
    const tiposData = filteredData.reduce((acc, item) => {
      const tipo = item.tipo || 'Outros';
      if (!acc[tipo]) {
        acc[tipo] = { name: tipo, valor: 0 };
      }
      acc[tipo].valor += item.valor || 0;
      return acc;
    }, {});

    const tiposChart = Object.values(tiposData);

    // Timeline mensal
    const timelineData = filteredData.reduce((acc, item) => {
      const key = `${item.ano || 2024}-${String(item.mes || 1).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = { name: key, valor: 0 };
      }
      acc[key].valor += item.valor || 0;
      return acc;
    }, {});

    const timeline = Object.values(timelineData)
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Total Gasto</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalFornecedores}</span>
            <span className="stat-label">Fornecedores</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {mediaGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Gasto Médio</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{filteredData.length}</span>
            <span className="stat-label">Total de Itens</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-container">
            <h3 className="chart-title">💰 Top 10 Fornecedores por Valor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fornecedoresChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
                <Bar dataKey="valor" fill={config.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">📊 Gastos por Tipo de Serviço</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tiposChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {tiposChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">📈 Evolução Mensal de Gastos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
                <Line type="monotone" dataKey="valor" stroke={config.color} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  const renderRHDashboard = () => {
    const totalFuncionarios = filteredData.length;
    const totalFolha = filteredData.reduce((acc, item) => acc + (item.salario || 0), 0);
    const mediaSalarial = totalFolha / (totalFuncionarios || 1);

    // Dados por departamento
    const departamentosData = filteredData.reduce((acc, item) => {
      const dept = item.departamento || 'Não informado';
      if (!acc[dept]) {
        acc[dept] = { name: dept, funcionarios: 0, folha: 0 };
      }
      acc[dept].funcionarios += 1;
      acc[dept].folha += item.salario || 0;
      return acc;
    }, {});

    const departamentosChart = Object.values(departamentosData);

    return (
      <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">{totalFuncionarios}</span>
            <span className="stat-label">Funcionários</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {totalFolha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Folha Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {mediaSalarial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Salário Médio</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-container">
            <h3 className="chart-title">👥 Funcionários por Departamento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departamentosChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="funcionarios" fill={config.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">💰 Folha por Departamento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departamentosChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="folha"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                  {departamentosChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Folha']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  const renderVendasDashboard = () => {
    const totalVendas = filteredData.reduce((acc, item) => acc + (item.valor || 0), 0);
    const totalClientes = new Set(filteredData.map(item => item.cliente)).size;
    const ticketMedio = totalVendas / (filteredData.length || 1);

    // Top vendedores
    const vendedoresData = filteredData.reduce((acc, item) => {
      const vendedor = item.vendedor || 'Não informado';
      if (!acc[vendedor]) {
        acc[vendedor] = { name: vendedor, vendas: 0, quantidade: 0 };
      }
      acc[vendedor].vendas += item.valor || 0;
      acc[vendedor].quantidade += 1;
      return acc;
    }, {});

    const vendedoresChart = Object.values(vendedoresData)
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 10);

    return (
      <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Total Vendas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalClientes}</span>
            <span className="stat-label">Clientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Ticket Médio</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-container">
            <h3 className="chart-title">🏆 Top 10 Vendedores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendedoresChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']} />
                <Bar dataKey="vendas" fill={config.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  const renderFinanceiroDashboard = () => {
    const totalMovimentacao = filteredData.reduce((acc, item) => acc + Math.abs(item.valor || 0), 0);
    const receitas = filteredData.filter(item => (item.valor || 0) > 0).reduce((acc, item) => acc + item.valor, 0);
    const despesas = Math.abs(filteredData.filter(item => (item.valor || 0) < 0).reduce((acc, item) => acc + item.valor, 0));
    const saldo = receitas - despesas;

    return (
      <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Receitas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Despesas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value" style={{ color: saldo >= 0 ? 'green' : 'red' }}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="stat-label">Saldo</span>
          </div>
        </div>
      </>
    );
  };

  const renderMarketingDashboard = () => {
    const totalInvestimento = filteredData.reduce((acc, item) => acc + (item.investimento || 0), 0);
    const totalConversoes = filteredData.reduce((acc, item) => acc + (item.conversoes || 0), 0);
    const custoConversao = totalInvestimento / (totalConversoes || 1);

    return (
      <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">R$ {totalInvestimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Investimento</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalConversoes}</span>
            <span className="stat-label">Conversões</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">R$ {custoConversao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="stat-label">Custo/Conversão</span>
          </div>
        </div>
      </>
    );
  };

  // Obter opções de filtro baseado no departamento
  const getFilterOptions = () => {
    switch (department) {
      case 'ti':
        return [...new Set(data.map(item => item.tipo))].filter(Boolean);
      case 'vendas':
        return [...new Set(data.map(item => item.regiao))].filter(Boolean);
      default:
        return [];
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: config.color }}>
          📊 Dashboard - {config.name}
        </h1>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar nos dados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {filterOptions.length > 0 && (
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Todos os tipos</option>
            {filterOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
