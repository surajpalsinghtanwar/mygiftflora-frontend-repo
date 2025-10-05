import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { createCategory } from '../../../store/categorySlice';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaCouch, FaBed, FaChair, FaStore, FaHome, FaLightbulb, FaBoxOpen, FaTshirt, FaUtensils, FaLaptop, FaMobileAlt, FaTv, FaBath, FaDoorOpen, FaWarehouse, FaShoePrints } from 'react-icons/fa';
import { MdOutlineBedroomParent, MdOutlineLiving, MdOutlineKitchen, MdOutlineChair, MdOutlineTableBar, MdOutlineStore, MdOutlineBathroom, MdOutlineLight, MdOutlineMeetingRoom, MdOutlineWeekend, MdOutlineDeck, MdOutlineLocalMall, MdOutlineShoppingCart, MdOutlineHome, MdOutlineBed } from 'react-icons/md';

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [iconSearch, setIconSearch] = useState('');
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please enter a name.');
      return;
    }
    try {
      const resultAction = await dispatch(
        createCategory({
          name,
          icon: icon || '',
          banner: banner || undefined,
        })
      ).unwrap();
      toast.success('Category created successfully!');
      navigate('/inventory/categories');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create category');
    }
  };

  // Curated icon set for e-commerce/interior
  const curatedIcons = [
    { key: 'FaShoppingCart', label: 'Cart', icon: FaShoppingCart },
    { key: 'FaStore', label: 'Store', icon: FaStore },
    { key: 'FaHome', label: 'Home', icon: FaHome },
    { key: 'FaCouch', label: 'Couch', icon: FaCouch },
    { key: 'FaBed', label: 'Bed', icon: FaBed },
    { key: 'FaChair', label: 'Chair', icon: FaChair },
    { key: 'FaLightbulb', label: 'Lightbulb', icon: FaLightbulb },
    { key: 'FaBoxOpen', label: 'Box', icon: FaBoxOpen },
    { key: 'FaTshirt', label: 'T-shirt', icon: FaTshirt },
    { key: 'FaUtensils', label: 'Utensils', icon: FaUtensils },
    { key: 'FaLaptop', label: 'Laptop', icon: FaLaptop },
    { key: 'FaMobileAlt', label: 'Mobile', icon: FaMobileAlt },
    { key: 'FaTv', label: 'TV', icon: FaTv },
    { key: 'FaBath', label: 'Bath', icon: FaBath },
    { key: 'FaDoorOpen', label: 'Door', icon: FaDoorOpen },
    { key: 'FaWarehouse', label: 'Warehouse', icon: FaWarehouse },
    { key: 'FaShoePrints', label: 'Shoes', icon: FaShoePrints },
  // Material Design
  { key: 'MdOutlineBedroomParent', label: 'Bedroom', icon: MdOutlineBedroomParent },
  { key: 'MdOutlineLiving', label: 'Living Room', icon: MdOutlineLiving },
  { key: 'MdOutlineKitchen', label: 'Kitchen', icon: MdOutlineKitchen },
  { key: 'MdOutlineChair', label: 'Chair (MD)', icon: MdOutlineChair },
  { key: 'MdOutlineTableBar', label: 'Table', icon: MdOutlineTableBar },
  { key: 'MdOutlineStore', label: 'Store (MD)', icon: MdOutlineStore },
  { key: 'MdOutlineBathroom', label: 'Bathroom', icon: MdOutlineBathroom },
  { key: 'MdOutlineLight', label: 'Light (MD)', icon: MdOutlineLight },
  { key: 'MdOutlineMeetingRoom', label: 'Meeting Room', icon: MdOutlineMeetingRoom },
  { key: 'MdOutlineWeekend', label: 'Weekend', icon: MdOutlineWeekend },
  { key: 'MdOutlineDeck', label: 'Deck', icon: MdOutlineDeck },
  { key: 'MdOutlineLocalMall', label: 'Mall', icon: MdOutlineLocalMall },
  { key: 'MdOutlineShoppingCart', label: 'Cart (MD)', icon: MdOutlineShoppingCart },
  { key: 'MdOutlineHome', label: 'Home (MD)', icon: MdOutlineHome },
  { key: 'MdOutlineBed', label: 'Bed (MD)', icon: MdOutlineBed },
  ];

  const filteredIcons = curatedIcons.filter((item) =>
    item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    item.key.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Create Category</h2>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/inventory/categories')}
                >
                  Back to Categories
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3" style={{ position: 'relative' }}>
                  <label className="form-label">Icon</label>
                  <div className="input-group" style={{ cursor: 'pointer' }}>
                    <div
                      className="form-control d-flex align-items-center"
                      onClick={() => setShowIconDropdown((v) => !v)}
                      tabIndex={0}
                      style={{ minHeight: 38 }}
                    >
                      {icon ? (
                        <span className="me-2">
                          {curatedIcons.find(i => i.key === icon)?.icon ?
                            React.createElement(curatedIcons.find(i => i.key === icon)!.icon, { style: { fontSize: 20 } }) :
                            <span className="text-muted">Select an icon...</span>
                          }
                        </span>
                      ) : (
                        <span className="text-muted">Select an icon...</span>
                      )}
                      <span style={{ flex: 1 }}>{curatedIcons.find(i => i.key === icon)?.label || ''}</span>
                      <span className="ms-auto"><i className="fa fa-chevron-down" /></span>
                    </div>
                  </div>
                  {showIconDropdown && (
                    <div style={{ position: 'absolute', zIndex: 1000, background: '#fff', border: '1px solid #ccc', borderRadius: 6, width: '100%', maxHeight: 320, overflowY: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <div className="p-2">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Search icons..."
                          value={iconSearch}
                          onChange={e => setIconSearch(e.target.value)}
                          autoFocus
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {filteredIcons.map((item) => {
                            const IconComp = item.icon;
                            return (
                              <button
                                key={item.key}
                                type="button"
                                className={`btn btn-light border d-flex flex-column align-items-center justify-content-center${icon === item.key ? ' border-primary' : ''}`}
                                style={{ width: 60, height: 60 }}
                                onClick={() => {
                                  setIcon(item.key);
                                  setShowIconDropdown(false);
                                }}
                              >
                                <IconComp style={{ fontSize: 22 }} />
                                <span style={{ fontSize: 9, marginTop: 2 }}>{item.label}</span>
                              </button>
                            );
                          })}
                          {filteredIcons.length === 0 && <div className="text-muted">No icons found.</div>}
                        </div>
                      </div>
                    </div>
                  )}
                  {icon && (
                    <div className="mt-2">
                      <label className="form-label">Icon Preview:</label>
                      <div className="border rounded p-3 d-inline-block">
                        {curatedIcons.find(i => i.key === icon)?.icon ?
                          React.createElement(curatedIcons.find(i => i.key === icon)!.icon, { style: { fontSize: '24px' } }) :
                          <span>Invalid icon</span>
                        }
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Category Banner</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                  {bannerPreview && (
                    <div className="mt-2">
                      <label className="form-label">Banner Preview:</label>
                      <div className="border rounded p-2" style={{ maxWidth: '200px' }}>
                        <img
                          src={bannerPreview}
                          alt="Category banner preview"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary me-2">
                    Create Category
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/inventory/categories')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
