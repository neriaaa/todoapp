import React, { useState } from 'react';
import styles from './TodoForm.module.css';

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('study');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAdd(text, category, deadline);
    setText('');
    setDeadline('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input 
        type="text" 
        className={styles.input}
        placeholder="Что нужно сделать?" 
        value={text}
        onChange={(e) => setText(e.target.value)} 
      />
      
      <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="study">Учеба</option>
        <option value="work">Работа</option>
        <option value="life">Жизнь</option>
      </select>

      <input 
        type="date" 
        className={styles.dateInput}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button type="submit" className={styles.button}>Добавить</button>
    </form>
  );
}

export default TodoForm;