import React from 'react';
import ProductTagsTab from './tabs/ProductTagsTab';
import ProductFurnitureTab from './tabs/ProductFurnitureTab';
import ProductSpecsTab from './tabs/ProductSpecsTab';
import ProductLogisticsTab from './tabs/ProductLogisticsTab';
import ProductSeoTab from './tabs/ProductSeoTab';

const ProductTabs: React.FC<{ productId?: string; isEdit?: boolean }> = ({ productId, isEdit }) => {
  if (!isEdit || !productId) return null;
  return (
    <div className="mt-5">
      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item"><a className="nav-link active" data-bs-toggle="tab" href="#tags">Tags</a></li>
        <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#furniture">Furniture Details</a></li>
        <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#specs">Specifications</a></li>
        <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#logistics">Logistics</a></li>
        <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#seo">SEO</a></li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="tags"><ProductTagsTab productId={productId} /></div>
        <div className="tab-pane fade" id="furniture"><ProductFurnitureTab productId={productId} /></div>
        <div className="tab-pane fade" id="specs"><ProductSpecsTab productId={productId} /></div>
        <div className="tab-pane fade" id="logistics"><ProductLogisticsTab productId={productId} /></div>
        <div className="tab-pane fade" id="seo"><ProductSeoTab productId={productId} /></div>
      </div>
    </div>
  );
};

export default ProductTabs;
