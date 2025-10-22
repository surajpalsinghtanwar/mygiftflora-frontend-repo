import { useState } from 'react';
import type { Specification } from '../../types/ProductsTypes';

interface ProductTabsProps {
  description: string;
  specifications: Specification[];
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ description, specifications }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

  return (
    <div className="mt-12">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('description')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Description</button>
          <button onClick={() => setActiveTab('specs')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Specifications</button>
        </nav>
      </div>
      <div className="py-6">
        {activeTab === 'description' && <div className="prose prose-orange max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: description }}></div>}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {specifications.map(spec => (
              <div key={spec.name} className="flex border-b pb-2"><dt className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">{spec.name}</dt><dd className="w-2/3 text-gray-600 dark:text-gray-400">{spec.value}</dd></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};