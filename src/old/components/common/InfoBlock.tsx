import React from 'react';

interface InfoBlockProps {
  title: string;
  children: React.ReactNode;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({ title, children }) => {
  return (
    <div className="py-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};