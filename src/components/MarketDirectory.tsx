import React, { useEffect, useState } from 'react';

// Types for market info
export const DEPARTMENT_TYPES = [
  { key: 'grocery', label: 'Grocery', icon: '🛒', placeTypes: ['supermarket', 'grocery_or_supermarket'] },
  { key: 'produce', label: 'Produce', icon: '🥦', placeTypes: ['supermarket', 'grocery_or_supermarket'] },
  { key: 'bakery', label: 'Bakery', icon: '🍞', placeTypes: ['bakery'] },
  { key: 'butcher', label: 'Butcher', icon: '🥩', placeTypes: ['store'] },
  { key: 'seafood', label: 'Seafood', icon: '🦐', placeTypes: ['store'] },
  { key: 'dairy', label: 'Dairy', icon: '🧀', placeTypes: ['store'] },
];

interface Place {
  name: string;
  vicinity: string;
  place_id: string;
  types: string[];
}

export const DepartmentsGrid: React.FC = () => {
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
          `/.netlify/functions/get-places?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${radius}&type=supermarket|grocery_or_supermarket|bakery|store|food`
        );
        
        const data = await response.json();
        console.log('Places API response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || `API returned ${response.status}`);
        }
        
        if (data.status === 'OK' && data.results) {
          setPlaces(data.results);
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

  const getPlacesForDepartment = (dept: typeof DEPARTMENT_TYPES[0]) => {
    return places.filter(place => 
      place.types.some(type => dept.placeTypes.includes(type))
    );
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
                    <div key={place.place_id} className="bg-sand rounded-lg p-4">
                      <h4 className="font-bold text-maineBlue">{place.name}</h4>
                      <p className="text-gray-600 text-sm">{place.vicinity}</p>
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

const DepartmentDirectory: React.FC = () => <DepartmentsGrid />;

export default DepartmentDirectory;
