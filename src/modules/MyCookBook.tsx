import React, { useState, useEffect } from 'react';
import { useFreddieContext } from '../components/FreddieContext';
import { useRecipeContext } from '../components/RecipeContext';
import { useNavigate } from 'react-router-dom';
import { fetchCookbook, removeRecipeFromCookbook } from './cookbookSupabase';

// Chef quotes (production-ready)
const chefQuotes = [
  { chef: 'Julia Child', quote: 'People who love to eat are always the best people.' },
  { chef: 'Gordon Ramsay', quote: 'Cooking is about passion, so it may look slightly temperamental in a way that it\'s too assertive to the naked eye.' },
  { chef: 'Alice Waters', quote: 'Let things taste of what they are.' },
  { chef: 'Anthony Bourdain', quote: 'Your body is not a temple, it\'s an amusement park. Enjoy the ride.' },
  { chef: 'Massimo Bottura', quote: 'Cooking is an act of love, a gift, a way of sharing with others the little secrets — "piccoli segreti" — that are simmering on the burners.' },
  { chef: 'Thomas Keller', quote: 'A recipe has no soul. You as the cook must bring soul to the recipe.' },
  { chef: 'Ina Garten', quote: 'Food is not about impressing people. It\'s about making them feel comfortable.' },
  { chef: 'Ferran Adrià', quote: 'The more you know, the more you can create. There\'s no end to imagination in the kitchen.' },
  { chef: 'Emeril Lagasse', quote: 'Kick it up a notch!' },
  { chef: 'Wolfgang Puck', quote: 'Cooking is like painting or writing a song.' },
  { chef: 'Rene Redzepi', quote: 'Innovation, being avant-garde, is always polemic.' },
  { chef: 'Heston Blumenthal', quote: 'Question everything. No idea is a bad idea.' },
  { chef: 'Alain Ducasse', quote: 'Cooking is a way of giving.' },
  { chef: 'Rachel Ray', quote: 'Good food and a warm kitchen are what make a house a home.' },
  { chef: 'Pierre Gagnaire', quote: 'Cooking is not difficult. Everyone has taste, even if they don\'t realize it.' },
  { chef: 'Paul Bocuse', quote: 'Cooking is not just eating energy. It\'s an experience.' },
  { chef: 'Joël Robuchon', quote: 'The simpler the food, the more exceptional it can be.' },
  { chef: 'Marco Pierre White', quote: 'Mother Nature is the true artist and our job as cooks is to allow her to shine.' },
  { chef: 'Jamie Oliver', quote: 'Real food doesn\'t have ingredients, real food is ingredients.' },
  { chef: 'Nigella Lawson', quote: 'I have always believed that what goes on in the kitchen should stay in the kitchen.' }
];

function getChefQuoteOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const idx = dayOfYear % chefQuotes.length;
  return chefQuotes[idx];
}

export interface Recipe {
  name: string;
  description: string;
  photo?: string;
  ingredients?: string[];
  instructions?: string;
  equipment?: string[];
}

const MyCookBook = () => {
  const { setSelectedRecipe } = useRecipeContext();
  const navigate = useNavigate();
  const [recipes, setLocalRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load recipes and set page context on mount
  const { updateContext } = useFreddieContext();
  useEffect(() => {
    updateContext({ page: 'MyCookBook' });
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const savedRecipes = await fetchCookbook();
        const converted = savedRecipes.map(r => ({
          name: r.title,
          description: r.instructions,
          photo: r.image,
          ingredients: r.ingredients,
          instructions: r.instructions,
          equipment: r.equipment
        }));
        setLocalRecipes(converted);
      } catch (err) {
        console.error('Error loading cookbook:', err);
        setError('Failed to load your cookbook');
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, [updateContext]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maineBlue mb-4"></div>
          <div className="text-lg font-retro mb-2">Loading your cookbook...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
      {/* Chef of the Day Quote */}
      <div className="mb-6 p-4 border-l-4 border-seafoam rounded flex items-center">
        <div className="mr-4 text-3xl" role="img" aria-label="chef-hat">👨‍🍳</div>
        <div>
          <div className="italic text-lg mb-1">"{getChefQuoteOfTheDay().quote}"</div>
          <div className="font-retro text-seafoam font-bold text-right">— {getChefQuoteOfTheDay().chef}</div>
        </div>
      </div>

      {/* Digital Cookbook Grid */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-retro">My Digital Cookbook</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {recipes.length === 0 ? (
          <div className="text-gray-400 italic">No recipes yet. Add your first recipe!</div>
        ) : recipes.map((recipe, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {recipe.photo && (
              <img 
                src={recipe.photo} 
                alt={recipe.name} 
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            
            <div className="flex justify-between items-center">
              <button
                onClick={async () => {
                  try {
                    // Use the recipe title as the ID since that's what we use when saving in RecipeMatcherModal
                    const recipeId = recipe.name;
                    await removeRecipeFromCookbook(recipeId);
                    setLocalRecipes(recipes.filter(r => r.name !== recipeId));
                  } catch (err) {
                    console.error('Error deleting recipe:', err);
                    setError('Failed to delete recipe');
                  }
                }}
                className="text-lobsterRed hover:text-maineBlue transition-colors"
                title="Delete Recipe"
              >
                🗑️ Remove
              </button>
              
              <button
                onClick={() => {
                  const fullRecipe = {
                    id: `${recipe.name.replace(/\s+/g, '-')}-${idx}`,
                    title: recipe.name,
                    image: recipe.photo || '',
                    ingredients: recipe.ingredients || [],
                    instructions: recipe.instructions || '',
                    equipment: recipe.equipment || [],
                    tutorials: [
                      {
                        title: `Equipment: Using the right tools for ${recipe.name}`,
                        desc: `Learn how to use the main equipment needed for this dish.`
                      },
                      {
                        title: `Protein Prep: Preparing the main ingredient`,
                        desc: `How to prep the main protein (e.g., fish, chicken, clams) for this recipe.`
                      },
                      {
                        title: `Recipe: ${recipe.name}`,
                        desc: recipe.instructions || ''
                      }
                    ]
                  };
                  setSelectedRecipe(fullRecipe);
                  navigate('/culinary-school');
                }}
                className="bg-seafoam text-maineBlue px-4 py-2 rounded hover:bg-maineBlue hover:text-seafoam transition-colors"
              >
                Cook This
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCookBook;
