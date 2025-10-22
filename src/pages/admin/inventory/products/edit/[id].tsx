import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from 'src/layouts/AdminLayout';
import BasicInfoTab from '../BasicInfoTab';
import { VariantsTab } from '../VariantsTab';
import DetailsTab from '../DetailsTab';
import DeliveryTab from '../DeliveryTab';
import SEOTab from '../SEOTab';
import { getApiUrl, getUploadUrl } from 'src/utils/api';

type AnyObj = { [k: string]: any };

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic'|'details'|'variants'|'delivery'|'seo'>('basic');
  const [categories, setCategories] = useState<AnyObj[]>([]);
  const [subcategories, setSubcategories] = useState<AnyObj[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<AnyObj[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<AnyObj[]>([]);
  const [filteredSubsubcategories, setFilteredSubsubcategories] = useState<AnyObj[]>([]);
  const [errors, setErrors] = useState<AnyObj>({});

  const initialForm: AnyObj = {
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discounted_price: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
    category: '',
    subcategory: '',
    subsubcategory: '',
    status: true,
    featured: false,
    newArrival: false,
    todaysSpecial: false,
    delivery_type: 'same_day',
    personalization_available: false,
    imagePersonalization: false,
    textPersonalization: false,
    gift_wrapping: false,
    message_card: false,
    care_instructions: '',
    flower_count: '',
    arrangement_type: '',
    color_options: '',
    freshness_duration: '',
    includes_vase: false,
    cake_flavor: '',
    serves_people: '',
    egg_type: 'eggless',
    cake_type: '',
    customization_text: '',
    gift_type: '',
    suitable_for: '',
    occasion_tags: '',
    age_group: '',
    material: '',
    brand: '',
    plant_type: '',
    pot_included: true,
    sunlight_requirement: '',
    watering_frequency: '',
    air_purifying: false,
    pet_friendly: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    slug: '',
    mainImage: null as File | null,
    galleryImages: [] as File[],
  };

  const [form, setForm] = useState<AnyObj>(initialForm);
  const [variants, setVariants] = useState<AnyObj[]>([{ label: 'Default', price: '', originalPrice: '', isDefault: true }]);
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string | null>(null);
  const [currentGalleryUrls, setCurrentGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchCategories();
    fetchSubcategories();
    fetchSubsubcategories();
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // compute variant fields based on selected category name (same logic as create.tsx)
  const getVariantFields = () => {
    // try explicit category name coming from form (set when fetching product)
    const catNameFromForm = (form._categoryName || '').toLowerCase();
    if (catNameFromForm) {
      if (catNameFromForm.includes('cake')) return ['weight', 'eggType', 'price'];
      if (catNameFromForm.includes('flower')) return ['stemCount', 'color', 'price'];
      if (catNameFromForm.includes('gift')) return ['option', 'personalization', 'price'];
      if (catNameFromForm.includes('plant')) return ['size', 'potType', 'price'];
    }
    if (form.category && typeof form.category === 'string') {
      const cat = categories.find(c => String(c.id || c._id) === String(form.category));
      if (!cat) return ['label', 'value', 'price', 'extra'];
      const catName = (cat.name || '').toLowerCase();
      if (catName.includes('cake')) return ['weight', 'eggType', 'price'];
      if (catName.includes('flower')) return ['stemCount', 'color', 'price'];
      if (catName.includes('gift')) return ['option', 'personalization', 'price'];
      if (catName.includes('plant')) return ['size', 'potType', 'price'];
    }
    return ['label', 'value', 'price', 'extra'];
  };

  useEffect(() => {
    if (form.category) {
      const f = subcategories.filter(s => String(s.category_id || s.categoryId || s.category) === String(form.category));
      setFilteredSubcategories(f);
      setFilteredSubsubcategories([]);
    } else {
      setFilteredSubcategories([]);
      setFilteredSubsubcategories([]);
    }
  }, [form.category, subcategories]);

  useEffect(() => {
    if (form.subcategory) {
      const f = subsubcategories.filter(s => String(s.subcategory_id || s.subcategoryId || s.subcategory) === String(form.subcategory));
      setFilteredSubsubcategories(f);
    } else {
      setFilteredSubsubcategories([]);
    }
  }, [form.subcategory, subsubcategories]);

  async function fetchCategories() {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('fetchCategories', err);
    }
  }

  async function fetchSubcategories() {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/subcategories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setSubcategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('fetchSubcategories', err);
    }
  }

  async function fetchSubsubcategories() {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/subsubcategories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setSubsubcategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('fetchSubsubcategories', err);
    }
  }

  async function fetchProduct() {
    try {
      setFetching(true);
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl(`/admin/product/${id}`), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      if (!resp.ok) {
        toast.error('Failed to fetch product');
        router.push('/admin/inventory/products');
        return;
      }
      const product = Array.isArray(data) ? data[0] : data;
      // map product fields to our form
      const mapped: AnyObj = { ...initialForm };
      mapped.name = product.name || '';
      mapped.description = product.description || '';
      mapped.shortDescription = product.short_description || product.shortDescription || '';
      mapped.price = product.price != null ? String(product.price) : '';
      mapped.discounted_price = product.discounted_price != null ? String(product.discounted_price) : '';
      mapped.sku = product.sku || '';
      mapped.stock = product.stock != null ? String(product.stock) : '';
      mapped.weight = product.weight || '';
      mapped.dimensions = product.dimensions || '';
      mapped.category = product.category_id || product.category?.id || '';
      mapped.subcategory = product.subcategory_id || product.subcategory?.id || '';
      mapped.subsubcategory = product.subsubcategory_id || product.subsubcategory?.id || '';
      mapped.status = product.status ?? true;
      mapped.delivery_type = product.delivery_type || 'same_day';
      mapped.personalization_available = product.personalization_available || false;
      mapped.imagePersonalization = product.image_personalization || product.imagePersonalization || false;
      mapped.textPersonalization = product.text_personalization || product.textPersonalization || false;
      mapped.gift_wrapping = product.gift_wrapping || false;
      mapped.message_card = product.message_card || false;
      mapped.care_instructions = product.care_instructions || '';
      mapped.flower_count = product.flower_count || '';
      mapped.arrangement_type = product.arrangement_type || '';
      mapped.color_options = product.color_options || '';
      mapped.freshness_duration = product.freshness_duration || '';
      mapped.includes_vase = product.includes_vase || false;
      mapped.cake_flavor = product.cake_flavor || '';
      mapped.serves_people = product.serves_people || '';
      mapped.egg_type = product.egg_type || 'eggless';
      mapped.cake_type = product.cake_type || '';
      mapped.customization_text = product.customization_text || '';
      mapped.gift_type = product.gift_type || '';
      mapped.suitable_for = product.suitable_for || '';
      mapped.occasion_tags = product.occasion_tags || '';
      mapped.age_group = product.age_group || '';
      mapped.material = product.material || '';
      mapped.brand = product.brand || '';
      mapped.plant_type = product.plant_type || '';
      mapped.pot_included = product.pot_included ?? true;
      mapped.sunlight_requirement = product.sunlight_requirement || '';
      mapped.watering_frequency = product.watering_frequency || '';
      mapped.air_purifying = product.air_purifying || false;
      mapped.pet_friendly = product.pet_friendly || false;
      mapped.seoTitle = product.meta_title || product.seoTitle || '';
      mapped.seoDescription = product.meta_description || product.seoDescription || '';
      mapped.seoKeywords = product.meta_keywords || product.seoKeywords || '';
      mapped.slug = product.slug || '';
      // badges and features (normalize to comma-separated strings for the form inputs)
      const normalizeMaybeJsonArray = (val: any) => {
        if (Array.isArray(val)) return val.join(',');
        if (typeof val === 'string') {
          const trimmed = val.trim();
          // try parse JSON array string
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try { const parsed = JSON.parse(trimmed); if (Array.isArray(parsed)) return parsed.join(','); } catch (e) {}
          }
          return val;
        }
        return '';
      };
      mapped.features = normalizeMaybeJsonArray(product.features || product.feature_list || product.featureList);
      mapped.badges = normalizeMaybeJsonArray(product.badges || product.tag_list || product.tags);
      // flags (multiple possible backend keys)
      mapped.featured = product.featured ?? product.is_featured ?? product.isFeatured ?? false;
      mapped.newArrival = product.newArrival ?? product.new_arrival ?? product.is_new ?? false;
      mapped.todaysSpecial = product.todaysSpecial ?? product.todays_special ?? false;
      // also keep category name to help variant detection before categories list loads
      mapped._categoryName = product.category?.name || product.category_name || product.categoryName || '';

      setForm(mapped);

      if (product.variants && Array.isArray(product.variants) && product.variants.length) {
        // normalize variant field names to our UI expectations
        const normalized = product.variants.map((v: any) => ({
          label: v.label ?? v.name ?? v.option ?? 'Default',
          // preserve raw value if server provided one (some imports set `value`)
          value: v.value ?? v.val ?? v.name ?? v.option ?? v.label ?? '',
          price: v.price != null ? String(v.price) : (v.sale_price != null ? String(v.sale_price) : ''),
          originalPrice: v.originalPrice != null ? String(v.originalPrice) : (v.discounted_price != null ? String(v.discounted_price) : (v.mrp != null ? String(v.mrp) : '')),
          isDefault: v.isDefault ?? v.default ?? v.is_default ?? false,
          weight: v.weight ?? v.size ?? v.weight_kg ?? v.wt ?? '',
          serves: v.serves ?? v.serves_people ?? v.servesPeople ?? v.servings ?? '',
          eggType: v.eggType ?? v.egg_type ?? '',
          stemCount: v.stemCount ?? v.stem_count ?? '',
          color: v.color ?? '',
          option: v.option ?? '',
          personalization: v.personalization ?? '',
          size: v.size ?? '',
          potType: v.potType ?? v.pot_type ?? '',
        }));
        setVariants(normalized);
      } else {
        setVariants([{ label: 'Default', price: mapped.price || '', originalPrice: mapped.discounted_price || '', isDefault: true }]);
      }

      // helper to resolve image-like values (string, object, array) to a usable filename/URL
      const resolveImageValue = (img: any): string => {
        if (!img && img !== 0) return '';
        if (typeof img === 'string') return img;
        if (Array.isArray(img)) return img.length ? resolveImageValue(img[0]) : '';
        if (typeof img === 'object') {
          // common backend keys
          return img.url || img.src || img.path || img.filename || img.fileName || img.name || '';
        }
        return String(img);
      };

      const mainImg = resolveImageValue(product.main_image ?? product.mainImage ?? '');
    if (mainImg) setCurrentMainImageUrl(getUploadUrl(String(mainImg)));

      const rawGallery = product.gallery_images ?? product.galleryImages ?? [];
      const galleryUrls = (Array.isArray(rawGallery) ? rawGallery : []).map((g: any) => {
        const val = resolveImageValue(g);
          return val ? getUploadUrl(String(val)) : '';
      }).filter(Boolean) as string[];
      setCurrentGalleryUrls(galleryUrls);

    } catch (err) {
      console.error('fetchProduct error', err);
      toast.error('Error fetching product');
      router.push('/admin/inventory/products');
    } finally {
      setFetching(false);
    }
  }

  const validateForm = () => {
    const e: AnyObj = {};
    if (!form.name || !String(form.name).trim()) e.name = 'Product name is required';
    if (!variants || variants.length === 0 || variants.some(v => !v.price || String(v.price).trim() === '')) e.variants = 'At least one variant with price is required';
    return e;
  };

  const handleSave = async () => {
    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const payload = new FormData();
      const allowed = ['name','description','shortDescription','sku','stock','weight','dimensions','category','subcategory','subsubcategory','status','featured','newArrival','todaysSpecial','delivery_type','brand','plant_type','pot_included','sunlight_requirement','watering_frequency','air_purifying','pet_friendly','seoTitle','seoDescription','seoKeywords','slug','badges','features','textPersonalization','imagePersonalization'];
      allowed.forEach(k => { if (form[k] !== undefined && form[k] !== null) payload.append(k, String(form[k])); });
      if (form.mainImage && form.mainImage instanceof File) payload.append('mainImage', form.mainImage);
      if (form.galleryImages && Array.isArray(form.galleryImages)) form.galleryImages.forEach((f: File, idx: number) => payload.append(`galleryImages[${idx}]`, f));
      payload.append('variants', JSON.stringify(variants));
      const def = variants.find(v => v.isDefault) || variants[0];
      if (def) { payload.append('price', String(def.price || '')); payload.append('discounted_price', String(def.originalPrice || '')); }

      const resp = await fetch(getApiUrl(`/admin/product/${id}`), { method: 'PUT', body: payload, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) { toast.success(body?.message || 'Product updated'); router.push('/admin/inventory/products'); }
      else { setErrors(body?.errors || {}); toast.error(body?.message || 'Failed updating'); }
    } catch (err) {
      console.error('save error', err); toast.error('Error updating product');
    } finally { setLoading(false); }
  };

  const renderTabNavigation = () => (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'basic' ? ' active' : ''}`} onClick={() => setActiveTab('basic')}>Basic</button></li>
      <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'variants' ? ' active' : ''}`} onClick={() => setActiveTab('variants')}>Variants</button></li>
      <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'details' ? ' active' : ''}`} onClick={() => setActiveTab('details')}>Details</button></li>
      <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'delivery' ? ' active' : ''}`} onClick={() => setActiveTab('delivery')}>Delivery</button></li>
      <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'seo' ? ' active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button></li>
    </ul>
  );

  if (fetching) return (
    <AdminLayout>
      <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-2">Loading product...</p></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>✏️ Edit Product</h3>
        <button className="btn btn-secondary" onClick={() => router.push('/admin/inventory/products')}>← Back to Products</button>
      </div>
      <div className="card"><div className="card-body">
        {renderTabNavigation()}
        <div className="tab-content">
          {activeTab === 'basic' && <BasicInfoTab form={form} setForm={setForm} categories={categories} subcategories={filteredSubcategories} subsubcategories={filteredSubsubcategories} />}
          {activeTab === 'variants' && <VariantsTab variants={variants} setVariants={setVariants} fields={getVariantFields()} />}
          {activeTab === 'details' && <DetailsTab form={form} setForm={setForm} currentMainImageUrl={currentMainImageUrl} currentGalleryUrls={currentGalleryUrls} />}
          {activeTab === 'delivery' && <DeliveryTab />}
          {activeTab === 'seo' && <SEOTab form={form} setForm={setForm} />}
        </div>

        {Object.keys(errors || {}).length > 0 && (<div className="alert alert-danger mt-3"><ul className="mb-0">{Object.entries(errors).map(([k,v]) => <li key={k}>{String(v)}</li>)}</ul></div>)}

        <div className="d-flex gap-2 mt-4 pt-3 border-top">
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? '⏳ Saving...' : '✅ Update Product'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/inventory/products')}>Cancel</button>
        </div>
      </div></div>
    </AdminLayout>
  );
}
