import React from 'react';
const DeliveryTab: React.FC = () => (
  <div className="p-3 bg-light border rounded">
    <h5 className="mb-3">Delivery Options</h5>
    <div className="mb-3">
      <label className="form-label">Delivery Type</label>
      <select className="form-select">
        <option value="same_day">Same Day Delivery</option>
        <option value="midnight">Midnight Delivery</option>
        <option value="fixed_time">Fixed Time Delivery</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">Care Instructions</label>
      <textarea className="form-control" rows={2} placeholder="e.g., Keep refrigerated, Handle with care" />
    </div>
  </div>
);
export default DeliveryTab;
