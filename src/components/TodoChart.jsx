import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TodoChart({ todos }) {
  // Если задач нет, график не показываем
  if (todos.length === 0) return null;

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  // Формируем данные для графика
  const data = [
    { name: 'Выполнено', value: completedCount },
    { name: 'Осталось', value: activeCount },
  ];

  const COLORS = ['#10b981', '#3b82f6'];

  return (
    <div style={{ 
      width: '100%', 
      height: 260, 
      backgroundColor: 'var(--bg-card)', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid var(--border-color)', 
      marginBottom: '20px' 
    }}>
      <h3 style={{ 
        margin: '0 0 10px 0', 
        textAlign: 'center', 
        color: 'var(--text-main)', 
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        Статистика задач
      </h3>
      
      {/* ResponsiveContainer делает график адаптивным под ширину экрана */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={80} 
            paddingAngle={5} 
            dataKey="value"
            stroke="none" 
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          {/* Всплывающая подсказка при наведении */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)', 
              borderRadius: '8px',
              color: 'var(--text-main)'
            }}
            itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
          />
          
          {/* Легенда (подписи цветов) */}
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            wrapperStyle={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TodoChart;