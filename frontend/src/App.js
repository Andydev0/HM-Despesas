import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    category: '',
    value: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/expense`);
      setExpenses(res.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      setError('Não é permitido cadastrar despesas com datas futuras');
      setIsLoading(false);
      return;
    }
    
    try {
      if (currentExpense) {
        await axios.put(`${API_URL}/expense/${currentExpense.id}`, form);
        setCurrentExpense(null);
        setShowEditModal(false);
      } else {
        await axios.post(`${API_URL}/expense`, form);
      }
      
      setForm({ category: '', value: '', date: '' });
      fetchExpenses();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao salvar despesa. Tente novamente.');
        console.error('Erro ao salvar despesa:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setForm({
      category: expense.category,
      value: expense.value,
      date: expense.date,
    });
    setShowEditModal(true);
  };
  
  const handleCancelEdit = () => {
    setForm({ category: '', value: '', date: '' });
    setCurrentExpense(null);
    setShowEditModal(false);
    setError('');
  };
  
  const handleDelete = (expense) => {
    setCurrentExpense(expense);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/expense/${currentExpense.id}`);
      fetchExpenses();
      setShowDeleteModal(false);
      setCurrentExpense(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao excluir despesa. Tente novamente.');
        console.error('Erro ao excluir despesa:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentExpense(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block text-hm-pink">Sistema Financeiro</span>
            <span className="block text-hm-blue">Controle de Despesas</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Gerencie suas despesas diárias de forma simples e eficiente
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Nova Despesa
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="category"
                      id="category"
                      placeholder="Ex: Alimentação, Transporte, Lazer"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="value"
                      id="value"
                      step="0.01"
                      placeholder="0.00"
                      value={form.value}
                      onChange={handleChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={form.date}
                      onChange={handleChange}
                      max={getCurrentDate()}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-hm-pink hover:bg-hm-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hm-pink transition duration-150 ease-in-out transform hover:-translate-y-1 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : 'Adicionar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Despesas</h2>
            
            {isLoading && expenses.length === 0 ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma despesa registrada</h3>
                <p className="mt-1 text-sm text-gray-500">Comece adicionando sua primeira despesa usando o formulário acima.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(expense.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{expense.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">R$ {parseFloat(expense.value).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="inline-flex items-center px-3 py-1.5 border border-hm-blue text-sm font-medium rounded-md text-hm-blue bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-hm-blue transition-colors duration-150"
                            >
                              <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="inline-flex items-center px-3 py-1.5 border border-hm-pink text-sm font-medium rounded-md text-hm-pink bg-pink-50 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-hm-pink transition-colors duration-150"
                            >
                              <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Editar Despesa
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Categoria</label>
                          <input
                            type="text"
                            name="category"
                            id="edit-category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-value" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">R$</span>
                            </div>
                            <input
                              type="number"
                              name="value"
                              id="edit-value"
                              step="0.01"
                              value={form.value}
                              onChange={handleChange}
                              required
                              className="block w-full pl-10 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">Data</label>
                          <input
                            type="date"
                            name="date"
                            id="edit-date"
                            value={form.date}
                            onChange={handleChange}
                            max={getCurrentDate()}
                            required
                            className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-base border-gray-300 rounded-lg transition duration-200 ease-in-out hover:border-indigo-300 bg-white"
                          />
                        </div>
                        
                        {error && (
                          <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-md px-6 py-3 bg-hm-blue text-base font-medium text-white hover:bg-hm-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hm-blue sm:ml-3 sm:w-auto transition duration-150 ease-in-out transform hover:-translate-y-1"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Salvar Alterações'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto transition duration-150 ease-in-out"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirmar exclusão
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
                      </p>
                      {currentExpense && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm"><span className="font-medium">Categoria:</span> {currentExpense.category}</p>
                          <p className="text-sm"><span className="font-medium">Valor:</span> R$ {parseFloat(currentExpense.value).toFixed(2)}</p>
                          <p className="text-sm"><span className="font-medium">Data:</span> {formatDate(currentExpense.date)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-md px-6 py-3 bg-hm-pink text-base font-medium text-white hover:bg-hm-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hm-pink sm:ml-3 sm:w-auto transition duration-150 ease-in-out transform hover:-translate-y-1"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Excluir'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto transition duration-150 ease-in-out"
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
