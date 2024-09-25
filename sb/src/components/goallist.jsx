// src/GoalsList.js
import React, { useState } from 'react';

const GoalsList = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Read Chapter 3 Anatomy', completed: false },
    { id: 2, text: 'Complete exercises 12-14', completed: false },
    { id: 3, text: 'Study chapters 4 - 5 Math', completed: false },
    { id: 4, text: 'Summarize last video lecture', completed: false },
    { id: 5, text: 'Review notes on Physics', completed: false },
    { id: 6, text: 'Practice coding challenges', completed: false },
    { id: 7, text: 'Prepare for the History quiz', completed: false },
    { id: 8, text: 'Read article on Environmental Science', completed: false },
    

  ]);

  const toggleGoal = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-300 p-6 rounded-lg shadow-lg flex-grow">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Goals</h3>
      <ul className="space-y-4">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-center text-lg">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(goal.id)}
              className="mr-4 form-checkbox h-6 w-6 text-green-600"
            />
            <span className={goal.completed ? 'line-through text-gray-600' : 'text-gray-800'}>
              {goal.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalsList;
