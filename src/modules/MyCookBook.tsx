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
  id: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(2); // Changed from 6 to 2 to show just 1 row of 2 cards
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Load recipes and set page context on mount
  const { updateContext } = useFreddieContext();
  useEffect(() => {
    updateContext({ page: 'MyCookBook' });
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const savedRecipes = await fetchCookbook();
        const converted = savedRecipes.map(r => ({
          id: r.id,
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

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeCategory === 'All') return matchesSearch;
    
    // Simple category detection based on ingredients
    // You can enhance this with more sophisticated categorization
    const hasSeafood = recipe.ingredients?.some(i => 
      ['fish', 'salmon', 'tuna', 'shrimp', 'lobster', 'crab', 'seafood'].some(term => 
        i.toLowerCase().includes(term)
      )
    );
    
    const hasMeat = recipe.ingredients?.some(i => 
      ['beef', 'chicken', 'pork', 'lamb', 'meat', 'steak', 'turkey'].some(term => 
        i.toLowerCase().includes(term)
      )
    );
    
    const hasVegetable = recipe.ingredients?.some(i => 
      ['vegetable', 'carrot', 'broccoli', 'spinach', 'kale', 'lettuce', 'vegan', 'vegetarian'].some(term => 
        i.toLowerCase().includes(term)
      )
    );
    
    const hasDessert = recipe.ingredients?.some(i => 
      ['sugar', 'chocolate', 'dessert', 'cake', 'cookie', 'sweet', 'pie', 'ice cream'].some(term => 
        i.toLowerCase().includes(term)
      )
    );
    
    switch(activeCategory) {
      case 'Seafood': return hasSeafood && matchesSearch;
      case 'Meat': return hasMeat && matchesSearch;
      case 'Vegetarian': return hasVegetable && !hasMeat && !hasSeafood && matchesSearch;
      case 'Dessert': return hasDessert && matchesSearch;
      default: return matchesSearch;
    }
  });

  // Get current recipes for pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Categories for filtering
  const categories = ['All', 'Seafood', 'Meat', 'Vegetarian', 'Dessert'];

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

      {/* Digital Cookbook Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-retro">My Digital Cookbook</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              className="pl-8 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-seafoam"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <div className="absolute left-2 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1); // Reset to first page on category change
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category
                  ? 'bg-seafoam text-maineBlue font-medium'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Count */}
      <div className="text-sm text-gray-500 mb-4">
        {filteredRecipes.length === 0 
          ? 'No recipes found' 
          : `Showing ${indexOfFirstRecipe + 1}-${Math.min(indexOfLastRecipe, filteredRecipes.length)} of ${filteredRecipes.length} recipes`}
      </div>

      {/* Digital Cookbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {currentRecipes.length === 0 ? (
          <div className="col-span-2 text-gray-400 italic text-center py-8">
            {recipes.length === 0 
              ? 'No recipes yet. Add your first recipe!' 
              : 'No recipes match your search criteria.'}
          </div>
        ) : currentRecipes.map((recipe, idx) => (
          <div key={idx} className="group h-[400px] [perspective:1000px]">
            <div className="relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <div className="absolute inset-0 bg-white p-4 rounded-lg shadow-md">
                {recipe.photo && (
                  <img 
                    src={recipe.photo} 
                    alt={recipe.name} 
                    className="w-full h-32 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{recipe.name}</h3>
                <div className="text-gray-600 overflow-hidden">
                  <h4 className="font-semibold mb-1">Ingredients:</h4>
                  <ul className="list-disc pl-4 max-h-[100px] overflow-y-auto">
                    {recipe.ingredients?.map((ingredient, i) => (
                      <li key={i} className="line-clamp-1">{ingredient}</li>
                    ))}
                  </ul>
                  
                  {recipe.equipment && recipe.equipment.length > 0 && (
                    <>
                      <h4 className="font-semibold mb-1 mt-2">Equipment Needed:</h4>
                      <ul className="list-disc pl-4 max-h-[60px] overflow-y-auto">
                        {recipe.equipment.map((item, i) => (
                          <li key={i} className="line-clamp-1">{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 h-full w-full rounded-xl bg-white p-4 shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{recipe.name}</h3>
                <div className="text-gray-600 overflow-y-auto h-[280px] mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <h4 className="font-semibold mb-1">Instructions:</h4>
                  <p className="whitespace-pre-wrap">{recipe.instructions}</p>
                </div>
                <div className="flex justify-between items-center absolute bottom-4 left-4 right-4">
                  <button
                    onClick={async () => {
                      try {
                        const recipeId = recipe.id;
                        await removeRecipeFromCookbook(recipeId);
                        setLocalRecipes(recipes.filter(r => r.id !== recipeId));
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
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-seafoam text-maineBlue hover:bg-maineBlue hover:text-seafoam'
              } transition-colors`}
            >
              ←
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              // Show limited page numbers with ellipsis for better UX
              if (
                i === 0 || // First page
                i === totalPages - 1 || // Last page
                (i >= currentPage - 2 && i <= currentPage) || // 2 pages before current
                (i >= currentPage && i <= currentPage + 1) // 1 page after current
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-maineBlue text-seafoam font-medium'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === 1 && currentPage > 3) || 
                (i === totalPages - 2 && currentPage < totalPages - 2)
              ) {
                // Show ellipsis
                return <span key={i} className="mx-1">...</span>;
              }
              return null;
            })}
            
            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-seafoam text-maineBlue hover:bg-maineBlue hover:text-seafoam'
              } transition-colors`}
            >
              →
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MyCookBook;
