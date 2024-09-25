import React, { useState } from 'react';

const GoalsList = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Read Chapter 3 Anatomy', completed: false },
    { id: 2, text: 'Complete exercises 12-14', completed: false },
    { id: 3, text: 'Study chapters 4 - 5 Math', completed: false },


  ]);

  const [newGoal, setNewGoal] = useState('');

  const toggleGoal = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const addGoal = (event) => {
    event.preventDefault();
    if (newGoal.trim() === '') return;

    const newGoalObject = {
      id: goals.length + 1,
      text: newGoal,
      completed: false,
    };

    setGoals([...goals, newGoalObject]);
    setNewGoal('');
  };

  return (
    <div className="bg-gradient-to-r from- gray-300 to-gray-600 p-6 rounded-lg shadow-lg flex-grow">
      <h3 className="text-2xl font-bold mb-4 text-pink-500">Checklist</h3>
      <form onSubmit={addGoal} className="mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Enter your goal"
        />
        <button
          type="submit"
          className="mt-2 bg-green-600 text-white p-2 rounded w-full"
        >
          Add Goal
        </button>
      </form>
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
