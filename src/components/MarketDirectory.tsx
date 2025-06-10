import React, { useEffect, useState } from 'react';

// Types for market info
export const DEPARTMENT_TYPES = [
  { key: 'produce', label: 'Produce', icon: '🥦', url: 'https://www.wholefoodsmarket.com/' },
  { key: 'bakery', label: 'Bakery', icon: '🍞', url: 'https://www.localbakery.com/' },
  { key: 'butcher', label: 'Butcher', icon: '🥩', url: 'https://www.localbutcher.com/' },
  { key: 'seafood', label: 'Seafood', icon: '🦐', url: 'https://www.oldportseafood.com/' },
  { key: 'dairy', label: 'Dairy', icon: '🧀', url: 'https://www.localdairy.com/' },
  { key: 'grocery', label: 'Grocery', icon: '🛒', url: 'https://www.localgrocer.com/' },
];

interface Department {
  name: string;
  description?: string;
  type: string;
  orderingUrl?: string;
}


export const DepartmentsGrid: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<typeof DEPARTMENT_TYPES[0] | null>(null);

  const openModal = (dept: typeof DEPARTMENT_TYPES[0]) => {
    setSelectedDept(dept);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <span className="text-5xl mb-4">{selectedDept.icon}</span>
            <h3 className="text-xl font-bold mb-2 text-maineBlue">{selectedDept.label}</h3>
            <p className="mb-6 text-gray-600 text-center">
              Ready to explore {selectedDept.label.toLowerCase()} options in your area?
            </p>
            <a
              href={selectedDept.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-maineBlue text-seafoam px-6 py-3 rounded-lg font-bold hover:bg-seafoam hover:text-maineBlue transition-colors flex items-center gap-2"
            >
              <span>Visit {selectedDept.label}</span>
              <span className="text-xl">{selectedDept.icon}</span>
            </a>
            <div className="mt-4 text-xs text-gray-400">
              Opens in a new tab for the best shopping experience
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DepartmentDirectory: React.FC = () => <DepartmentsGrid />;

export default DepartmentDirectory;
