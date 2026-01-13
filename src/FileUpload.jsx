import React, { useRef, useState } from 'react';

const FileUpload = ({ onUpload, loading, error, expectedColumns, departmentName }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use arquivos Excel (.xlsx, .xls) ou CSV.');
      return;
    }
    
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <h2>📊 Upload da Planilha</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Departamento: <strong style={{ color: 'var(--primary)' }}>{departmentName}</strong>
      </p>
      
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="upload-icon">
          {loading ? '⏳' : '📁'}
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Processando arquivo...</span>
          </div>
        ) : (
          <>
            <div className="upload-text">
              Clique aqui ou arraste sua planilha
            </div>
            <div className="upload-hint">
              Formatos suportados: Excel (.xlsx, .xls) ou CSV
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="file-input"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInputChange}
      />

      {error && (
        <div className="error">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="expected-columns">
        <h4>📋 Colunas Esperadas na Planilha:</h4>
        <div className="columns-list">
          {expectedColumns.map((column, index) => (
            <span key={index} className="column-tag">
              {column}
            </span>
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          💡 <strong>Dica:</strong> Se sua planilha tiver nomes de colunas diferentes, 
          não se preocupe! O sistema tentará identificar automaticamente as colunas correspondentes.
        </p>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>📝 Dicas para melhor resultado:</h4>
        <ul style={{ textAlign: 'left', color: '#333', fontSize: '0.9rem' }}>
          <li>Certifique-se de que a primeira linha contém os cabeçalhos das colunas</li>
          <li>Use valores numéricos para campos de valor (ex: 1500.00 ou 1500,00)</li>
          <li>Evite células mescladas ou formatação muito complexa</li>
          <li>Remove linhas vazias ou com dados incompletos</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
