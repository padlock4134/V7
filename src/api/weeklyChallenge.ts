// Weekly Challenge XP/badge claim logic using Supabase
// Prevents double-claiming by checking for an existing claim for the current user and week
import { supabase } from './supabaseClient';

export async function claimWeeklyChallenge({ userId, challengeId, weekNumber, xp, badge }: {
  userId: string;
  challengeId: string;
  weekNumber: number;
  xp: number;
  badge: string;
}) {
  // Check if already claimed
  const { data: existing, error: fetchError } = await supabase
    .from('weekly_challenge_claims')
    .select('id')
    .eq('user_id', userId)
    .eq('week_number', weekNumber)
    .maybeSingle();

  if (fetchError) throw new Error('Failed to check claim status');
  if (existing) {
    return { alreadyClaimed: true };
  }

  // Log claim
  const { error: insertError } = await supabase
    .from('weekly_challenge_claims')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      week_number: weekNumber,
      xp_awarded: xp,
      badge_awarded: badge,
      claimed_at: new Date().toISOString(),
    });
  if (insertError) throw new Error('Failed to claim challenge');
  return { alreadyClaimed: false };
}
