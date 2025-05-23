import React, { useState, useEffect } from 'react';

// Sample chef quotes (expand to 365 for production)
const chefQuotes = [
  { chef: 'Julia Child', quote: 'People who love to eat are always the best people.' },
  { chef: 'Gordon Ramsay', quote: 'Cooking is about passion, so it may look slightly temperamental in a way that it’s too assertive to the naked eye.' },
  { chef: 'Alice Waters', quote: 'Let things taste of what they are.' },
  { chef: 'Anthony Bourdain', quote: 'Your body is not a temple, it’s an amusement park. Enjoy the ride.' },
  { chef: 'Massimo Bottura', quote: 'Cooking is an act of love, a gift, a way of sharing with others the little secrets — "piccoli segreti" — that are simmering on the burners.' },
  { chef: 'Thomas Keller', quote: 'A recipe has no soul. You as the cook must bring soul to the recipe.' },
  { chef: 'Ina Garten', quote: 'Food is not about impressing people. It’s about making them feel comfortable.' },
  { chef: 'Ferran Adrià', quote: 'The more you know, the more you can create. There’s no end to imagination in the kitchen.' },
  { chef: 'Emeril Lagasse', quote: 'Kick it up a notch!' },
  { chef: 'Wolfgang Puck', quote: 'Cooking is like painting or writing a song.' },
  { chef: 'Rene Redzepi', quote: 'Innovation, being avant-garde, is always polemic.' },
  { chef: 'Heston Blumenthal', quote: 'Question everything. No idea is a bad idea.' },
  { chef: 'Alain Ducasse', quote: 'Cooking is a way of giving.' },
  { chef: 'Rachel Ray', quote: 'Good food and a warm kitchen are what make a house a home.' },
  { chef: 'Pierre Gagnaire', quote: 'Cooking is not difficult. Everyone has taste, even if they don’t realize it.' },
  { chef: 'Paul Bocuse', quote: 'Cooking is not just eating energy. It’s an experience.' },
  { chef: 'Joël Robuchon', quote: 'The simpler the food, the more exceptional it can be.' },
  { chef: 'Marco Pierre White', quote: 'Mother Nature is the true artist and our job as cooks is to allow her to shine.' },
  { chef: 'Jamie Oliver', quote: 'Real food doesn’t have ingredients, real food is ingredients.' },
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
};

const emptyRecipe: Recipe = { name: '', description: '' };

import { useFreddieContext } from '../components/FreddieContext';
import { getMealVideoQuery, getMainIngredientPrepQuery } from '../utils/videoSourcing';
import { useRecipeContext } from '../components/RecipeContext';
import { useNavigate } from 'react-router-dom';

// Helper: get main ingredient (first in array)
function getMainIngredient(ingredients?: string[]): string {
  return ingredients && ingredients.length > 0 ? ingredients[0] : '';
}

// Get the two video queries for a recipe
export function getVideoQueriesForRecipe(recipe: Recipe): [string, string] {
  const mealQuery = getMealVideoQuery(recipe.name);
  const mainIng = getMainIngredient(recipe.ingredients);
  const prepQuery = getMainIngredientPrepQuery(mainIng, recipe.name);
  return [mealQuery, prepQuery];
}

// Main MyCookBook component starts here

const MyCookBook = () => {
  // Recipe context for "Cook Me"
  const { setSelectedRecipe, setRecipes } = useRecipeContext();
  const navigate = useNavigate();
  // Only keep recipe state and handlers

  const starterRecipes: Recipe[] = [
    {
      name: 'New England Clam Chowder',
      description: 'A creamy, hearty chowder with fresh clams, potatoes, and smoky bacon—an iconic taste of the Maine coast.',
      photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      ingredients: [
        '2 dozen fresh clams',
        '4 slices bacon',
        '2 cups diced potatoes',
        '1 onion, chopped',
        '2 cups half-and-half',
        'Salt & pepper to taste'
      ],
      instructions: `1. Cook bacon until crisp; remove and chop.
2. Sauté onion in bacon fat until soft.
3. Add potatoes, clam juice, and simmer until potatoes are tender.
4. Add clams, half-and-half, and bacon; heat gently. Season to taste.`,
      equipment: ['large pot', 'ladle', 'knife', 'cutting board', 'bowl', 'measuring cup']
    },
    {
      name: 'Artisan Homebrew Sake',
      description: 'Brew your own crisp, floral sake at home with this approachable, step-by-step guide.',
      photo: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80',
      ingredients: [
        '2 cups sushi rice',
        '1 packet sake yeast',
        'Filtered water',
        '1 cup koji rice',
        'Clean fermenting jar'
      ],
      instructions: `1. Cook and cool rice.
2. Combine rice, koji, and yeast in jar; add water to cover.
3. Ferment at room temp for 2 weeks, stirring daily.
4. Strain and bottle. Chill before serving.`,
      equipment: ['rice cooker', 'fermenting jar', 'spoon', 'strainer', 'measuring cup', 'bowl']
    },
    {
      name: 'Artisan Homebrew Kahlua',
      description: 'Craft a rich, coffee-infused liqueur with vanilla and rum—perfect for cocktails or sipping.',
      photo: 'https://images.unsplash.com/photo-1514361892635-cebb9b6c2bdf?auto=format&fit=crop&w=600&q=80',
      ingredients: [
        '2 cups strong brewed coffee',
        '2 cups sugar',
        '2 cups vodka or light rum',
        '1 vanilla bean'
      ],
      instructions: `1. Dissolve sugar in hot coffee; cool.
2. Add vodka/rum and split vanilla bean.
3. Pour into bottle and let steep 2 weeks.
4. Strain before serving.`,
      equipment: ['coffee maker', 'bottle', 'measuring cup', 'spoon', 'strainer', 'pot']
    },
    {
      name: 'Maine Blueberry Pie',
      description: 'Sweet, wild Maine blueberries in a flaky crust. The ultimate New England dessert.',
      photo: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80',
      ingredients: [
        '2 cups wild blueberries',
        '3/4 cup sugar',
        '2 tbsp cornstarch',
        '1 lemon, juiced',
        '1 pie crust (top & bottom)'
      ],
      instructions: `1. Toss berries with sugar, cornstarch, and lemon juice.
2. Fill bottom crust, top with crust, crimp edges.
3. Bake at 400°F for 40 min or until golden.`,
      equipment: ['pie pan', 'oven', 'mixing bowl', 'spoon', 'measuring cup', 'knife']
    }
  ];

  const [recipes, setLocalRecipes] = useState<Recipe[]>(() => starterRecipes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState<Recipe>(emptyRecipe);
  const [currentRecipeIdx, setCurrentRecipeIdx] = useState(0);

  // Helper: convert Recipe[] to RecipeCard[] for context
  function toRecipeCardArray(recipes: Recipe[]): import('../components/RecipeMatcherModal').RecipeCard[] {
    return recipes.map((r, idx) => ({
      id: r.name.replace(/\s+/g, '-').toLowerCase() + '-' + idx, // crude unique id
      title: r.name,
      image: r.photo || '',
      ingredients: r.ingredients || [],
      instructions: r.instructions || '',
      equipment: r.equipment || [],
      // Optionally add more fields as needed
    }));
  }

  // Sync local recipes to RecipeContext for modal multi-select
  useEffect(() => {
    setRecipes(toRecipeCardArray(recipes));
  }, [recipes, setRecipes]);

  // Freddie context: set page on mount
  const { updateContext } = useFreddieContext();
  useEffect(() => {
    updateContext({ page: 'MyCookBook' });
  }, [updateContext]);



  const openAddModal = () => {
    setForm(emptyRecipe);
    setEditingIdx(null);
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    setForm(recipes[idx]);
    setEditingIdx(idx);
    setModalOpen(true);
  };

  // Save or edit a recipe and update both local and context state
  const saveRecipe = () => {
    if (!form.name.trim()) return;
    let updated;
    if (editingIdx !== null) {
      updated = recipes.map((r, i) => (i === editingIdx ? form : r));
    } else {
      updated = [...recipes, form];
    }
    setLocalRecipes(updated);
    setRecipes(toRecipeCardArray(updated));
    setModalOpen(false);
    setForm(emptyRecipe);
    setEditingIdx(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const deleteRecipe = (idx: number) => {
    const updated = recipes.filter((_, i) => i !== idx);
    setLocalRecipes(updated);
    setRecipes(toRecipeCardArray(updated));
  };

  // Keep currentRecipeIdx in bounds when recipes are added or deleted
  useEffect(() => {
    if (currentRecipeIdx >= recipes.length) {
      setCurrentRecipeIdx(Math.max(0, recipes.length - 1));
    }
  }, [recipes, currentRecipeIdx]);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
      {/* Main content below */}
      {/* Chef of the Day Quote */}
      <div className="mb-6 p-4 border-l-4 border-seafoam rounded flex items-center">
        <div className="mr-4 text-3xl" role="img" aria-label="chef-hat">👨‍🍳</div>
        <div>
          <div className="italic text-lg mb-1">“{getChefQuoteOfTheDay().quote}”</div>
          <div className="font-retro text-seafoam font-bold text-right">— {getChefQuoteOfTheDay().chef}</div>
        </div>
      </div>

      {/* Digital Cookbook Grid */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-retro">My Digital Cookbook</h2>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-seafoam text-maineBlue font-bold hover:bg-maineBlue hover:text-seafoam transition-colors"
            onClick={openAddModal}
          >
            Create Collection
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-seafoam text-maineBlue font-bold hover:bg-maineBlue hover:text-seafoam transition-colors"
            onClick={() => {
              // Defensive: only proceed if recipes exist
              if (recipes.length > 0) {
                const current = recipes[currentRecipeIdx];
                // Map local Recipe to RecipeCard shape
                // Auto-fill equipment if missing
                const getAutoEquipment = (recipe: Recipe) => {
                  if (recipe.equipment && recipe.equipment.length > 0) return recipe.equipment;
                  const name = recipe.name.toLowerCase();
                  if (name.includes('chowder')) return ['large pot', 'ladle', 'knife', 'cutting board', 'bowl', 'measuring cup'];
                  if (name.includes('sake')) return ['rice cooker', 'fermenting jar', 'spoon', 'strainer', 'measuring cup', 'bowl'];
                  if (name.includes('kahlua')) return ['coffee maker', 'bottle', 'measuring cup', 'spoon', 'strainer', 'pot'];
                  if (name.includes('pie')) return ['pie pan', 'oven', 'mixing bowl', 'spoon', 'measuring cup', 'knife'];
                  // fallback
                  return ['pot', 'knife', 'cutting board', 'bowl'];
                };
                const fullRecipe = {
                  id: `${current.name.replace(/\s+/g, '-')}-${currentRecipeIdx}`,
                  title: current.name,
                  image: current.photo || '',
                  ingredients: current.ingredients || [],
                  instructions: current.instructions || '',
                  equipment: getAutoEquipment(current),
                  // Tutorials: generate same as RecipeMatcherModal.generateTutorials
                  tutorials: [
                    {
                      title: `Equipment: Using the right tools for ${current.name}`,
                      desc: `Learn how to use the main equipment needed for this dish.`
                    },
                    {
                      title: `Ingredient Prep: Preparing the main ingredient`,
                      desc: `How to prep the main ingredient for this recipe.`
                    },
                    {
                      title: `Recipe: ${current.name}`,
                      desc: current.instructions || ''
                    }
                  ]
                };
                setSelectedRecipe(fullRecipe);
                navigate('/culinary-school');
              }
            }}
          >
            🍳 Cook Me
          </button>
        </div>
      </div>
      {recipes.length === 0 ? (
        <div className="text-gray-400 italic">No recipes yet. Add your first recipe!</div>
      ) : (
        <div className="flex flex-col items-center">
          <RecipeCard recipe={recipes[currentRecipeIdx]} />
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
              onClick={() => setCurrentRecipeIdx(idx => Math.max(0, idx - 1))}
              disabled={currentRecipeIdx === 0}
            >
              Previous
            </button>
            <span className="text-lg font-retro text-maineBlue">
              Recipe {currentRecipeIdx + 1} of {recipes.length}
            </span>
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
              onClick={() => setCurrentRecipeIdx(idx => Math.min(recipes.length - 1, idx + 1))}
              disabled={currentRecipeIdx === recipes.length - 1}
            >
              Next
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-seafoam text-maineBlue font-bold hover:bg-maineBlue hover:text-seafoam transition-colors"
              onClick={() => openEditModal(currentRecipeIdx)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 rounded bg-seafoam text-maineBlue font-bold hover:bg-maineBlue hover:text-seafoam transition-colors"
              onClick={() => alert('Add to Collection coming soon!')}
            >
              + Add to Collection
            </button>
            <button
              className="px-3 py-1 rounded bg-lobsterRed text-white font-bold hover:bg-red-700 transition-colors"
              onClick={() => deleteRecipe(currentRecipeIdx)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import MyCookBookVideoModals from './MyCookBookVideoModals';

// RecipeCard component for flipping recipe cards
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full max-w-3xl min-h-[350px]">
      {/* Left Page */}
      <div className="flex-1 p-6 bg-weatheredWhite border-r border-gray-200 flex flex-col">
        {recipe.photo && (
          <img
            src={recipe.photo}
            alt={recipe.name}
            className="rounded-lg w-full h-32 object-cover mb-4"
          />
        )}
        <h3 className="font-bold text-xl mb-1 text-maineBlue">{recipe.name}</h3>
        <div className="text-gray-600 mb-2 text-base">{recipe.description}</div>
        <div className="font-semibold mb-1 mt-2">Ingredients:</div>
        <ul className="list-disc list-inside text-[15px] leading-6 text-gray-700 mb-2">
          {recipe.ingredients?.length ? (
            recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
          ) : (
            <li className="italic text-gray-400">No ingredients listed.</li>
          )}
        </ul>
      </div>
      {/* Right Page */}
      <div className="flex-1 p-6 bg-white flex flex-col">
        <h3 className="font-bold text-xl mb-2 text-maineBlue">Instructions</h3>
        <div className="text-gray-700 whitespace-pre-line text-[15px] leading-7 flex-1">
          {recipe.instructions || (
            <span className="italic text-gray-400">No instructions provided.</span>
          )}
        </div>
        {/* Equipment Section */}
        {recipe.equipment && recipe.equipment.length > 0 && (
          <>
            <div className="font-semibold mt-4 mb-1">Equipment Needed:</div>
            <ul className="list-disc list-inside text-[15px] leading-6 text-gray-700 mb-2">
              {recipe.equipment.map((eq, i) => (
                <li key={i}>{eq}</li>
              ))}
            </ul>
          </>
        )}
        {(!recipe.equipment || recipe.equipment.length === 0) && (
          <div className="italic text-gray-400 mt-2">No equipment listed.</div>
        )}
      </div>
    </div>
  );
}

export default MyCookBook;
