# 🎯 Dashboard Analytics - Análise Multi-Departamental

Plataforma completa para transformar dados de qualquer departamento em insights visuais poderosos. Suporte para TI, RH, Vendas, Financeiro e Marketing.

![Dashboard Preview](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-2-8DD6F9?style=for-the-badge)

## 🚀 Novidades da Versão 2.0

- ✨ **Multi-Departamental** - Suporte para 5 departamentos diferentes
- 🎨 **Dashboards Específicos** - Cada departamento tem seus próprios tipos de análise
- 🔍 **Busca e Filtros Avançados** - Encontre dados específicos rapidamente
- 📱 **Design Responsivo Melhorado** - Interface otimizada para todos os dispositivos
- 🎯 **Configuração Inteligente** - Detecção automática de colunas nas planilhas

## 📊 Departamentos Suportados

### 💻 Tecnologia da Informação (TI)
- **Análise de Despesas** - Controle de gastos por fornecedor e tipo
- **Gestão de Fornecedores** - Performance e análise de parceiros
- **Timeline de Gastos** - Evolução mensal dos investimentos

**Colunas esperadas:** `Tipo`, `A2_NREDUZ`, `valor`, `Mês`, `Ano`

### 👥 Recursos Humanos (RH)
- **Análise de Folha de Pagamento** - Distribuição salarial por departamento
- **Turnover e Retenção** - Análise de rotatividade de funcionários
- **Benefícios e Custos** - Controle de custos com benefícios

**Colunas esperadas:** `Funcionario`, `Cargo`, `Salario`, `Departamento`, `Data_Admissao`

### 📈 Vendas
- **Performance de Vendas** - Ranking de vendedores e análise temporal
- **Análise de Clientes** - Comportamento e segmentação de clientes
- **Produtos Mais Vendidos** - Ranking e análise de produtos

**Colunas esperadas:** `Cliente`, `Produto`, `Valor`, `Vendedor`, `Data`, `Regiao`

### 💰 Financeiro
- **Fluxo de Caixa** - Entradas e saídas ao longo do tempo
- **Análise de Receitas** - Categorização e origem das receitas
- **Controle de Despesas** - Monitoramento e categorização de gastos

**Colunas esperadas:** `Categoria`, `Subcategoria`, `Valor`, `Data`, `Tipo`, `Status`

### 🎯 Marketing
- **Performance de Campanhas** - ROI e efetividade das campanhas
- **ROI Marketing** - Retorno sobre investimento em marketing
- **Análise de Canais** - Performance por canal de marketing

**Colunas esperadas:** `Campanha`, `Canal`, `Investimento`, `Impressoes`, `Cliques`, `Conversoes`

## ✨ Funcionalidades

- 📤 **Upload Inteligente** - Suporte para Excel (.xlsx, .xls) e CSV
- 🔄 **Detecção Automática** - Identifica automaticamente colunas similares
- 📊 **Visualizações Dinâmicas** - Gráficos interativos com Recharts
- 🔍 **Busca em Tempo Real** - Filtragem instantânea de dados
- 📱 **Totalmente Responsivo** - Funciona em desktop, tablet e mobile
- 🎨 **Design Moderno** - Interface limpa e profissional
- ⚡ **Performance Otimizada** - Carregamento rápido e smooth

## 🚀 Tecnologias

- **React 18** - Framework UI moderno
- **Vite** - Build tool ultra-rápido
- **Recharts** - Biblioteca de gráficos responsivos
- **SheetJS (xlsx)** - Parser de planilhas Excel
- **CSS3 Avançado** - Animações, gradientes e responsividade

## 📦 Instalação e Uso

### Desenvolvimento Local

```bash
# Clone ou baixe o projeto
cd dashboard-analytics

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:3000 no navegador.

### Build para Produção

```bash
# Gera a versão otimizada
npm run build

# Preview da build
npm run preview
```

## 🌐 Deploy

### Deploy Automático no Netlify

1. **Fork/Clone** este repositório
2. **Conecte ao Netlify**:
   - Acesse [Netlify](https://www.netlify.com/)
   - Clique em "Add new site" → "Import an existing project"
   - Conecte seu repositório GitHub
3. **Configuração automática**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
4. **Deploy!** - Seu site estará online em minutos

### Deploy Manual

```bash
# Build do projeto
npm run build

# Upload da pasta 'dist' para qualquer hospedagem estática
```

## 📋 Como Usar

### 1. Selecione o Departamento
Escolha entre TI, RH, Vendas, Financeiro ou Marketing

### 2. Escolha o Tipo de Dashboard
Cada departamento oferece diferentes tipos de análise

### 3. Prepare sua Planilha
Certifique-se de que sua planilha Excel/CSV contém as colunas esperadas

### 4. Upload e Análise
Faça o upload da planilha e visualize os insights gerados automaticamente

## 🛠️ Personalização

### Adicionando Novos Departamentos

1. **Configure em `src/App.jsx`**:
```javascript
const DEPARTMENT_CONFIGS = {
  // Adicione seu departamento
  meuDept: {
    name: 'Meu Departamento',
    color: '#FF6B35',
    expectedColumns: ['Coluna1', 'Coluna2'],
    dashboards: [
      { id: 'dashboard1', name: 'Dashboard 1', icon: '📊' }
    ]
  }
};
```

2. **Implemente o processamento** em `processDataByDepartment()`

3. **Crie as visualizações** em `src/components/Dashboard.jsx`

### Customizando Cores

Edite as variáveis CSS em `src/App.css`:

```css
:root {
  --primary: #FF6B35;     /* Cor principal */
  --secondary: #004E89;   /* Cor secundária */
  --accent: #F4B942;      /* Cor de destaque */
  /* Adicione suas cores... */
}
```

## 🐛 Solução de Problemas

### ❓ Planilha não carrega
- Verifique se o arquivo é .xlsx, .xls ou .csv
- Certifique-se de que a primeira linha contém os cabeçalhos
- Verifique se não há células mescladas

### ❓ Gráficos não aparecem
- Confirme se os valores numéricos estão no formato correto
- Verifique se as colunas esperadas existem na planilha
- Use o console do navegador (F12) para verificar erros

### ❓ Build falha no Netlify
- Confirme que Node.js está na versão 18+
- Verifique se todas as dependências estão no `package.json`
- Confirme que Build command é `npm run build`

## 📈 Exemplos de Planilhas

### TI - Despesas
```
Tipo                    | A2_NREDUZ              | valor    | Mês | Ano
------------------------|------------------------|----------|-----|-----
Serviços               | TOTVS SA               | 1500,00  | 1   | 2024
Produtos/Consumiveis   | SCANSOURCE BRASIL      | 2300,50  | 2   | 2024
```

### RH - Folha de Pagamento
```
Funcionario     | Cargo           | Salario  | Departamento | Data_Admissao
----------------|-----------------|----------|--------------|---------------
João Silva      | Desenvolvedor   | 8000,00  | TI           | 01/01/2023
Maria Santos    | Analista RH     | 6500,00  | RH           | 15/03/2023
```

### Vendas
```
Cliente         | Produto      | Valor   | Vendedor    | Data       | Regiao
----------------|--------------|---------|-------------|------------|--------
Empresa ABC     | Software X   | 5000,00 | João        | 01/01/2024 | SP
Cliente Y       | Produto Z    | 3000,00 | Maria       | 02/01/2024 | RJ
```

## 🤝 Contribuições

Contribuições são muito bem-vindas! 

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir!

## 🌟 Próximos Passos

- [ ] Exportação de relatórios em PDF
- [ ] Integração com APIs externas
- [ ] Dashboard de comparação entre departamentos
- [ ] Alertas automáticos baseados em thresholds
- [ ] Histórico de uploads e versionamento
- [ ] Compartilhamento de dashboards via link

---

**💡 Dicas de Uso:**
- Use dados limpos e organizados para melhores resultados
- Mantenha a consistência nos nomes de colunas
- Experimente diferentes visualizações para encontrar insights únicos

**🔗 Links Úteis:**
- [Documentação React](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Netlify Deploy Guide](https://docs.netlify.com/)

---

Feito com ❤️ e React | Versão 2.0
