import React from 'react';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
    </div>
  );
};