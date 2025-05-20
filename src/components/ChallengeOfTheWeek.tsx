import React from 'react';

// Pool of weekly challenges
export const WEEKLY_CHALLENGES = [
  {
    title: 'PO TA TOES!',
    description: 'Cook any potato dish to earn bonus XP and the Samwise Badge.',
    criteria: (recipe: { ingredients: string[] }) => recipe.ingredients.includes('potato'),
    reward: { xp: 100, badge: 'Samwise' },
  },
  {
    title: 'Lobster Fest',
    description: 'Prepare a lobster dish for a chance at the Lobster Legend badge.',
    criteria: (recipe: { ingredients: string[] }) => recipe.ingredients.includes('lobster'),
    reward: { xp: 150, badge: 'Lobster Legend' },
  },
  {
    title: 'Veggie Virtuoso',
    description: 'Log three different vegetable-based recipes this week.',
    criteria: (recipe: { ingredients: string[] }) => recipe.ingredients.some(i => ['carrot','broccoli','spinach','zucchini'].includes(i)),
    reward: { xp: 120, badge: 'Veggie Virtuoso' },
  },
  {
    title: 'Baker’s Dozen',
    description: 'Bake any bread or pastry for bonus XP.',
    criteria: (recipe: { ingredients: string[] }) => recipe.ingredients.some(i => ['flour','yeast','sugar'].includes(i)),
    reward: { xp: 90, badge: 'Baker' },
  },
];

// Helper to get the current week number (ISO week)
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1)/7);
}

export const getCurrentWeeklyChallenge = () => {
  const now = new Date();
  const week = getWeekNumber(now);
  return WEEKLY_CHALLENGES[week % WEEKLY_CHALLENGES.length];
};

const ChallengeOfTheWeek: React.FC = () => {
  const challenge = getCurrentWeeklyChallenge();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 shadow text-2xl cursor-pointer transition-colors"
        title={"Challenge of the Week: " + challenge.title}
        aria-label={"Challenge of the Week: " + challenge.title}
        onClick={() => setOpen(true)}
        style={{ outline: 'none', border: 'none' }}
      >
        <span role="img" aria-label="Trophy">🏆</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative z-50 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-3xl mb-2">🏆</span>
            <span className="font-bold text-xl text-yellow-800 mb-1">{challenge.title}</span>
            <span className="text-gray-800 mb-2 text-center">{challenge.description}</span>
            <span className="text-sm text-gray-500">Reward: <b>{challenge.reward.xp} XP</b> and <b>{challenge.reward.badge}</b> badge</span>
            <button
              className="mt-4 px-4 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold shadow"
              onClick={() => setOpen(false)}
            >Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeOfTheWeek;
