import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../layouts/AdminLayout';

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

export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subsubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubsubcategories, setFilteredSubsubcategories] = useState<Subsubcategory[]>([]);
  
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
    
    // FlowerAura Style Fields
    delivery_type: 'same_day', // same_day, next_day, standard
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
    cake_weight_kg: '',
    serves_people: '',
    egg_type: 'eggless', // egg, eggless, both
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
    fetchCategories();
    fetchSubcategories();
    fetchSubsubcategories();
  }, []);

  useEffect(() => {
    if (form.category_id) {
      const filtered = subcategories.filter(sub => sub.category_id === form.category_id);
      setFilteredSubcategories(filtered);
      setFilteredSubsubcategories([]); // Clear subsubcategories when category changes
      setForm(prev => ({ ...prev, subcategory_id: '', subsubcategory_id: '' }));
    } else {
      setFilteredSubcategories([]);
      setFilteredSubsubcategories([]);
    }
  }, [form.category_id, subcategories]);

  useEffect(() => {
    if (form.subcategory_id) {
      const filtered = subsubcategories.filter(subsub => subsub.subcategory_id === form.subcategory_id);
      setFilteredSubsubcategories(filtered);
      setForm(prev => ({ ...prev, subsubcategory_id: '' }));
    } else {
      setFilteredSubsubcategories([]);
    }
  }, [form.subcategory_id, subsubcategories]);

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
    
    if (!form.price) {
      toast.error('Price is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      Object.keys(form).forEach(key => {
        if (key === 'main_image') {
          if (form.main_image) {
            formData.append('main_image', form.main_image);
          }
        } else if (key === 'gallery_images') {
          form.gallery_images.forEach((file, index) => {
            formData.append(`gallery_images`, file);
          });
        } else {
          formData.append(key, String(form[key as keyof typeof form]));
        }
      });

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/product', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Product created successfully!');
        router.push('/admin/inventory/products');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create product');
      }
    } catch (error) {
      toast.error('Error creating product');
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
            <option value="eggless">🌱 Eggless</option>
            <option value="egg">🥚 With Egg</option>
            <option value="both">🔄 Both Available</option>
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
            placeholder="Birthday, Anniversary, Custom"
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

      <div className="col-12">
        <h5 className="mb-3">� Gift & Plant Details</h5>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Gift Type</label>
              <input
                type="text"
                name="gift_type"
                className="form-control"
                value={form.gift_type}
                onChange={handleInputChange}
                placeholder="Personalized, Jewelry, etc."
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Suitable For</label>
              <input
                type="text"
                name="suitable_for"
                className="form-control"
                value={form.suitable_for}
                onChange={handleInputChange}
                placeholder="Him, Her, Kids, Couple"
              />
            </div>
          </div>
          <div className="col-md-3">
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
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Material</label>
              <input
                type="text"
                name="material"
                className="form-control"
                value={form.material}
                onChange={handleInputChange}
                placeholder="Ceramic, Wood, Metal"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Plant Type</label>
              <input
                type="text"
                name="plant_type"
                className="form-control"
                value={form.plant_type}
                onChange={handleInputChange}
                placeholder="Indoor, Outdoor, Bonsai"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Sunlight Requirement</label>
              <input
                type="text"
                name="sunlight_requirement"
                className="form-control"
                value={form.sunlight_requirement}
                onChange={handleInputChange}
                placeholder="Low, Medium, High"
              />
            </div>
          </div>
          <div className="col-md-4">
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
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
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
                🪴 Pot Included
              </label>
            </div>
          </div>
          <div className="col-md-3">
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
                💨 Air Purifying
              </label>
            </div>
          </div>
          <div className="col-md-3">
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
                🐾 Pet Friendly
              </label>
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
            <option value="same_day">📦 Same Day Delivery</option>
            <option value="next_day">🚀 Next Day Delivery</option>
            <option value="standard">🚚 Standard Delivery (2-3 days)</option>
            <option value="midnight">🌙 Midnight Delivery</option>
            <option value="fixed_time">⏰ Fixed Time Delivery</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Care Instructions</label>
          <textarea
            name="care_instructions"
            className="form-control"
            rows={3}
            value={form.care_instructions}
            onChange={handleInputChange}
            placeholder="Special care instructions for the product..."
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
            placeholder="Birthday, Anniversary, Valentine's Day"
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
            placeholder="Brand name (if applicable)"
          />
        </div>
      </div>

      <div className="col-md-6">
        <h5 className="mb-3">🎁 Additional Services</h5>
        
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
              ✏️ Personalization Available
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

        <div className="alert alert-info">
          <h6>🌟 FlowerAura Features</h6>
          <small>
            • Fresh flower guarantee<br/>
            • On-time delivery promise<br/>
            • Quality assurance<br/>
            • Customer satisfaction
          </small>
        </div>
      </div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="row">
      <div className="col-md-8">
        <h5 className="mb-3">🔍 SEO & Marketing</h5>
        
        <div className="mb-3">
          <label className="form-label">SEO Title</label>
          <input
            type="text"
            name="meta_title"
            className="form-control"
            value={form.meta_title}
            onChange={handleInputChange}
            placeholder="SEO optimized title for search engines"
          />
          <div className="form-text">Recommended: 50-60 characters</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Meta Description</label>
          <textarea
            name="meta_description"
            className="form-control"
            rows={3}
            value={form.meta_description}
            onChange={handleInputChange}
            placeholder="Brief description for search engines and social media..."
          />
          <div className="form-text">Recommended: 150-160 characters</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            className="form-control"
            value={form.meta_keywords}
            onChange={handleInputChange}
            placeholder="flowers, gifts, delivery, birthday, anniversary"
          />
          <div className="form-text">Separate keywords with commas</div>
        </div>

        <div className="mb-3">
          <label className="form-label">URL Slug</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={form.slug}
            onChange={handleInputChange}
            placeholder="red-roses-bouquet-12-stems"
          />
          <div className="form-text">URL-friendly version of the product name</div>
        </div>
      </div>

      <div className="col-md-4">
        <h5 className="mb-3">📸 Product Images</h5>
        
        <div className="mb-4">
          <label className="form-label">Main Product Image <span className="text-danger">*</span></label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleMainImageChange}
          />
          <div className="form-text text-primary">
            <small>
              • This will be the primary display image<br/>
              • Recommended: 800x800px minimum<br/>
              • Formats: JPG, PNG, WebP
            </small>
          </div>
          {form.main_image && (
            <div className="mt-2">
              <img 
                src={URL.createObjectURL(form.main_image)} 
                alt="Main product preview" 
                className="img-thumbnail"
                style={{width: '100px', height: '100px', objectFit: 'cover'}}
              />
              <div className="text-success mt-1">
                <small>✅ Main image: {form.main_image.name}</small>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Gallery Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleGalleryImagesChange}
          />
          <div className="form-text text-info">
            <small>
              • Upload multiple product images<br/>
              • Shows different angles/views<br/>
              • Max 10 images recommended
            </small>
          </div>
          {form.gallery_images.length > 0 && (
            <div className="mt-2">
              <div className="d-flex flex-wrap gap-2">
                {form.gallery_images.map((file, index) => (
                  <div key={index} className="position-relative">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Gallery preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                    />
                  </div>
                ))}
              </div>
              <div className="text-success mt-1">
                <small>✅ {form.gallery_images.length} gallery images</small>
              </div>
            </div>
          )}
        </div>

        <div className="card bg-light">
          <div className="card-body">
            <h6 className="card-title">📊 Image Guidelines</h6>
            <small className="text-muted">
              • Use high-quality, well-lit images<br/>
              • Show product from multiple angles<br/>
              • Include lifestyle/context shots<br/>
              • Optimize file sizes (&lt;2MB each)<br/>
              • Maintain consistent style
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🛍️ Create New Product</h3>
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
                {loading ? '⏳ Creating...' : '✅ Create Product'}
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