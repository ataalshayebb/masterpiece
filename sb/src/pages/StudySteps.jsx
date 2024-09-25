// src/StudySteps.js
import React from 'react';
import StudyTimer from '../components/timer';
import GoalsList from '../components/goallist';

const StudySteps = () => {
  return (
    <div className="flex flex-col mb-14 md:flex-row items-start md:space-x-8 space-y-8 md:space-y-0 p-8">
      <StudyTimer initialTime={100} />
      <GoalsList />
    </div>
  );
};

export default StudySteps;
