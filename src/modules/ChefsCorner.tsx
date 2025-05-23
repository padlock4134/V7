import React, { useState } from 'react';
import ChefFreddieWidget from './ChefFreddieWidget';
import { useEffect } from 'react';
import { useFreddieContext } from '../components/FreddieContext';
import { fetchKitchen } from './kitchenSupabase';
import CookBookImportModal from '../components/CookBookImportModal';

import DepartmentDirectory from '../components/MarketDirectory';

const ChefsCorner = () => {
  const { updateContext } = useFreddieContext();
  useEffect(() => {
    updateContext({ page: 'ChefsCorner' });
  }, [updateContext]);

  // Shopping list state
  const [shoppingList, setShoppingList] = useState<string[]>([]);


  // Modal state for CookBook import
  const [cookbookModalOpen, setCookbookModalOpen] = useState(false);



  // Open modal for My CookBook import
  const importFromCookBook = () => setCookbookModalOpen(true);

  // Handler for modal import - only add ingredients not in kitchen
  const handleCookBookImport = async (ingredientNames: string[]) => {
    try {
      const kitchenIngredients = await fetchKitchen();
      let kitchenNames: string[] = [];
      if (Array.isArray(kitchenIngredients) && kitchenIngredients.length > 0) {
        if (kitchenIngredients.every(i => typeof i === 'string')) {
          kitchenNames = kitchenIngredients as string[];
        } else if (kitchenIngredients.every(i => typeof i === 'object' && i !== null && 'name' in i)) {
          kitchenNames = (kitchenIngredients as { name: string }[]).map(i => i.name);
        } else {
          kitchenNames = [];
        }
      }
      const missing = ingredientNames.filter(name => !kitchenNames.map(n => n.trim().toLowerCase()).includes(name.trim().toLowerCase()));
      setShoppingList(Array.from(new Set([...shoppingList, ...missing].map(i => i.trim()).filter(Boolean))));
    } catch (err) {
      alert('Could not compare with kitchen: ' + (err as Error).message);
      // fallback: add all
      setShoppingList(Array.from(new Set([...shoppingList, ...ingredientNames].map(i => i.trim()).filter(Boolean))));
    }
  };



  return (
    <div className="max-w-7xl mx-auto mt-8 bg-weatheredWhite p-6 rounded shadow">
      <div className="chefs-corner-root relative flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <header className="chefs-corner-header mb-6 flex flex-col items-center">
            <h1 className="text-3xl font-retro text-maineBlue mb-2">Chefs Corner</h1>
            <p className="text-lg text-gray-700 mb-4 text-center">Shop the freshest ingredients, meal kits, and more—all with a Maine Fish Market flair.</p>
          </header>




          {/* Shopping List - now above markets */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-maineBlue mb-3">Shopping List</h2>
            <div className="bg-sand rounded shadow p-4 flex flex-col items-center">
              <p className="mb-2 text-gray-700 text-center">Import your saved recipes from My CookBook and shop everything you need in one click!</p>
              <button onClick={importFromCookBook} className="bg-maineBlue text-seafoam px-4 py-2 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors w-full">Import from My CookBook</button>
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

          {/* Departments Directory */}
          <DepartmentDirectory />

          {/* Car Hop / Meal Kit Delivery Guy */}
          <section className="mb-8">
            <div className="bg-seafoam rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-2xl font-bold text-maineBlue mb-2">Car Hop / Meal Kit Delivery Guy</div>
              <div className="text-gray-700 mb-4 text-center">
                Get your groceries and meal kits delivered right to your door by our friendly local delivery team!
              </div>
            </div>
          </section>

          {/* Partner/Promo Banner */}
          <section className="mb-8">
            <div className="bg-maineBlue rounded-lg p-4 text-center text-seafoam font-bold text-lg shadow">
              <span>Coming soon: Shop with your favorite grocery partners!</span>
            </div>
          </section>
        </div>



        <ChefFreddieWidget />
      </div>
    </div>
  );
};

export default ChefsCorner;

