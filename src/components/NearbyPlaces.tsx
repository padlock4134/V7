import React, { useEffect, useState } from 'react';

type PlaceResult = {
  name: string;
  vicinity: string;
  place_id: string;
  icon?: string;
  photos?: { photo_reference: string }[];
};

const NearbyPlaces: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const radius = 24140; // 15 miles in meters
        const type = 'supermarket|grocery_or_supermarket|bakery|store|food';
        const response = await fetch(`/.netlify/functions/get-places?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
        const data = await response.json();
        setPlaces(data.results || []);
      } catch (err: any) {
        setError('Failed to fetch places.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [lat, lng]);

  if (loading) return <div>Loading nearby markets...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-maineBlue mb-4">Markets Near You (15 miles)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {places.map(place => (
          <div key={place.place_id} className="bg-white rounded shadow p-4">
            <div className="font-retro font-bold">{place.name}</div>
            <div className="text-gray-600">{place.vicinity}</div>
          </div>
        ))}
      </div>
      {places.length === 0 && <div className="text-gray-400 italic">No markets found nearby.</div>}
    </div>
  );
};

export default NearbyPlaces;
