import React from 'react';
import type { RecipeCard } from './RecipeMatcherModal';

import { useState } from 'react';
import { claimWeeklyChallenge } from '../api/weeklyChallenge';
import { getCurrentUserId } from '../api/userSession';

interface WeeklyChallengeRecipeModalProps {
  open: boolean;
  onClose: () => void;
  recipe: RecipeCard | null;
  loading: boolean;
  error: string | null;
  challengeId?: string;
  weekNumber?: number;
  xp?: number;
  badge?: string;
}


const WeeklyChallengeRecipeModal: React.FC<WeeklyChallengeRecipeModalProps> = ({ open, onClose, recipe, loading, error, challengeId, weekNumber, xp, badge }) => {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  async function handleClaim() {
    setClaiming(true);
    setClaimError(null);
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not signed in');
      const result = await claimWeeklyChallenge({
        userId,
        challengeId: challengeId || recipe?.id || '',
        weekNumber: weekNumber || 0,
        xp: xp || 0,
        badge: badge || '',
      });
      if (result.alreadyClaimed) {
        setAlreadyClaimed(true);
      } else {
        setClaimed(true);
      }
    } catch (e: any) {
      setClaimError(e.message || 'Failed to claim reward');
    } finally {
      setClaiming(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose} aria-label="Close">✕</button>
        <div className="flex flex-col items-center min-h-[200px] justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maineBlue mb-4"></div>
              <span className="text-lg font-semibold">Generating Recipe...</span>
            </div>
          )}
          {!loading && error && (
            <div className="text-red-600 text-center">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && recipe && (
            <>
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full max-h-64 object-cover rounded mb-4" />}
              <h2 className="text-2xl font-bold mb-2 text-center">{recipe.title}</h2>
              <h3 className="font-semibold text-lg mt-2 mb-1">Ingredients</h3>
              <ul className="mb-3 list-disc list-inside">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
              <h3 className="font-semibold text-lg mt-2 mb-1">Instructions</h3>
              <p className="mb-4 whitespace-pre-line">{recipe.instructions}</p>
              {recipe.equipment && recipe.equipment.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg mt-2 mb-1">Equipment</h3>
                  <ul className="mb-3 list-disc list-inside">
                    {recipe.equipment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              <button
                className={`mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold shadow w-full ${claimed || alreadyClaimed ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={handleClaim}
                disabled={claiming || claimed || alreadyClaimed}
              >
                {claiming ? 'Claiming...' : claimed ? 'Reward Claimed!' : alreadyClaimed ? 'Already Claimed' : 'Claim Reward'}
              </button>
              {claimError && <div className="text-red-600 mt-2">{claimError}</div>}
              {claimed && <div className="text-green-700 mt-2 font-semibold">XP and badge awarded! 🎉</div>}
              {alreadyClaimed && <div className="text-yellow-700 mt-2 font-semibold">You already claimed this week’s reward.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyChallengeRecipeModal;
