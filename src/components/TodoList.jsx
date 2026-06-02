import React from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css'; 

function TodoList({ todos, onToggle, onDelete, onEdit, onChangeCategory }) {
  const columns = [
    { id: 'study', title: '🎓 Учеба' },
    { id: 'work', title: '💼 Работа' },
    { id: 'life', title: '🌱 Жизнь' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('todoId');
    onChangeCategory(todoId, targetCategory);
  };

  return (
    <div className={styles.board}> {/* Применили класс доски */}
      {columns.map((column) => {
        const columnTodos = todos.filter(todo => todo.category === column.id);

        return (
          <div 
            key={column.id}
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <span className={styles.badge}>{columnTodos.length}</span>
            </div>
            
            {columnTodos.map((todo) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;