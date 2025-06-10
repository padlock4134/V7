import React from 'react';
import ChallengeOfTheWeek from '../components/ChallengeOfTheWeek';
import { useFreddieContext } from '../components/FreddieContext';
import { useEffect } from 'react';

const WeeklyChallenges = () => {
  const { updateContext } = useFreddieContext();
  
  useEffect(() => {
    updateContext({ page: 'WeeklyChallenges' });
  }, [updateContext]);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
      <h1 className="text-2xl font-retro mb-6">Weekly Challenges</h1>
      <ChallengeOfTheWeek />
    </div>
  );
};

export default WeeklyChallenges;
