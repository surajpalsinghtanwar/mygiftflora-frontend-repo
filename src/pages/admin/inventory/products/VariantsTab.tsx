import React from 'react';

type VariantType = {
  [key: string]: any;
  label?: string;
  value?: string;
  price?: string;
  extra?: string;
  weight?: string;
  eggType?: string;
  stemCount?: string;
  color?: string;
  option?: string;
  personalization?: string;
  size?: string;
  potType?: string;
};

type Props = {
  variants: VariantType[];
  setVariants: (v: VariantType[]) => void;
  fields: string[];
  onDefaultChange?: (price: string, discountPrice: string) => void;
};


export const VariantsTab: React.FC<Props> = ({ variants, setVariants, fields, onDefaultChange }) => {
  // debug in dev: log variants and fields when they change
  React.useEffect(() => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('VariantsTab debug - variants:', variants);
        console.debug('VariantsTab debug - fields:', fields);
      }
    } catch (e) { /* ignore */ }
  }, [variants, fields]);
  // Ensure every variant has isDefault property
  React.useEffect(() => {
    if (variants.length === 0) return;
    let hasDefault = variants.some(v => v.isDefault);
    let newVariants = variants.map((v, i) => ({ ...v, isDefault: v.isDefault ?? false }));
    if (!hasDefault) {
      newVariants[0].isDefault = true;
    }
    if (JSON.stringify(newVariants) !== JSON.stringify(variants)) {
      setVariants(newVariants);
    }
  }, [variants, setVariants]);
  const [defaultError, setDefaultError] = React.useState('');
  // Dynamic logic for cake, flower, gift, plant, etc. based on fields
  // be permissive: if any cake-related field is present show cake inputs (weight/serves/eggType)
  const isCake = fields.includes('weight') || fields.includes('serves') || fields.includes('eggType');
  const isFlower = fields.includes('stemCount') || fields.includes('color');
  const isGift = fields.includes('option') && fields.includes('personalization');
  const isPlant = fields.includes('size') && fields.includes('potType');

  React.useEffect(() => {
    // Update parent price/discount price when default changes
    if (onDefaultChange) {
      const defaultVariant = variants.find(v => v.isDefault);
      if (defaultVariant) {
        onDefaultChange(defaultVariant.price || '', defaultVariant.originalPrice || '');
      }
    }
  }, [variants, onDefaultChange]);

  // Helper to enforce only one default
  const handleDefaultChange = (idx: number, value: boolean) => {
    let newVariants = [...variants];
    if (variants.length === 1) {
      newVariants[0].isDefault = true;
      setDefaultError('');
      setVariants(newVariants);
      return;
    }
    if (value) {
      // Set all others to false
      newVariants = newVariants.map((v, i) => ({ ...v, isDefault: i === idx }));
      setDefaultError('');
    } else {
      // Prevent all being false
      if (newVariants.filter(v => v.isDefault).length === 1 && newVariants[idx].isDefault) {
        setDefaultError('At least one variant must be default.');
        return;
      }
      newVariants[idx].isDefault = false;
      setDefaultError('');
    }
    setVariants(newVariants);
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="mb-3">🧁 Product Variants / Options</h5>
        {defaultError && (
          <div className="alert alert-warning mb-2">{defaultError}</div>
        )}
        {variants.map((variant, idx) => (
          <div key={idx} className="row mb-2 align-items-end">
            {/* Dynamic fields for each category */}
            {isCake && (
              <>
                <div className="col-md-2">
                  <label className="form-label">Weight</label>
                  <input type="text" className="form-control" value={variant.weight || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].weight = e.target.value; setVariants(newVariants); }} placeholder="e.g., 1 Kg, 2 Kg" />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Egg Type</label>
                  <select className="form-select" value={variant.eggType || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].eggType = e.target.value; setVariants(newVariants); }}>
                    <option value="eggless">Eggless</option>
                    <option value="egg">With Egg</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Serves</label>
                  <input type="text" className="form-control" value={variant.serves || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].serves = e.target.value; setVariants(newVariants); }} placeholder="e.g., 8-10 people" />
                </div>
              </>
            )}
            {isFlower && (
              <>
                <div className="col-md-3">
                  <label className="form-label">Stem Count</label>
                  <input type="number" className="form-control" value={variant.stemCount || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].stemCount = e.target.value; setVariants(newVariants); }} placeholder="e.g., 12, 24, 50" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Color</label>
                  <input type="text" className="form-control" value={variant.color || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].color = e.target.value; setVariants(newVariants); }} placeholder="e.g., Red, Pink, Yellow" />
                </div>
              </>
            )}
            {isGift && (
              <>
                <div className="col-md-3">
                  <label className="form-label">Option</label>
                  <input type="text" className="form-control" value={variant.option || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].option = e.target.value; setVariants(newVariants); }} placeholder="e.g., Mug, Cushion, Combo" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Personalization</label>
                  <input type="text" className="form-control" value={variant.personalization || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].personalization = e.target.value; setVariants(newVariants); }} placeholder="e.g., Name, Photo, Message" />
                </div>
              </>
            )}
            {isPlant && (
              <>
                <div className="col-md-3">
                  <label className="form-label">Size</label>
                  <input type="text" className="form-control" value={variant.size || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].size = e.target.value; setVariants(newVariants); }} placeholder="e.g., Small, Medium, Large" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Pot Type</label>
                  <input type="text" className="form-control" value={variant.potType || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx].potType = e.target.value; setVariants(newVariants); }} placeholder="e.g., Ceramic, Plastic, Metal" />
                </div>
              </>
            )}
            {!isCake && !isFlower && !isGift && !isPlant && (
              <>
                {fields.filter(field => field !== 'price').map(field => (
                  <div className="col-md-3" key={field}>
                    <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input type="text" className="form-control" value={variant[field] || ''} onChange={e => { const newVariants = [...variants]; newVariants[idx][field] = e.target.value; setVariants(newVariants); }} placeholder={`Enter ${field}`} />
                  </div>
                ))}
              </>
            )}
            {/* Mandatory price and discount price fields for all variants */}
            <div className="col-md-2">
              <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
              <input type="number" className="form-control" value={variant.price || ''} required onChange={e => { const newVariants = [...variants]; newVariants[idx].price = e.target.value; setVariants(newVariants); }} placeholder="0.00" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Discount Price (₹) <span className="text-danger">*</span></label>
              <input type="number" className="form-control" value={variant.originalPrice || ''} required onChange={e => { const newVariants = [...variants]; newVariants[idx].originalPrice = e.target.value; setVariants(newVariants); }} placeholder="0.00" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Default?</label>
              {variants.length === 1 ? (
                <select className="form-select" value="true" disabled>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <select className="form-select" value={variant.isDefault ? 'true' : 'false'} onChange={e => handleDefaultChange(idx, e.target.value === 'true')}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              )}
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-danger" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} disabled={variants.length === 1}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-success mt-2" onClick={() => setVariants([...variants, {}])}>+ Add Option</button>
      </div>
    </div>
  );
          }
