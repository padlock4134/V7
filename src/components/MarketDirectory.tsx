import React, { useEffect, useState } from 'react';

// Types for market info
export const DEPARTMENT_TYPES = [
  { key: 'grocery', label: 'Grocery', icon: '🛒', placeTypes: ['supermarket', 'convenience_store'], keywords: ['grocery', 'market', 'food', 'store', 'co-op', 'coop', 'natural', 'organic'] },
  { key: 'produce', label: 'Produce', icon: '🥦', placeTypes: ['supermarket', 'convenience_store'], keywords: ['produce', 'fruit', 'vegetable', 'farm', 'organic', 'farmers', 'garden', 'orchard', 'berry', 'apple', 'greengrocer', 'csa', 'stand'] },
  { key: 'bakery', label: 'Bakery', icon: '🍞', placeTypes: ['bakery'], keywords: ['bakery', 'bread', 'pastry', 'cake', 'donut', 'bake', 'bagel', 'cookie', 'pie', 'patisserie', 'boulangerie', 'confection'] },
  { key: 'butcher', label: 'Meat', icon: '🥩', placeTypes: ['supermarket'], keywords: ['meat', 'butcher', 'steak', 'beef', 'poultry', 'pat', 'pats', 'sausage', 'deli', 'chop', 'prime', 'angus', 'pork', 'chicken', 'lamb'] },
  { key: 'seafood', label: 'Seafood', icon: '🐟', placeTypes: ['supermarket'], keywords: ['seafood', 'fish', 'shellfish', 'lobster', 'crab', 'harbor', 'ocean', 'sea', 'marine', 'catch', 'oyster', 'clam', 'shrimp', 'mussel', 'fishmonger', 'fishery'] },
  { key: 'dairy', label: 'Dairy', icon: '🥛', placeTypes: ['supermarket', 'convenience_store'], keywords: ['dairy', 'milk', 'cheese', 'yogurt', 'creamery', 'cream', 'ice cream', 'farm', 'butter', 'fromagerie'] },
];

// Maximum number of places to show per category
const MAX_PLACES_PER_CATEGORY = 5;

// List of big box retailers to exclude
const BIG_BOX_RETAILERS = ['walmart', 'costco', 'bj', 'bjs', 'sams club', 'sam\'s club', 'best buy', 'target', 'home depot', 'lowe\'s', 'lowes'];

// List of generic grocery chains that should not be considered specialized
const GENERIC_GROCERY_CHAINS = ['trader joe', 'whole foods', 'hannaford', 'shaw', 'market basket', 'stop & shop', 'kroger', 'publix', 'albertsons', 'safeway', 'giant', 'food lion'];

// Known specialized markets to prioritize
const SPECIALIZED_MARKETS = {
  'harbor fish': 'seafood',
  'pats meat': 'butcher',
  'pat meat': 'butcher',
  'meat market': 'butcher',
  'butcher shop': 'butcher',
  'fish market': 'seafood',
  'seafood market': 'seafood',
  'farmers market': 'produce',
  'farm stand': 'produce',
  'bakery': 'bakery',
  'dairy farm': 'dairy',
  'creamery': 'dairy',
  'cheese shop': 'dairy'
};

// Business type indicators that strongly suggest specialization
const BUSINESS_TYPE_INDICATORS = {
  'butcher': 'butcher',
  'meat': 'butcher',
  'fishmonger': 'seafood',
  'fish': 'seafood',
  'seafood': 'seafood',
  'bakery': 'bakery',
  'patisserie': 'bakery',
  'farm': 'produce',
  'creamery': 'dairy',
  'dairy': 'dairy',
  'produce': 'produce',
  'greengrocer': 'produce'
};

interface Place {
  name: string;
  vicinity: string;
  place_id: string;
  types: string[];
  website: string | null;
  assignedCategory?: string; // Track which category this place is assigned to
  isSpecialized?: boolean; // Whether this is a specialized market vs. general grocery
}

const MarketDirectory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<typeof DEPARTMENT_TYPES[0] | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please enable location services.');
      }
    );
  }, []);

  // Fetch places when coordinates are available
  useEffect(() => {
    if (!coordinates) return;

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const radius = 24140; // 15 miles in meters
        const response = await fetch(
          `/.netlify/functions/get-places?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${radius}&type=supermarket,convenience_store,bakery`
        );
        
        const data = await response.json();
        console.log('Places API response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || `API returned ${response.status}`);
        }
        
        if (data.status === 'OK' && data.results) {
          // Filter out restaurants and big box retailers
          const filteredPlaces = data.results.filter(
            (place: Place) => 
              !place.types.some(type => type === 'restaurant' || type === 'meal_takeaway') &&
              !BIG_BOX_RETAILERS.some(storeName => place.name.toLowerCase().includes(storeName))
          );
          
          // Assign each place to its most appropriate category
          const categorizedPlaces = assignPlacesToCategories(filteredPlaces);
          setPlaces(categorizedPlaces);
        }
      } catch (err) {
        console.error('Places fetch error:', err);
        setError('Failed to fetch nearby places.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [coordinates]);

  const openModal = (dept: typeof DEPARTMENT_TYPES[0]) => {
    setSelectedDept(dept);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // Assign places to their most appropriate category based on name and types
  const assignPlacesToCategories = (places: Place[]): Place[] => {
    const result = [...places];
    
    // First pass: Check for exact matches in name
    result.forEach(place => {
      const nameLower = place.name.toLowerCase();
      
      // Check if it's a generic grocery chain - never mark these as specialized
      const isGenericChain = GENERIC_GROCERY_CHAINS.some(chain => nameLower.includes(chain));
      if (isGenericChain) {
        place.assignedCategory = 'grocery';
        place.isSpecialized = false;
        return; // Skip further processing for generic chains
      }
      
      // Check for business type indicators in the name
      for (const [indicator, category] of Object.entries(BUSINESS_TYPE_INDICATORS)) {
        // Look for patterns like "X Market", "X Shop", etc.
        const businessPatterns = [
          `${indicator} market`, 
          `${indicator} shop`, 
          `${indicator} store`,
          `${indicator} specialty`,
          `${indicator}'s`,
          `${indicator}s`
        ];
        
        if (businessPatterns.some(pattern => nameLower.includes(pattern))) {
          place.assignedCategory = category;
          place.isSpecialized = true;
          return; // Skip further processing
        }
      }
      
      // Special case handling for known specialized markets
      for (const [marketName, category] of Object.entries(SPECIALIZED_MARKETS)) {
        if (nameLower.includes(marketName)) {
          place.assignedCategory = category;
          place.isSpecialized = true;
          return; // Skip further processing for this place
        }
      }
      
      // Special case handling for common patterns
      if (nameLower.includes('butcher') && !isGenericChain) {
        place.assignedCategory = 'butcher';
        place.isSpecialized = true;
      } 
      else if ((nameLower.includes('seafood') || nameLower.includes('fish') || nameLower.includes('lobster')) && 
               !isGenericChain) {
        place.assignedCategory = 'seafood';
        place.isSpecialized = true;
      }
      else if (nameLower.includes('farm') && 
              (nameLower.includes('dairy') || nameLower.includes('milk') || nameLower.includes('cheese')) &&
              !isGenericChain) {
        place.assignedCategory = 'dairy';
        place.isSpecialized = true;
      }
      else if ((nameLower.includes('farm') && 
               (nameLower.includes('produce') || nameLower.includes('fruit') || nameLower.includes('vegetable'))) &&
               !isGenericChain) {
        place.assignedCategory = 'produce';
        place.isSpecialized = true;
      }
      else if ((nameLower.includes('bakery') || nameLower.includes('bread') || nameLower.includes('pastry')) &&
               !isGenericChain) {
        place.assignedCategory = 'bakery';
        place.isSpecialized = true;
      }
      // If not a special case, check category keywords
      else if (!isGenericChain) {
        // Check if it's a farm - farms are always specialized
        if (nameLower.includes('farm')) {
          // Try to determine the farm type
          if (nameLower.includes('dairy') || nameLower.includes('milk') || nameLower.includes('cheese')) {
            place.assignedCategory = 'dairy';
            place.isSpecialized = true;
          } else {
            // Default farm to produce if not specified
            place.assignedCategory = 'produce';
            place.isSpecialized = true;
          }
        } else {
          // Check for other category keywords
          for (const dept of DEPARTMENT_TYPES) {
            if (dept.keywords.some(keyword => nameLower.includes(keyword))) {
              place.assignedCategory = dept.key;
              // If the place name contains specific keywords that strongly indicate specialization
              const specializationIndicators = ['specialty', 'artisan', 'gourmet', 'local', 'farm', 'fresh', 'organic', 'market', 'shop'];
              place.isSpecialized = specializationIndicators.some(indicator => nameLower.includes(indicator));
              break;
            }
          }
        }
      } else {
        // Generic chains are always assigned to grocery unless they have a specific department
        if (!place.assignedCategory) {
          place.assignedCategory = 'grocery';
          place.isSpecialized = false;
        }
      }
    });
    
    // Second pass: For places without an assigned category, use their types
    result.forEach(place => {
      if (!place.assignedCategory) {
        // For general supermarkets with no specific category, assign to grocery
        if (place.types.includes('supermarket')) {
          place.assignedCategory = 'grocery';
          place.isSpecialized = false;
        } else if (place.types.includes('bakery')) {
          place.assignedCategory = 'bakery';
          place.isSpecialized = true; // Bakeries are specialized
        } else if (place.types.includes('convenience_store')) {
          place.assignedCategory = 'grocery';
          place.isSpecialized = false;
        }
      }
    });
    
    return result;
  };

  const getPlacesForDepartment = (dept: typeof DEPARTMENT_TYPES[0]) => {
    // First, get places specifically assigned to this category
    let assignedPlaces = places.filter(place => place.assignedCategory === dept.key);
    
    // Sort places: specialized markets first, then general grocery stores
    assignedPlaces.sort((a, b) => {
      // First sort by specialized flag (specialized first)
      if (a.isSpecialized && !b.isSpecialized) return -1;
      if (!a.isSpecialized && b.isSpecialized) return 1;
      
      // If both are the same type, sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    // If we have assigned places, return up to MAX_PLACES_PER_CATEGORY
    if (assignedPlaces.length > 0) {
      return assignedPlaces.slice(0, MAX_PLACES_PER_CATEGORY);
    }
    
    // Fallback: If no places were specifically assigned to this category,
    // use the original type-based filtering, limited to MAX_PLACES_PER_CATEGORY
    const fallbackPlaces = places.filter(place => 
      place.types.some(type => dept.placeTypes.includes(type)) &&
      !GENERIC_GROCERY_CHAINS.some(chain => place.name.toLowerCase().includes(chain))
    );
    
    return fallbackPlaces.slice(0, MAX_PLACES_PER_CATEGORY);
  };

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
        {DEPARTMENT_TYPES.map(dep => (
          <button
            key={dep.key}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:bg-sand transition cursor-pointer focus:outline-none"
            onClick={() => openModal(dep)}
          >
            <span className="text-4xl mb-2">{dep.icon}</span>
            <span className="font-retro text-lg">{dep.label}</span>
          </button>
        ))}
      </div>
      {modalOpen && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <span className="text-5xl mb-4">{selectedDept.icon}</span>
            <h3 className="text-xl font-bold mb-2 text-maineBlue">{selectedDept.label} Options</h3>
            {loading ? (
              <p className="text-gray-600">Finding places near you...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="w-full mt-4 space-y-3">
                  {getPlacesForDepartment(selectedDept).map(place => (
                    <div 
                      key={place.place_id} 
                      className={`rounded-lg p-4 ${place.isSpecialized ? 'bg-sand' : 'bg-gray-50'}`}
                    >
                      <h4 className="font-bold text-maineBlue">{place.name}</h4>
                      <p className="text-gray-600 text-sm">{place.vicinity}</p>
                      {place.website && (
                        <a 
                          href={place.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-maineBlue hover:underline mt-1 inline-block"
                        >
                          Visit Website <span className="text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  ))}
                  {getPlacesForDepartment(selectedDept).length === 0 && (
                    <p className="text-gray-500 text-center italic">
                      No {selectedDept.label.toLowerCase()} locations found nearby.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketDirectory;
