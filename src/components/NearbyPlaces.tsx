import React, { useEffect, useState } from 'react';

type PlaceResult = {
  name: string;
  vicinity: string;
  place_id: string;
  types: string[];
};

const NearbyPlaces: React.FC = () => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'prompt'|'granted'|'denied'>('prompt');
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);

  // Handle location permission and fetching
  const requestLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationStatus('denied');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('granted');
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please enable location services.');
        setLocationStatus('denied');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Fetch places once we have coordinates
  useEffect(() => {
    if (!coordinates) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const radius = 24140; // 15 miles in meters
        const response = await fetch(
          `/.netlify/functions/get-places?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${radius}&type=supermarket|grocery_or_supermarket|bakery|food|store`
        );
        const data = await response.json();
        
        if (!data.results) {
          throw new Error('No results found');
        }
        
        setPlaces(data.results);
      } catch (err) {
        setError('Failed to fetch nearby places. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [coordinates]);

  if (locationStatus === 'prompt') {
    return (
      <div className="my-8 text-center">
        <h2 className="text-xl font-bold text-maineBlue mb-4">Find Markets Near You</h2>
        <p className="mb-4 text-gray-600">We'll help you discover local markets within 15 miles of your location.</p>
        <button
          onClick={requestLocation}
          className="bg-maineBlue text-seafoam px-6 py-3 rounded-lg font-bold hover:bg-seafoam hover:text-maineBlue transition-colors"
        >
          Share Your Location
        </button>
      </div>
    );
  }

  if (locationStatus === 'denied') {
    return (
      <div className="my-8 text-center">
        <h2 className="text-xl font-bold text-maineBlue mb-4">Location Access Needed</h2>
        <p className="text-gray-600">
          Please enable location services to find markets near you. 
          You can update your location settings in your browser preferences.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-8 text-center">
        <h2 className="text-xl font-bold text-maineBlue mb-4">Finding Markets Near You</h2>
        <p className="text-gray-600">Searching within 15 miles of your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 text-center">
        <h2 className="text-xl font-bold text-maineBlue mb-4">Oops!</h2>
        <p className="text-red-500">{error}</p>
        <button
          onClick={requestLocation}
          className="mt-4 bg-maineBlue text-seafoam px-4 py-2 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-maineBlue">Markets Near You</h2>
        <button
          onClick={requestLocation}
          className="text-sm bg-seafoam text-maineBlue px-3 py-1 rounded hover:bg-maineBlue hover:text-seafoam transition-colors"
        >
          Update Location
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {places.map(place => (
          <div key={place.place_id} className="bg-white rounded shadow p-4">
            <div className="font-retro font-bold">{place.name}</div>
            <div className="text-gray-600">{place.vicinity}</div>
          </div>
        ))}
      </div>
      {places.length === 0 && (
        <div className="text-gray-400 italic text-center">
          No markets found within 15 miles of your location.
        </div>
      )}
    </div>
  );
};

export default NearbyPlaces;
