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


const DepartmentDirectory: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // No real department data source provided
  const fetchedDepartments = null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-maineBlue mb-3">Departments</h2>
      <div className="text-gray-500 italic">Market Directory coming soon!</div>
      {/* Departments grid removed until real data is available */}
    </div>
  );
};

export default DepartmentDirectory;
