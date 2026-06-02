import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoChart from './components/TodoChart';
import { generateWordReport } from './utils/wordExport';
import styles from './App.module.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('smart-todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [statusFilter, setStatusFilter] = useState('all'); 
  const [categoryFilter, setCategoryFilter] = useState('all'); 

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smart-theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('smart-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('smart-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddTodo = (text, category, deadline) => {
    const newTodo = {
      id: Date.now().toString(),
      text: text,
      category: category,
      deadline: deadline,
      completed: false
    };
    setTodos([...todos, newTodo]);
    toast.success('Задача успешно добавлена!');
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        const isNowCompleted = !todo.completed;
        if (isNowCompleted) {
          toast.success('Отличная работа!', { icon: '🎉' });
        }
        return { ...todo, completed: isNowCompleted };
      }
      return todo;
    }));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast('Задача удалена', { icon: '🗑️' });
  };

  const handleEditTodo = (id, newText) => {
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
    toast.success('Изменения сохранены', { icon: '💾' });
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    toast.success('Выполненные задачи очищены!');
  };

  const handleChangeCategory = (id, newCategory) => {
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, category: newCategory } : todo
    ));
    toast('Категория изменена', { icon: '✨' });
  };

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ ЭКСПОРТА ---
  const handleExport = async () => {
    try {
      await generateWordReport(todos);
      toast.success('Отчет успешно скачан!', { icon: '📄' });
    } catch (error) {
      toast.error('Ошибка при генерации отчета');
      console.error(error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? !todo.completed :
      statusFilter === 'completed' ? todo.completed : true;

    const matchCategory = 
      categoryFilter === 'all' ? true : 
      todo.category === categoryFilter;

    return matchStatus && matchCategory;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (!a.deadline) return 1;  
    if (!b.deadline) return -1; 
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const totalCount = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className={styles.container}>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Neriaaa Todo App</h1>
        
        {/* Блок с кнопками экспорта и смены темы */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={handleExport}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(118, 75, 162, 0.25)',
              transition: 'transform 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📄</span> Скачать отчет
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: 'transparent', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              padding: '8px', 
              borderRadius: '50%',
              transition: 'transform 0.2s ease'
            }}
            title={isDarkMode ? "Включить светлую тему" : "Включить темную тему"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      <div className={styles.dashboard}>
        <span><strong>Всего:</strong> {totalCount}</span>
        <span className={styles.statCompleted}><strong>Выполнено:</strong> {completedCount}</span>
        <span className={styles.statActive}><strong>Осталось:</strong> {activeCount}</span>
      </div>

      <TodoChart todos={todos} />

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Статус:</label>
          <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="completed">Выполненные</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Категория:</label>
          <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="study">Учеба</option>
            <option value="work">Работа</option>
            <option value="life">Жизнь</option>
          </select>
        </div>

        {completedCount > 0 && (
          <button onClick={handleClearCompleted} className={styles.clearBtn}>
            Очистить выполненные ({completedCount})
          </button>
        )}
      </div>
      
      <TodoForm onAdd={handleAddTodo} />
      
      <TodoList 
        todos={sortedTodos} 
        onToggle={handleToggleTodo} 
        onDelete={handleDeleteTodo} 
        onEdit={handleEditTodo} 
        onChangeCategory={handleChangeCategory}
      />
    </div>
  );
}

export default App;