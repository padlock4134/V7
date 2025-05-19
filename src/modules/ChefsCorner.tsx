import React, { useState } from 'react';
import ChefFreddieWidget from './ChefFreddieWidget';
import { useEffect } from 'react';
import { useFreddieContext } from '../components/FreddieContext';
import { fetchKitchen } from './kitchenSupabase';
import CookBookImportModal from '../components/CookBookImportModal';

// Placeholder mock data for featured products and categories
const allProducts = [
  { name: 'Fresh Maine Lobster', price: '$19.99/lb', img: '/market/lobster.png', desc: 'Caught this morning—taste the Maine coast!', category: 'Seafood' },
  { name: 'Clam Chowder Kit', price: '$14.99', img: '/market/chowder-kit.png', desc: 'Everything you need for authentic chowder.', category: 'Meal Kits' },
  { name: 'Seaweed Snack Pack', price: '$4.99', img: '/market/seaweed.png', desc: 'Local, salty, and delicious.', category: 'Pantry' },
  { name: 'Blueberry Pie', price: '$8.99', img: '/market/blueberry-pie.png', desc: 'Classic Maine dessert.', category: 'Bakery' },
  { name: 'Kale', price: '$2.49/bunch', img: '/market/kale.png', desc: 'Fresh and local.', category: 'Produce' },
  { name: 'Cod Fillet', price: '$12.99/lb', img: '/market/cod.png', desc: 'Flaky, wild-caught cod.', category: 'Seafood' },
  { name: 'Lobster Roll Kit', price: '$24.99', img: '/market/lobster-roll-kit.png', desc: 'Make lobster rolls at home!', category: 'Meal Kits' },
];
const categories = [
  { label: 'Seafood', icon: '🦞' },
  { label: 'Produce', icon: '🥦' },
  { label: 'Bakery', icon: '🍞' },
  { label: 'Pantry', icon: '🧂' },
  { label: 'Meal Kits', icon: '🍲' },
];

const ChefsCorner = () => {
  const { updateContext } = useFreddieContext();
  useEffect(() => {
    updateContext({ page: 'ChefsCorner' });
  }, [updateContext]);

  // Shopping list state (mock for now)
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal state for CookBook import
  const [cookbookModalOpen, setCookbookModalOpen] = useState(false);

  // Real import from My Kitchen (Supabase)
  const importFromKitchen = async () => {
    try {
      const ingredients = await fetchKitchen();
      // Accept both string and object (Ingredient) arrays
      let names: string[] = [];
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        if (ingredients.every(i => typeof i === 'string')) {
          names = ingredients as string[];
        } else if (ingredients.every(i => typeof i === 'object' && i !== null && 'name' in i)) {
          names = (ingredients as { name: string }[]).map(i => i.name);
        } else {
          names = [];
        }
      }
      setShoppingList(Array.from(new Set(names.map(n => n.trim()).filter(Boolean))));
    } catch (err) {
      alert('Could not import from My Kitchen: ' + (err as Error).message);
    }
  };

  // Open modal for My CookBook import
  const importFromCookBook = () => setCookbookModalOpen(true);

  // Handler for modal import
  const handleCookBookImport = (ingredientNames: string[]) => {
    setShoppingList(Array.from(new Set([...shoppingList, ...ingredientNames].map(i => i.trim()).filter(Boolean))));
  };

  // Filter products by shopping list and category
  let filteredProducts = allProducts;
  if (shoppingList.length > 0) {
    filteredProducts = filteredProducts.filter(p => shoppingList.includes(p.name));
  }
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
      <div className="chefs-corner-root relative flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <header className="chefs-corner-header mb-6 flex flex-col items-center">
            <h1 className="text-3xl font-retro text-maineBlue mb-2">Chefs Corner</h1>
            <p className="text-lg text-gray-700 mb-4 text-center">Shop the freshest ingredients, meal kits, and more—all with a Maine Fish Market flair.</p>
          </header>

          {/* Shop by Category */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-maineBlue mb-3">Shop by Category</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button
                  key={cat.label}
                  className={`bg-seafoam text-maineBlue px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-maineBlue hover:bg-maineBlue hover:text-seafoam transition-colors ${selectedCategory === cat.label ? 'ring-2 ring-lobsterRed' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </section>

          {/* Featured Products (filtered) */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-maineBlue mb-3">{shoppingList.length > 0 ? 'Your Market Picks' : 'Featured Products'}</h2>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 italic">No products match your shopping list or category.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((item) => (
                  <div key={item.name} className="bg-sand rounded shadow p-4 flex flex-col items-center">
                    <img src={item.img} alt={item.name} className="w-24 h-24 object-contain mb-2" />
                    <div className="font-semibold text-lg text-maineBlue">{item.name}</div>
                    <div className="text-gray-700 mb-1">{item.desc}</div>
                    <div className="font-bold text-lobsterRed mb-2">{item.price}</div>
                    <button className="bg-maineBlue text-seafoam px-4 py-1 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors">Add to Cart</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Partner/Promo Banner */}
          <section className="mb-8">
            <div className="bg-maineBlue rounded-lg p-4 text-center text-seafoam font-bold text-lg shadow">
              <span>Coming soon: Shop with your favorite grocery partners!</span>
            </div>
          </section>
        </div>

        {/* Shopping List Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <section className="mb-8 sticky top-8">
            <h2 className="text-xl font-bold text-maineBlue mb-3">Shopping List</h2>
            <div className="bg-sand rounded shadow p-4 flex flex-col items-center">
              <p className="mb-2 text-gray-700 text-center">Import your saved recipes or ingredient lists from My Kitchen or My CookBook and shop everything in one click!</p>
              <button onClick={importFromKitchen} className="bg-maineBlue text-seafoam px-4 py-2 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors w-full">Import from My Kitchen</button>
              <button onClick={importFromCookBook} className="mt-2 bg-maineBlue text-seafoam px-4 py-2 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors w-full">Import from My CookBook</button>
              <CookBookImportModal
                open={cookbookModalOpen}
                onClose={() => setCookbookModalOpen(false)}
                onImport={handleCookBookImport}
              />
              <ul className="mt-4 w-full">
                {shoppingList.length === 0 ? (
                  <li className="text-gray-400 italic text-center">No items yet. Import to get started!</li>
                ) : (
                  shoppingList.map(item => (
                    <li key={item} className="flex items-center justify-between py-1 border-b border-seafoam last:border-b-0">
                      <span>{item}</span>
                      <button
                        className="text-lobsterRed font-bold ml-2 hover:underline"
                        onClick={() => setShoppingList(shoppingList.filter(i => i !== item))}
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
              {shoppingList.length > 0 && (
                <button className="mt-4 bg-lobsterRed text-weatheredWhite px-4 py-2 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors w-full">Checkout</button>
              )}
            </div>
          </section>
        </aside>

        <ChefFreddieWidget />
      </div>
    </div>
  );
};

export default ChefsCorner;

