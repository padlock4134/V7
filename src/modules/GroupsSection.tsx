import React from 'react';

const mockGroups = [
  { id: 1, name: 'Seafood Lovers', members: 82 },
  { id: 2, name: 'Baking Enthusiasts', members: 47 },
  { id: 3, name: 'New England Classics', members: 34 },
];

const GroupsSection = () => (
  <div className="groups-section bg-weatheredWhite p-4 rounded shadow mb-6">
    <h3 className="font-bold text-lg mb-2 text-maineBlue">Groups</h3>
    <ul className="space-y-2">
      {mockGroups.map(g => (
        <li key={g.id} className="flex justify-between items-center bg-sand p-2 rounded">
          <span>{g.name}</span>
          <span className="text-xs text-gray-500">{g.members} members</span>
          <button className="ml-2 bg-seafoam text-maineBlue px-3 py-1 rounded text-xs font-bold">Join</button>
        </li>
      ))}
    </ul>
  </div>
);

export default GroupsSection;
