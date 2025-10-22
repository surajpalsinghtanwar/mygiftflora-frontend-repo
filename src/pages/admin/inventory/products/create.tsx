import React, { useState, useEffect } from 'react';
import AdminLayout from 'src/layouts/AdminLayout';
import BasicInfoTab from './BasicInfoTab';
import { VariantsTab } from './VariantsTab';
import DetailsTab from './DetailsTab';
import DeliveryTab from './DeliveryTab';
import SEOTab from './SEOTab';
import { getApiUrl } from 'src/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function CreateProduct() {
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

  const [variants, setVariants] = useState<VariantType[]>([{ label: '', value: '', price: '', extra: '' }]);
  const initialForm = {
    name: '',
    description: '',
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
    personalization_required: false,
  };

  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<any[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [saveStatus, setSaveStatus] = useState<string>('');
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const url = getApiUrl('/admin/categories');
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(`fetchCategories failed: ${response.status} ${response.statusText}`, text);
        return;
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching categories (network?):', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const url = getApiUrl(`/admin/subcategories-byCategory?categoryId=${categoryId}`);
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(`fetchSubcategories failed: ${response.status} ${response.statusText}`, text);
        return;
      }
      const data = await response.json();
      setSubcategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories (network?):', error);
    }
  };

  const fetchSubsubcategories = async (subcategoryId: string) => {
    if (!subcategoryId) {
      setSubsubcategories([]);
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const url = getApiUrl(`/admin/subsubcategories-bySubcategory?subcategoryId=${subcategoryId}`);
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(`fetchSubsubcategories failed: ${response.status} ${response.statusText}`, text);
        return;
      }
      const data = await response.json();
      setSubsubcategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching subsubcategories (network?):', error);
    }
  };
  const renderTabNavigation = () => (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <button type="button" className={`nav-link${activeTab === 'basic' ? ' active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Info</button>
      </li>
      <li className="nav-item">
        <button type="button" className={`nav-link${activeTab === 'details' ? ' active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
      </li>
      <li className="nav-item">
        <button type="button" className={`nav-link${activeTab === 'variants' ? ' active' : ''}`} onClick={() => setActiveTab('variants')}>Variants/Options</button>
      </li>
      <li className="nav-item">
        <button type="button" className={`nav-link${activeTab === 'delivery' ? ' active' : ''}`} onClick={() => setActiveTab('delivery')}>Delivery</button>
      </li>
      <li className="nav-item">
        <button type="button" className={`nav-link${activeTab === 'seo' ? ' active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button>
      </li>
    </ul>
  );

  const getVariantFields = () => {
    if (form.category && typeof form.category === 'string') {
      const cat = categories.find(c => String(c.id || c._id) === String(form.category));
      if (!cat) return ['label', 'value', 'price', 'extra'];
      const catName = (cat.name || '').toLowerCase();
      if (catName.includes('cake')) {
        return ['weight', 'eggType', 'price'];
      }
      if (catName.includes('flower')) {
        return ['stemCount', 'color', 'price'];
      }
      if (catName.includes('gift')) {
        return ['option', 'personalization', 'price'];
      }
      if (catName.includes('plant')) {
        return ['size', 'potType', 'price'];
      }
    }
    return ['label', 'value', 'price', 'extra'];
  };

    // Validation logic for required fields
    const validateForm = () => {
      const newErrors: { [key: string]: string } = {};
      if (!form.name.trim()) newErrors.name = 'Product name is required.';
      if (!form.category) newErrors.category = 'Category is required.';
      // subcategory and subsubcategory are optional
      // price is only validated in variants
      if (!variants.length || variants.some(v => !v.price || v.price.trim() === '')) {
        newErrors.variants = 'At least one variant with price is required.';
      }
      return newErrors;
    };

  const router = useRouter()

  const handleSave = async () => {
      const validationErrors = validateForm();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        setSaveStatus('Please fix the errors before saving.');
        return;
      }
      setSaveStatus('Saving...');
      try {
        const token = localStorage.getItem('access_token');
        // Clean form data: remove unwanted fields
        const allowedFields = [
          'name','description','shortDescription','sku','stock','weight','dimensions','category','subcategory',
          'subsubcategory','status','featured','newArrival','todaysSpecial',
          'delivery_type','brand','plant_type','pot_included','sunlight_requirement',
          'watering_frequency','air_purifying','pet_friendly','seoTitle',
          'seoDescription','seoKeywords','slug','mainImage','galleryImages',
          'badges','features','textPersonalization','imagePersonalization'
        ];
        const cleanedForm: any = {};
        Object.entries(form).forEach(([key, value]) => {
          if (allowedFields.includes(key)) {
            cleanedForm[key] = value;
          }
        });
        // Set price and discounted_price from default variant, fallback to first variant
        let defaultVariant = variants.find(v => v.isDefault);
        if (!defaultVariant && variants.length > 0) {
          defaultVariant = variants[0];
        }
        cleanedForm.price = defaultVariant ? defaultVariant.price : '';
        cleanedForm.discounted_price = defaultVariant ? defaultVariant.originalPrice : '';

        // Map category fields to backend field names (category_id, subcategory_id, subsubcategory_id)
        if (cleanedForm.category) {
          cleanedForm.category_id = cleanedForm.category;
          delete cleanedForm.category;
        }
        if (cleanedForm.subcategory) {
          cleanedForm.subcategory_id = cleanedForm.subcategory;
          delete cleanedForm.subcategory;
        }
        if (cleanedForm.subsubcategory) {
          cleanedForm.subsubcategory_id = cleanedForm.subsubcategory;
          delete cleanedForm.subsubcategory;
        }

        // Remove unused fields for non-applicable categories
        const categoryName = (categories.find(c => String(c.id || c._id) === String(cleanedForm.category_id))?.name || '').toLowerCase();
        const removeIfNot = (fieldsToRemove: string[], keyword: string) => {
          if (!categoryName.includes(keyword)) {
            fieldsToRemove.forEach(f => { delete cleanedForm[f]; });
          }
        };
        removeIfNot(['weight','dimensions','plant_type','pot_included','sunlight_requirement','watering_frequency'], 'plant');
        removeIfNot(['cake_type','cake_flavor','serves_people','egg_type'], 'cake');
        removeIfNot(['flower_count','arrangement_type','color_options','freshness_duration','includes_vase'], 'flower');

        // Always send SEO fields if filled
        ['seoTitle','seoDescription','seoKeywords'].forEach(f => {
          if ((form as any)[f]) cleanedForm[f] = (form as any)[f];
        });
        // Prepare FormData
        const formData = new FormData();
        Object.entries(cleanedForm).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'galleryImages' && Array.isArray(value)) {
              value.forEach((img: File, idx: number) => formData.append(`galleryImages[${idx}]`, img));
            } else if (key === 'mainImage' && value instanceof File) {
              formData.append('mainImage', value);
            } else {
              formData.append(key, value as any);
            }
          }
        });
        formData.append('variants', JSON.stringify(variants));
        const url = getApiUrl('/admin/product');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        let body: any = null
        try { body = await response.json() } catch (e) { body = null }
        if (response.ok) {
          // Prefer message from server
          const msg = body?.message || 'Product saved successfully!'
          toast.success(msg)
          setErrors({});
          setSaveStatus('Product saved successfully!')
          // redirect to product page if backend returned id or slug
          const targetId = body?.data?.id || body?.id || body?.data?.slug || body?.slug
          setTimeout(() => router.push('/admin/inventory/products'), 900)
        } else {
          // Handle conflict or validation errors
          if (response.status === 409) {
            const msg = body?.message || body?.error || 'Conflict'
            toast.error(msg)
            setSaveStatus(msg)
          } else if (response.status === 422 || response.status === 400) {
            // validation errors expected in { errors: { field: msg } }
            const fieldErrors = body?.errors || {}
            setErrors(fieldErrors)
            const top = body?.message || Object.values(fieldErrors)[0]
            if (top) toast.error(String(top))
            setSaveStatus('Please fix the errors and try again.')
          } else {
            const msg = body?.message || 'Error saving product.'
            toast.error(msg)
            setSaveStatus(msg)
          }
        }
      } catch (err) {
        const message = (err as any)?.message || 'Error saving product.'
        toast.error(String(message))
        setSaveStatus('Error saving product.')
      }
    };

    useEffect(() => {
      fetchCategories();
    }, []);

    useEffect(() => {
      // Fetch subcategories when category changes
      fetchSubcategories(form.category);
      setForm(f => ({ ...f, subcategory: '', subsubcategory: '' })); // Reset subcategory and subsubcategory
    }, [form.category]);

    useEffect(() => {
      // Fetch subsubcategories when subcategory changes
      fetchSubsubcategories(form.subcategory);
      setForm(f => ({ ...f, subsubcategory: '' })); // Reset subsubcategory
    }, [form.subcategory]);

    // Removed frontend filtering useEffects, now handled by backend fetch
  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🛍️ Create New Product</h3>
      </div>
      <div className="card">
        <div className="card-body">
          <form>
            {renderTabNavigation()}
            <div className="tab-content">
              {activeTab === 'basic' && (
                <BasicInfoTab
                  form={form}
                  setForm={setForm}
                  categories={categories}
                  subcategories={subcategories}
                  subsubcategories={subsubcategories}
                />
              )}
              {activeTab === 'details' && (
                <DetailsTab form={form} setForm={setForm} />
              )}
              {activeTab === 'variants' && (
                <VariantsTab
                  variants={variants}
                  setVariants={setVariants}
                  fields={getVariantFields()}
                />
              )}
              {activeTab === 'delivery' && <DeliveryTab />}
              {activeTab === 'seo' && <SEOTab form={form} setForm={setForm} />}
            </div>
              {/* Validation Errors */}
              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger mt-3">
                  <ul className="mb-0">
                    {Object.entries(errors).map(([field, msg]) => (
                      <li key={field}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Save Status */}
              {saveStatus && (
                <div className="alert alert-info mt-2">{saveStatus}</div>
              )}
            {/* Save Button */}
            <div className="mt-4 text-end">
                <button type="button" className="btn btn-primary btn-lg" onClick={handleSave}>Save Product</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
