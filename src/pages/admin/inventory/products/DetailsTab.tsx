
import React from 'react';
import RichTextEditor from 'src/components/RichTextEditor';
type Props = {
  form: any;
  setForm: (f: any) => void;
  // when editing an existing product these props contain current saved image URLs
  currentMainImageUrl?: string | null;
  currentGalleryUrls?: string[];
};

const DetailsTab: React.FC<Props> = ({ form, setForm, currentMainImageUrl = null, currentGalleryUrls = [] }) => (
 
 <div className="p-3 bg-light border rounded">
    <h5 className="mb-3">Product Details</h5>
    <div className="mb-3">
  <label className="form-label">Main Image <small className="text-muted ms-2" title="Recommended image size: 800×800">(Recommended: 800×800)</small></label>
      <input
        className="form-control"
        type="file"
        accept="image/*"
        onChange={e => setForm({ ...form, mainImage: e.target.files?.[0] || null })}
      />
      {/* show preview for newly selected File */}
      {form.mainImage && form.mainImage instanceof File && (
        <img src={URL.createObjectURL(form.mainImage)} alt="Main" style={{ maxWidth: 120, marginTop: 8 }} />
      )}
      {/* otherwise show existing saved image URL when editing */}
      {!form.mainImage && currentMainImageUrl && (
        <img src={currentMainImageUrl} alt="Main" style={{ maxWidth: 120, marginTop: 8 }} />
      )}
    </div>
    <div className="mb-3">
      <label className="form-label">Short Description (points)</label>
      <textarea className="form-control" rows={3} value={form.shortDescription || ''} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Enter each point on a new line" />
      <small className="form-text text-muted">Each line will be treated as a separate point.</small>
    </div>
    <div className="mb-3">
      <label className="form-label">Main Description</label>
      <RichTextEditor value={form.description || ''} onChange={val => setForm({ ...form, description: val })} placeholder="Product description, features, etc." />
    </div>
    <div className="mb-3">
      <label className="form-label">Features (comma separated)</label>
  <input className="form-control" type="text" value={form.features !== undefined ? form.features : ''} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="e.g., Eggless, Premium, Customizable" />
    </div>
    <div className="mb-3">
      <label className="form-label">Badges (comma separated)</label>
  <input className="form-control" type="text" value={form.badges !== undefined ? form.badges : ''} onChange={e => setForm({ ...form, badges: e.target.value })} placeholder="e.g., Bestseller, Wedding Special" />
    </div>
    <div className="mb-3">
      <label className="form-label">Gallery Images <small className="text-muted ms-2" title="Recommended image size: 400×400">(Recommended: 400×400)</small></label>
      <input className="form-control" type="file" multiple accept="image/*" onChange={e => setForm({ ...form, galleryImages: Array.from(e.target.files || []) })} />
      {/* show previews for newly selected gallery files */}
      {form.galleryImages && form.galleryImages.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          {form.galleryImages.map((img: File, i: number) => (
            <img key={`new-${i}`} src={URL.createObjectURL(img)} alt={`Gallery ${i}`} style={{ maxWidth: 80 }} />
          ))}
        </div>
      )}
      {/* otherwise show existing saved gallery image URLs when editing */}
      {console.log(form)}
      {(!form.galleryImages || form.galleryImages.length === 0) && currentGalleryUrls && currentGalleryUrls.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          {currentGalleryUrls.map((url, i) => (
            <img key={`existing-${i}`} src={url} alt={`Gallery ${i}`} style={{ maxWidth: 80 }} />
          ))}
        </div>
      )}
    </div>
    <div className="mb-3">
      <label className="form-label">Flags</label>
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
        <label className="form-check-label" htmlFor="featured">Featured</label>
      </div>
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="newArrival" checked={form.newArrival} onChange={e => setForm({ ...form, newArrival: e.target.checked })} />
        <label className="form-check-label" htmlFor="newArrival">New Arrival</label>
      </div>
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="todaysSpecial" checked={form.todaysSpecial} onChange={e => setForm({ ...form, todaysSpecial: e.target.checked })} />
        <label className="form-check-label" htmlFor="todaysSpecial">Today's Special</label>
      </div>
    </div>
  </div>
);
export default DetailsTab;
