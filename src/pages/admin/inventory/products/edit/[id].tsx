import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../../layouts/AdminLayout';

interface Category {
  id: string;
  name: string;
  icon?: string;
  status: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  icon?: string;
  status: boolean;
}

interface Subsubcategory {
  id: string;
  name: string;
  subcategory_id: string;
  category_id: string;
  icon?: string;
  status: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price?: number;
  sku: string;
  stock: number;
  weight?: string;
  dimensions?: string;
  category_id: string;
  subcategory_id?: string;
  subsubcategory_id?: string;
  status: boolean;
  
  // Delivery & Services
  delivery_type?: string;
  personalization_available?: boolean;
  gift_wrapping?: boolean;
  message_card?: boolean;
  care_instructions?: string;
  
  // Flower Specific Fields
  flower_count?: string;
  arrangement_type?: string;
  color_options?: string;
  freshness_duration?: string;
  includes_vase?: boolean;
  
  // Cake Specific Fields
  cake_flavor?: string;
  serves_people?: string;
  egg_type?: string;
  cake_type?: string;
  customization_text?: string;
  
  // Gift Specific Fields
  gift_type?: string;
  suitable_for?: string;
  occasion_tags?: string;
  age_group?: string;
  material?: string;
  brand?: string;
  
  // Plant Specific Fields
  plant_type?: string;
  pot_included?: boolean;
  sunlight_requirement?: string;
  watering_frequency?: string;
  air_purifying?: boolean;
  pet_friendly?: boolean;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  
  // Images
  main_image_url?: string;
  gallery_images?: string[];
}

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subsubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubsubcategories, setFilteredSubsubcategories] = useState<Subsubcategory[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [form, setForm] = useState({
    // Basic Info
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
    category_id: '',
    subcategory_id: '',
    subsubcategory_id: '',
    status: true,
    
    // Delivery & Services
    delivery_type: 'same_day',
    personalization_available: false,
    gift_wrapping: false,
    message_card: false,
    care_instructions: '',
    
    // Flower Specific Fields
    flower_count: '',
    arrangement_type: '',
    color_options: '',
    freshness_duration: '',
    includes_vase: false,
    
    // Cake Specific Fields
    cake_flavor: '',
    serves_people: '',
    egg_type: 'eggless',
    cake_type: '',
    customization_text: '',
    
    // Gift Specific Fields  
    gift_type: '',
    suitable_for: '',
    occasion_tags: '',
    age_group: '',
    material: '',
    brand: '',
    
    // Plant Specific Fields
    plant_type: '',
    pot_included: true,
    sunlight_requirement: '',
    watering_frequency: '',
    air_purifying: false,
    pet_friendly: false,
    
    // SEO & Images
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    slug: '',
    main_image: null as File | null,
    gallery_images: [] as File[]
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchCategories();
      fetchSubcategories();
      fetchSubsubcategories();
    }
  }, [id]);

  useEffect(() => {
    if (form.category_id) {
      const filtered = subcategories.filter(sub => sub.category_id === form.category_id);
      setFilteredSubcategories(filtered);
      setFilteredSubsubcategories([]);
    } else {
      setFilteredSubcategories([]);
      setFilteredSubsubcategories([]);
    }
  }, [form.category_id, subcategories]);

  useEffect(() => {
    if (form.subcategory_id) {
      const filtered = subsubcategories.filter(subsub => subsub.subcategory_id === form.subcategory_id);
      setFilteredSubsubcategories(filtered);
    } else {
      setFilteredSubsubcategories([]);
    }
  }, [form.subcategory_id, subsubcategories]);

  const fetchProduct = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/product/${id}`, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const productData = Array.isArray(data) ? data[0] : data;
        setProduct(productData);
        setForm({
          // Basic Info
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          discounted_price: productData.discounted_price?.toString() || '',
          sku: productData.sku || '',
          stock: productData.stock?.toString() || '',
          weight: productData.weight || '',
          dimensions: productData.dimensions || '',
          category_id: productData.category_id || '',
          subcategory_id: productData.subcategory_id || '',
          subsubcategory_id: productData.subsubcategory_id || '',
          status: productData.status ?? true,
          
          // Delivery & Services
          delivery_type: productData.delivery_type || 'same_day',
          personalization_available: productData.personalization_available || false,
          gift_wrapping: productData.gift_wrapping || false,
          message_card: productData.message_card || false,
          care_instructions: productData.care_instructions || '',
          
          // Flower Specific Fields
          flower_count: productData.flower_count || '',
          arrangement_type: productData.arrangement_type || '',
          color_options: productData.color_options || '',
          freshness_duration: productData.freshness_duration || '',
          includes_vase: productData.includes_vase || false,
          
          // Cake Specific Fields
          cake_flavor: productData.cake_flavor || '',
          serves_people: productData.serves_people || '',
          egg_type: productData.egg_type || 'eggless',
          cake_type: productData.cake_type || '',
          customization_text: productData.customization_text || '',
          
          // Gift Specific Fields
          gift_type: productData.gift_type || '',
          suitable_for: productData.suitable_for || '',
          occasion_tags: productData.occasion_tags || '',
          age_group: productData.age_group || '',
          material: productData.material || '',
          brand: productData.brand || '',
          
          // Plant Specific Fields
          plant_type: productData.plant_type || '',
          pot_included: productData.pot_included ?? true,
          sunlight_requirement: productData.sunlight_requirement || '',
          watering_frequency: productData.watering_frequency || '',
          air_purifying: productData.air_purifying || false,
          pet_friendly: productData.pet_friendly || false,
          
          // SEO
          meta_title: productData.meta_title || '',
          meta_description: productData.meta_description || '',
          meta_keywords: productData.meta_keywords || '',
          slug: productData.slug || '',
          
          // Images (keep as null/empty for file inputs)
          main_image: null,
          gallery_images: []
        });
      } else {
        toast.error('Failed to fetch product');
        router.push('/admin/inventory/products');
      }
    } catch (error) {
      toast.error('Error fetching product');
      router.push('/admin/inventory/products');
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/categories', {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/subcategories', {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSubcategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchSubsubcategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/subsubcategories', {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSubsubcategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subsubcategories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, main_image: file }));
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, gallery_images: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(form).forEach(key => {
        if (key === 'main_image') {
          if (form.main_image) {
            formData.append('main_image', form.main_image);
          }
        } else if (key === 'gallery_images') {
          form.gallery_images.forEach((file) => {
            formData.append('gallery_images', file);
          });
        } else {
          formData.append(key, String(form[key as keyof typeof form]));
        }
      });

      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/product/${id}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Product updated successfully!');
        router.push('/admin/inventory/products');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const renderTabNavigation = () => (
    <ul className="nav nav-pills mb-4">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
          type="button"
        >
          📋 Basic Information
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
          type="button"
        >
          📦 Product Details
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
          type="button"
        >
          🚚 Delivery & Services
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
          type="button"
        >
          🔍 SEO & Images
        </button>
      </li>
    </ul>
  );

  const renderBasicTab = () => (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Product Name <span className="text-danger">*</span></label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Red Roses Bouquet, Chocolate Cake, etc."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category <span className="text-danger">*</span></label>
          <select
            name="category_id"
            className="form-select"
            value={form.category_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Subcategory</label>
          <select
            name="subcategory_id"
            className="form-select"
            value={form.subcategory_id}
            onChange={handleInputChange}
            disabled={!form.category_id}
          >
            <option value="">Select a subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Sub-subcategory</label>
          <select
            name="subsubcategory_id"
            className="form-select"
            value={form.subsubcategory_id}
            onChange={handleInputChange}
            disabled={!form.subcategory_id}
          >
            <option value="">Select a sub-subcategory</option>
            {filteredSubsubcategories.map((subsubcategory) => (
              <option key={subsubcategory.id} value={subsubcategory.id}>
                {subsubcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            name="sku"
            className="form-control"
            value={form.sku}
            onChange={handleInputChange}
            placeholder="Product SKU"
          />
        </div>
      </div>

      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleInputChange}
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Discounted Price (₹)</label>
          <input
            type="number"
            name="discounted_price"
            className="form-control"
            value={form.discounted_price}
            onChange={handleInputChange}
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={form.stock}
            onChange={handleInputChange}
            placeholder="Available quantity"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Weight (grams)</label>
          <input
            type="text"
            name="weight"
            className="form-control"
            value={form.weight}
            onChange={handleInputChange}
            placeholder="e.g., 500g, 1kg"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            className="form-control"
            value={form.dimensions}
            onChange={handleInputChange}
            placeholder="L x W x H (cm)"
          />
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              name="status"
              className="form-check-input"
              id="status"
              checked={form.status}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="status">
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows={4}
            value={form.description}
            onChange={handleInputChange}
            placeholder="Detailed product description..."
          />
        </div>
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div className="row">
      <div className="col-md-6">
        <h5 className="mb-3">🌹 Flower & Arrangement Details</h5>
        
        <div className="mb-3">
          <label className="form-label">Flower Count</label>
          <input
            type="number"
            name="flower_count"
            className="form-control"
            value={form.flower_count}
            onChange={handleInputChange}
            placeholder="e.g., 12, 24, 36"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Arrangement Type</label>
          <select
            name="arrangement_type"
            className="form-select"
            value={form.arrangement_type}
            onChange={handleInputChange}
          >
            <option value="">Select arrangement type</option>
            <option value="bouquet">💐 Bouquet</option>
            <option value="bunch">🌸 Bunch</option>
            <option value="basket">🧺 Basket</option>
            <option value="box">📦 Box</option>
            <option value="vase">🏺 Vase</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Color Options</label>
          <input
            type="text"
            name="color_options"
            className="form-control"
            value={form.color_options}
            onChange={handleInputChange}
            placeholder="Red, Pink, White, Yellow"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Freshness Duration</label>
          <input
            type="text"
            name="freshness_duration"
            className="form-control"
            value={form.freshness_duration}
            onChange={handleInputChange}
            placeholder="e.g., 5-7 days"
          />
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              name="includes_vase"
              className="form-check-input"
              id="includes_vase"
              checked={form.includes_vase}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="includes_vase">
              🏺 Includes Vase
            </label>
          </div>
        </div>
      </div>
      
      <div className="col-md-6">
        <h5 className="mb-3">🎂 Cake Details</h5>
        
        <div className="mb-3">
          <label className="form-label">Cake Flavor</label>
          <select
            name="cake_flavor"
            className="form-select"
            value={form.cake_flavor}
            onChange={handleInputChange}
          >
            <option value="">Select flavor</option>
            <option value="chocolate">🍫 Chocolate</option>
            <option value="vanilla">🍦 Vanilla</option>
            <option value="strawberry">🍓 Strawberry</option>
            <option value="black_forest">🌲 Black Forest</option>
            <option value="red_velvet">❤️ Red Velvet</option>
            <option value="butterscotch">🧈 Butterscotch</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Serves People</label>
          <input
            type="text"
            name="serves_people"
            className="form-control"
            value={form.serves_people}
            onChange={handleInputChange}
            placeholder="e.g., 4-6, 8-10, 15-20"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Egg Type</label>
          <select
            name="egg_type"
            className="form-select"
            value={form.egg_type}
            onChange={handleInputChange}
          >
            <option value="eggless">🥚❌ Eggless</option>
            <option value="egg">🥚 With Egg</option>
            <option value="both">🥚✅ Both Available</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cake Type</label>
          <input
            type="text"
            name="cake_type"
            className="form-control"
            value={form.cake_type}
            onChange={handleInputChange}
            placeholder="Birthday, Wedding, Anniversary"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Customization Text</label>
          <input
            type="text"
            name="customization_text"
            className="form-control"
            value={form.customization_text}
            onChange={handleInputChange}
            placeholder="Custom message on cake"
          />
        </div>
      </div>

      <div className="col-12 mt-4">
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">🎁 Gift Details</h5>
            
            <div className="mb-3">
              <label className="form-label">Gift Type</label>
              <input
                type="text"
                name="gift_type"
                className="form-control"
                value={form.gift_type}
                onChange={handleInputChange}
                placeholder="Jewelry, Electronics, etc."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Suitable For</label>
              <select
                name="suitable_for"
                className="form-select"
                value={form.suitable_for}
                onChange={handleInputChange}
              >
                <option value="">Select recipient</option>
                <option value="him">👨 Him</option>
                <option value="her">👩 Her</option>
                <option value="kids">👶 Kids</option>
                <option value="couple">💑 Couple</option>
                <option value="unisex">👫 Unisex</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Age Group</label>
              <input
                type="text"
                name="age_group"
                className="form-control"
                value={form.age_group}
                onChange={handleInputChange}
                placeholder="18-25, 25-35, etc."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Material</label>
              <input
                type="text"
                name="material"
                className="form-control"
                value={form.material}
                onChange={handleInputChange}
                placeholder="Wood, Metal, Fabric, etc."
              />
            </div>
          </div>

          <div className="col-md-6">
            <h5 className="mb-3">🌱 Plant Details</h5>
            
            <div className="mb-3">
              <label className="form-label">Plant Type</label>
              <select
                name="plant_type"
                className="form-select"
                value={form.plant_type}
                onChange={handleInputChange}
              >
                <option value="">Select plant type</option>
                <option value="indoor">🏠 Indoor</option>
                <option value="outdoor">🌞 Outdoor</option>
                <option value="flowering">🌸 Flowering</option>
                <option value="succulent">🌵 Succulent</option>
                <option value="bonsai">🌲 Bonsai</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Sunlight Requirement</label>
              <select
                name="sunlight_requirement"
                className="form-select"
                value={form.sunlight_requirement}
                onChange={handleInputChange}
              >
                <option value="">Select sunlight need</option>
                <option value="direct">☀️ Direct Sunlight</option>
                <option value="indirect">🌤️ Indirect Sunlight</option>
                <option value="low_light">🌙 Low Light</option>
                <option value="shade">🌳 Shade</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Watering Frequency</label>
              <input
                type="text"
                name="watering_frequency"
                className="form-control"
                value={form.watering_frequency}
                onChange={handleInputChange}
                placeholder="Daily, Weekly, Bi-weekly"
              />
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="pot_included"
                  className="form-check-input"
                  id="pot_included"
                  checked={form.pot_included}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="pot_included">
                  🏺 Pot Included
                </label>
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="air_purifying"
                  className="form-check-input"
                  id="air_purifying"
                  checked={form.air_purifying}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="air_purifying">
                  🌬️ Air Purifying
                </label>
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="pet_friendly"
                  className="form-check-input"
                  id="pet_friendly"
                  checked={form.pet_friendly}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="pet_friendly">
                  🐕 Pet Friendly
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryTab = () => (
    <div className="row">
      <div className="col-md-6">
        <h5 className="mb-3">🚚 Delivery Options</h5>
        
        <div className="mb-3">
          <label className="form-label">Delivery Type</label>
          <select
            name="delivery_type"
            className="form-select"
            value={form.delivery_type}
            onChange={handleInputChange}
          >
            <option value="same_day">⚡ Same Day Delivery</option>
            <option value="next_day">📅 Next Day Delivery</option>
            <option value="standard">📦 Standard Delivery (2-3 days)</option>
          </select>
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              name="personalization_available"
              className="form-check-input"
              id="personalization_available"
              checked={form.personalization_available}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="personalization_available">
              ✨ Personalization Available
            </label>
          </div>
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              name="gift_wrapping"
              className="form-check-input"
              id="gift_wrapping"
              checked={form.gift_wrapping}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="gift_wrapping">
              🎁 Gift Wrapping Available
            </label>
          </div>
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              name="message_card"
              className="form-check-input"
              id="message_card"
              checked={form.message_card}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="message_card">
              💌 Message Card Available
            </label>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <h5 className="mb-3">📋 Additional Information</h5>
        
        <div className="mb-3">
          <label className="form-label">Care Instructions</label>
          <textarea
            name="care_instructions"
            className="form-control"
            rows={4}
            value={form.care_instructions}
            onChange={handleInputChange}
            placeholder="Care instructions for the product..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Occasion Tags</label>
          <input
            type="text"
            name="occasion_tags"
            className="form-control"
            value={form.occasion_tags}
            onChange={handleInputChange}
            placeholder="Birthday, Anniversary, Valentine's Day (comma separated)"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="brand"
            className="form-control"
            value={form.brand}
            onChange={handleInputChange}
            placeholder="Brand name"
          />
        </div>
      </div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="row">
      <div className="col-md-8">
        <h5 className="mb-3">🔍 SEO Information</h5>
        
        <div className="mb-3">
          <label className="form-label">SEO Title</label>
          <input
            type="text"
            name="meta_title"
            className="form-control"
            value={form.meta_title}
            onChange={handleInputChange}
            placeholder="SEO optimized title"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Meta Description</label>
          <textarea
            name="meta_description"
            className="form-control"
            rows={3}
            value={form.meta_description}
            onChange={handleInputChange}
            placeholder="Brief description for search engines"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            className="form-control"
            value={form.meta_keywords}
            onChange={handleInputChange}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">URL Slug</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={form.slug}
            onChange={handleInputChange}
            placeholder="product-url-slug"
          />
        </div>

        <hr className="my-4" />

        <h5 className="mb-3">📷 Product Images</h5>
        
        <div className="mb-3">
          <label className="form-label">Main Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleMainImageChange}
          />
          <div className="form-text">Upload main product image (will replace existing)</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Gallery Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleGalleryImagesChange}
          />
          <div className="form-text">Upload additional product images (will replace existing gallery)</div>
        </div>

        {product?.main_image_url && (
          <div className="mb-3">
            <label className="form-label">Current Main Image</label>
            <div>
              <img
                src={product.main_image_url}
                alt="Main product"
                className="border rounded"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        {product?.gallery_images && product.gallery_images.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Current Gallery Images</label>
            <div className="d-flex gap-2 flex-wrap">
              {product.gallery_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="border rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (fetching) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="alert alert-danger">
          Product not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>✏️ Edit Product: {product.name}</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin/inventory/products')}
        >
          ← Back to Products
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {renderTabNavigation()}
            
            <div className="tab-content">
              {activeTab === 'basic' && renderBasicTab()}
              {activeTab === 'details' && renderDetailsTab()}
              {activeTab === 'delivery' && renderDeliveryTab()}
              {activeTab === 'seo' && renderSeoTab()}
            </div>

            <div className="d-flex gap-2 mt-4 pt-3 border-top">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Updating...' : '✅ Update Product'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => router.push('/admin/inventory/products')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}