import React, { useState } from 'react';
import styles from './TodoItem.module.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const checkIsOverdue = (deadline, completed) => {
    if (completed || !deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(deadline) < today;
  };
  const isOverdue = checkIsOverdue(todo.deadline, todo.completed);

  const handleSave = () => {
    if (editText.trim() === '') return;
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <div 
      className={`${styles.card} ${styles[todo.category]} ${todo.completed ? styles.completed : ''}`}
      draggable={true} 
      onDragStart={(e) => e.dataTransfer.setData('todoId', todo.id)} 
      style={{ cursor: 'grab' }} 
    >
      
      {/* 1. Заголовок и кнопки */}
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => onToggle(todo.id)} 
            className={styles.checkbox}
          />
          {isEditing ? (
            <input 
              type="text" 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus 
              style={{ width: '100%', padding: '4px' }}
            />
          ) : (
            <span className={`${styles.text} ${todo.completed ? styles.completedText : ''}`}>
              {todo.text}
            </span>
          )}
        </div>
        
        {/* Меню (появляется при наведении) */}
        <div className={styles.menu}>
          {isEditing ? (
            <button onClick={handleSave} className={styles.actionBtn}>💾</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className={styles.actionBtn}>✏️</button>
          )}
          <button onClick={() => onDelete(todo.id)} className={styles.actionBtn}>🗑️</button>
        </div>
      </div>

      {/* 2. Даты и категория */}
      <div className={styles.middleRow}>
        {todo.deadline && (
          <span className={`${styles.deadline} ${isOverdue ? styles.deadlineOverdue : ''}`}>
            🕒 {todo.deadline}
          </span>
        )}
        <span className={`${styles.badge} ${styles[todo.category + 'Badge']}`}>
          {todo.category === 'study' ? 'Учеба' : todo.category === 'work' ? 'Работа' : 'Жизнь'}
        </span>
      </div>

      {/* 3. Футер (Очистили от фейковых данных) */}
      <div className={styles.footer}>
        {/* Пустой div, чтобы вытолкнуть аватарку в правый край (свойство space-between в CSS) */}
        <div></div> 
        <div className={styles.avatar}>👤</div>
      </div>

    </div>
  );
}

export default TodoItem;