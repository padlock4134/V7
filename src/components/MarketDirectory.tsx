import React, { useEffect, useState } from 'react';

// Types for market info
const DEPARTMENT_TYPES = [
  // Top 4
  { key: 'deli', label: 'Deli' },
  { key: 'butcher', label: 'Butcher' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'beerSpirits', label: 'Beer & Spirits' },
  // Bottom 4
  { key: 'bakery', label: 'Bakery' },
  { key: 'dairy', label: 'Dairy' },
  { key: 'produce', label: 'Produce' },
  { key: 'grocery', label: 'Grocery' },
];

interface Department {
  name: string;
  description?: string;
  type: string;
  orderingUrl?: string;
}

const MOCK_DEPARTMENTS: Record<string, Department[]> = {
  deli: [
    { name: "Deli Counter", description: "Sliced Meats & Cheeses", type: "deli", orderingUrl: undefined }
  ],
  butcher: [
    { name: "Butcher", description: "Fresh Meats & Poultry", type: "butcher", orderingUrl: undefined }
  ],
  seafood: [
    { name: "Seafood Counter", description: "Fish & Shellfish", type: "seafood", orderingUrl: undefined }
  ],
  beerSpirits: [
    { name: "Beer & Spirits", description: "Craft Beer, Wine & Liquor", type: "beerSpirits", orderingUrl: undefined }
  ],
  bakery: [
    { name: "Bakery", description: "Fresh Baked Goods", type: "bakery", orderingUrl: undefined }
  ],
  dairy: [
    { name: "Dairy", description: "Milk, Cheese, Eggs", type: "dairy", orderingUrl: undefined }
  ],
  produce: [
    { name: "Fresh Produce", description: "Fruits & Vegetables", type: "produce", orderingUrl: undefined }
  ],
  grocery: [
    { name: "Grocery Aisle", description: "Pantry Staples & Packaged Goods", type: "grocery", orderingUrl: undefined }
  ],
};
const DepartmentDirectory: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Use MOCK_DEPARTMENTS as the data source
  const fetchedDepartments = MOCK_DEPARTMENTS;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-maineBlue mb-3">Departments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEPARTMENT_TYPES.map(type => {
          const dept = fetchedDepartments[type.key]?.[0];
          return (
            <div
              key={type.key}
              className="bg-sand rounded shadow p-4 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-lobsterRed transition"
              onClick={() => dept && setSelectedDepartment(dept)}
            >
              <div className="font-semibold text-lg text-maineBlue mb-2">{type.label}</div>
              {dept ? (
                <>
                  <div className="text-gray-800 mb-1">{dept.name}</div>
                  {dept.description && <div className="text-gray-600 text-sm mb-2">{dept.description}</div>}
                  <button className="mt-2 bg-maineBlue text-seafoam px-3 py-1 rounded font-bold hover:bg-seafoam hover:text-maineBlue transition-colors text-sm">View Details</button>
                </>
              ) : (
                <div className="italic text-gray-400">No {type.label.toLowerCase()} listed.</div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setSelectedDepartment(null)}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedDepartment(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
            <div className="font-bold text-lg text-maineBlue mb-2">{selectedDepartment.name}</div>
            {selectedDepartment.description && <div className="mb-1 text-gray-700">{selectedDepartment.description}</div>}
            {selectedDepartment.orderingUrl && (
              <a
                href={selectedDepartment.orderingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center bg-seafoam text-maineBlue px-4 py-2 rounded font-bold hover:bg-maineBlue hover:text-seafoam transition-colors"
              >
                Order Online
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDirectory;
