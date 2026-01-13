import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import DashboardSelector from './components/DashboardSelector';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import './App.css';

// Configurações dos departamentos e tipos de dashboard
const DEPARTMENT_CONFIGS = {
  ti: {
    name: 'Tecnologia da Informação',
    color: '#FF6B35',
    expectedColumns: ['Tipo', 'A2_NREDUZ', 'valor', 'Mês', 'Ano'],
    dashboards: [
      { id: 'despesas', name: 'Análise de Despesas', icon: '💰' },
      { id: 'fornecedores', name: 'Gestão de Fornecedores', icon: '🏢' },
      { id: 'timeline', name: 'Timeline de Gastos', icon: '📈' }
    ]
  },
  rh: {
    name: 'Recursos Humanos',
    color: '#8338EC',
    expectedColumns: ['Funcionario', 'Cargo', 'Salario', 'Departamento', 'Data_Admissao'],
    dashboards: [
      { id: 'folha', name: 'Análise de Folha de Pagamento', icon: '👥' },
      { id: 'turnover', name: 'Turnover e Retenção', icon: '🔄' },
      { id: 'beneficios', name: 'Benefícios e Custos', icon: '🎯' }
    ]
  },
  vendas: {
    name: 'Vendas',
    color: '#06FFA5',
    expectedColumns: ['Cliente', 'Produto', 'Valor', 'Vendedor', 'Data', 'Regiao'],
    dashboards: [
      { id: 'performance', name: 'Performance de Vendas', icon: '📊' },
      { id: 'clientes', name: 'Análise de Clientes', icon: '👤' },
      { id: 'produtos', name: 'Produtos Mais Vendidos', icon: '📦' }
    ]
  },
  financeiro: {
    name: 'Financeiro',
    color: '#004E89',
    expectedColumns: ['Categoria', 'Subcategoria', 'Valor', 'Data', 'Tipo', 'Status'],
    dashboards: [
      { id: 'fluxo', name: 'Fluxo de Caixa', icon: '💸' },
      { id: 'receitas', name: 'Análise de Receitas', icon: '📈' },
      { id: 'despesas', name: 'Controle de Despesas', icon: '📉' }
    ]
  },
  marketing: {
    name: 'Marketing',
    color: '#F4B942',
    expectedColumns: ['Campanha', 'Canal', 'Investimento', 'Impressoes', 'Cliques', 'Conversoes'],
    dashboards: [
      { id: 'campanhas', name: 'Performance de Campanhas', icon: '🎯' },
      { id: 'roi', name: 'ROI Marketing', icon: '💰' },
      { id: 'canais', name: 'Análise de Canais', icon: '📱' }
    ]
  }
};

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new Error('Planilha está vazia');
      }

      // Validar colunas esperadas
      const config = DEPARTMENT_CONFIGS[selectedDepartment];
      const columns = Object.keys(jsonData[0]);
      const missingColumns = config.expectedColumns.filter(col => 
        !columns.some(c => c.toLowerCase().includes(col.toLowerCase()))
      );
      
      if (missingColumns.length > 0) {
        console.warn(`Colunas recomendadas não encontradas: ${missingColumns.join(', ')}`);
      }

      // Processar dados baseado no departamento
      const processedData = processDataByDepartment(jsonData, selectedDepartment);
      setData(processedData);
      
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err.message}`);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment]);

  const processDataByDepartment = (rawData, department) => {
    // Processamento específico por departamento
    switch (department) {
      case 'ti':
        return processTIData(rawData);
      case 'rh':
        return processRHData(rawData);
      case 'vendas':
        return processVendasData(rawData);
      case 'financeiro':
        return processFinanceiroData(rawData);
      case 'marketing':
        return processMarketingData(rawData);
      default:
        return rawData;
    }
  };

  const processTIData = (data) => {
    return data.map(item => ({
      ...item,
      valor: parseFloat(String(item.valor || 0).replace(',', '.')),
      mes: parseInt(item.Mês || item.mes || 0),
      ano: parseInt(item.Ano || item.ano || new Date().getFullYear()),
      tipo: item.Tipo || item.tipo || 'Outros',
      fornecedor: item.A2_NREDUZ || item.fornecedor || 'Não informado'
    }));
  };

  const processRHData = (data) => {
    return data.map(item => ({
      ...item,
      salario: parseFloat(String(item.Salario || item.salario || 0).replace(',', '.')),
      funcionario: item.Funcionario || item.funcionario || 'Não informado',
      cargo: item.Cargo || item.cargo || 'Não informado',
      departamento: item.Departamento || item.departamento || 'Não informado'
    }));
  };

  const processVendasData = (data) => {
    return data.map(item => ({
      ...item,
      valor: parseFloat(String(item.Valor || item.valor || 0).replace(',', '.')),
      cliente: item.Cliente || item.cliente || 'Não informado',
      produto: item.Produto || item.produto || 'Não informado',
      vendedor: item.Vendedor || item.vendedor || 'Não informado'
    }));
  };

  const processFinanceiroData = (data) => {
    return data.map(item => ({
      ...item,
      valor: parseFloat(String(item.Valor || item.valor || 0).replace(',', '.')),
      categoria: item.Categoria || item.categoria || 'Não categorizado',
      tipo: item.Tipo || item.tipo || 'Não informado'
    }));
  };

  const processMarketingData = (data) => {
    return data.map(item => ({
      ...item,
      investimento: parseFloat(String(item.Investimento || item.investimento || 0).replace(',', '.')),
      impressoes: parseInt(item.Impressoes || item.impressoes || 0),
      cliques: parseInt(item.Cliques || item.cliques || 0),
      conversoes: parseInt(item.Conversoes || item.conversoes || 0),
      campanha: item.Campanha || item.campanha || 'Não informado'
    }));
  };

  const resetAll = () => {
    setSelectedDepartment(null);
    setSelectedDashboard(null);
    setData(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Dashboard Analytics</h1>
        <p>Transforme seus dados em insights poderosos</p>
        {(selectedDepartment || selectedDashboard) && (
          <button onClick={resetAll} className="reset-btn">
            ← Voltar ao início
          </button>
        )}
      </header>

      <main className="app-main">
        {!selectedDepartment && (
          <DashboardSelector
            departments={DEPARTMENT_CONFIGS}
            onSelect={setSelectedDepartment}
          />
        )}

        {selectedDepartment && !selectedDashboard && (
          <div className="dashboard-selection">
            <h2 style={{ color: DEPARTMENT_CONFIGS[selectedDepartment].color }}>
              {DEPARTMENT_CONFIGS[selectedDepartment].name}
            </h2>
            <div className="dashboard-grid">
              {DEPARTMENT_CONFIGS[selectedDepartment].dashboards.map(dashboard => (
                <div
                  key={dashboard.id}
                  className="dashboard-card"
                  onClick={() => setSelectedDashboard(dashboard.id)}
                  style={{ borderColor: DEPARTMENT_CONFIGS[selectedDepartment].color }}
                >
                  <div className="dashboard-icon">{dashboard.icon}</div>
                  <h3>{dashboard.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDepartment && selectedDashboard && !data && (
          <FileUpload
            onUpload={handleFileUpload}
            loading={loading}
            error={error}
            expectedColumns={DEPARTMENT_CONFIGS[selectedDepartment].expectedColumns}
            departmentName={DEPARTMENT_CONFIGS[selectedDepartment].name}
          />
        )}

        {data && (
          <Dashboard
            data={data}
            department={selectedDepartment}
            dashboardType={selectedDashboard}
            config={DEPARTMENT_CONFIGS[selectedDepartment]}
          />
        )}
      </main>
    </div>
  );
}

export default App;
