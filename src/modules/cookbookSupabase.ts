import { supabase } from '../api/supabaseClient';
import type { RecipeCard } from '../components/RecipeMatcherModal';

export async function saveCookbook(recipes: RecipeCard[]) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not signed in');
  const { error } = await supabase
    .from('user_cookbook')
    .upsert([{ user_id: user.id, recipes }], { onConflict: 'user_id' });
  if (error) throw error;
}

export async function fetchCookbook(): Promise<RecipeCard[]> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('user_cookbook')
    .select('recipes')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: no rows
  return data?.recipes || [];
}

export async function addRecipeToCookbook(recipe: RecipeCard) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not signed in');
  
  // First get existing recipes
  const { data, error: fetchError } = await supabase
    .from('user_cookbook')
    .select('recipes')
    .eq('user_id', user.id)
    .single();
    
  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
  
  // Add new recipe if not already present
  const existingRecipes = data?.recipes || [];
  if (!existingRecipes.some(r => r.id === recipe.id)) {
    const { error } = await supabase
      .from('user_cookbook')
      .upsert([{ 
        user_id: user.id, 
        recipes: [...existingRecipes, recipe]
      }], { onConflict: 'user_id' });
    if (error) throw error;
  }
}
