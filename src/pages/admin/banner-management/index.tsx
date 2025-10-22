import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button, Modal, Form, Table, Card, Row, Col, Badge, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { getApiUrl, getUploadUrl } from 'src/utils/api';
import navigationLocal from 'src/data/navigation.json';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Banner {
  id: number;
  title: string;
  sub_title: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  position: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    description: '',
    backgroundColor: '',
    textColor: '',
    image: '',
    imageFile: null as File | null,
    buttonText: '',
    buttonLink: '',
    type: 'static',
    categoryId: '',
    placement: '',
    position: 1,
    status: 'active' as 'active' | 'inactive'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [toggling, setToggling] = useState<Record<number, boolean>>({});

  const [staticPages, setStaticPages] = useState<Array<{ key: string; label: string; path: string }>>([]);

  const handleShowModal = (banner?: Banner) => {
    if (banner) {
      setFormData({
        title: banner.title,
        sub_title: banner.sub_title || '',
        description: (banner as any).description || '',
        backgroundColor: (banner as any).backgroundColor || (banner as any).background_color || '',
        textColor: (banner as any).textColor || (banner as any).text_color || '',
        image: banner.image,
        imageFile: null,
        type: (banner as any).type || 'static',
        categoryId: (banner as any).categoryId || '',
        placement: (banner as any).placement || '',
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        position: banner.position,
        status: banner.status
      });
      setSelectedBanner(banner);
      setIsEditing(true);
    } else {
      setFormData({
        title: '',
        sub_title: '',
        description: '',
        backgroundColor: '',
        textColor: '',
        image: '',
        imageFile: null,
        type: 'static',
        categoryId: '',
        placement: '',
        buttonText: '',
        buttonLink: '',
        position: banners.length + 1,
        status: 'active'
      });
      setSelectedBanner(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBanner(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // if changing category, try fill slug
    if (name === 'categoryId') {
      const cat = categories.find(c => String(c.id || c._id) === String(value));
      // when dynamic, auto-fill buttonLink to /products/{slug}
      if ((formData as any).type === 'dynamic') {
        const slug = cat?.slug || cat?.name || value;
        setFormData(prev => ({ ...prev, [name]: value, buttonLink: `/products/${slug}` }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => { fetchCategories(); fetchBanners(); }, []);
  useEffect(() => { fetchNavigation(); }, []);

  const fetchNavigation = async () => {
    try {
      const resp = await fetch(getApiUrl('/home/navigation'));
      if (resp.ok) {
        const data = await resp.json();
        // map backend navigation to minimal static pages list by label or path hints
        const pages: any[] = [];
        // helper: recursively collect nav items into flat list
        const flat: any[] = [];
        const walk = (items: any[]) => {
          if (!Array.isArray(items)) return;
          for (const it of items) {
            flat.push(it);
            // check common nested containers (subcategories/subSubcategories)
            if (Array.isArray(it.subcategories)) walk(it.subcategories);
            if (Array.isArray(it.subSubcategories)) walk(it.subSubcategories);
            if (Array.isArray(it.children)) walk(it.children);
          }
        };
        walk(data || []);
        // merge with local fallback list
        walk(navigationLocal || []);

        const findItem = (pred: (item:any)=>boolean) => flat.find(pred);

        const addKnown = (key: string, label: string, hint: string) => {
          const itm = findItem((n:any) => (n.name || n.label || '').toString().toLowerCase().includes(hint));
          let path = itm?.path || '';
          // if item has slug (category-like), prefer product path
          if (!path && itm?.slug) path = `/products/${itm.slug}`;
          if (!path && itm?.name) path = `/${String(itm.name).toLowerCase().replace(/\s+/g,'-')}`;
          pages.push({ key, label: itm?.name || label, path: path || `/${key}` });
        };

        addKnown('about-us', 'About Us', 'about');
        addKnown('privacy-policy', 'Privacy Policy', 'privacy');
        addKnown('contact-us', 'Contact Us', 'contact');
        addKnown('faq', 'FAQ', 'faq');
        addKnown('blogs', 'Blogs', 'blog');
        // include home positions
        pages.push({ key: 'home_top', label: 'Home Top', path: '/' });
        pages.push({ key: 'home_middle', label: 'Home Middle', path: '/home_middle' });
        pages.push({ key: 'home_bottom', label: 'Home Bottom', path: '/home_bottom' });
        setStaticPages(pages);
        return;
      }
    } catch (e) {
      console.warn('fetchNavigation failed, falling back to local', e);
    }
    // fallback to local navigation.json
    const pagesFallback = [
      { key: 'about-us', label: 'About Us', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('about'))?.path) || '/about-us' },
      { key: 'privacy-policy', label: 'Privacy Policy', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('privacy'))?.path) || '/privacy-policy' },
      { key: 'contact-us', label: 'Contact Us', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('contact'))?.path) || '/contact-us' },
      { key: 'faq', label: 'FAQ', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('faq'))?.path) || '/faq' },
      { key: 'blogs', label: 'Blogs', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('blog'))?.path) || '/blogs' },
      { key: 'home_top', label: 'Home Top', path: '/' },
      { key: 'home_middle', label: 'Home Middle', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('home'))?.path) || '/home_middle' },
      { key: 'home_bottom', label: 'Home Bottom', path: (navigationLocal.find((n:any)=> (n.label||'').toLowerCase().includes('home'))?.path) || '/home_bottom' }
    ];
    setStaticPages(pagesFallback);
  };
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      const items = Array.isArray(data) ? data : data.data || [];
      setCategories(items);
    } catch (e) { console.error('fetchCategories', e); }
  };

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/banners'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      const items = Array.isArray(data) ? data : data.data || [];
      // normalize backend fields to UI expected shape
      const mapped = items.map((it: any) => ({
        id: it.id || it._id,
        title: it.title || it.name || '',
        sub_title: it.sub_title || it.description || '',
        description: it.description || it.sub_title || '',
        image: it.image ? getUploadUrl(String(it.image)) : '',
        type: it.type || 'static',
        placement: it.placement || '',
        buttonText: it.button_text || it.buttonText || '',
        buttonLink: it.button_url || it.buttonLink || '',
        categoryId: it.category_id || it.categoryId || '',
        backgroundColor: it.backgroundColor || it.background_color || it.bgColor || '',
        textColor: it.textColor || it.text_color || it.color || '',
        position: it.sort_order || it.position || 0,
        status: (typeof it.status === 'boolean') ? (it.status ? 'active' : 'inactive') : (it.status || 'inactive'),
        createdAt: it.created_at || it.createdAt || ''
      }));
      setBanners(mapped);
    } catch (e) { console.error('fetchBanners', e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
    const fd = new FormData();
  const keys = ['title','sub_title','description','backgroundColor','textColor','type','categoryId','placement','buttonText','buttonLink','position'];
    keys.forEach(k => { if ((formData as any)[k] !== undefined) fd.append(k, String((formData as any)[k])); });
    // status: backend expects boolean-like value; convert from 'active'/'inactive'
    const statusBool = ((formData as any).status === 'active');
    fd.append('status', statusBool ? 'true' : 'false');
    if ((formData as any).imageFile) fd.append('image', (formData as any).imageFile as File);

      let resp: Response;
      if (isEditing && selectedBanner) {
        resp = await fetch(getApiUrl(`/admin/banner/${selectedBanner.id}`), { method: 'PUT', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      } else {
        resp = await fetch(getApiUrl('/admin/banner'), { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      }
      if (resp.ok) {
        // refresh and close
        await fetchBanners();
        handleCloseModal();
        toast.success(isEditing ? 'Banner updated' : 'Banner created');
      } else {
        const body = await resp.json().catch(()=> ({}));
        toast.error(body?.message || 'Failed saving banner');
      }
  } catch (err) { console.error(err); toast.error('Error saving'); }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    (async ()=>{
      try {
        const token = localStorage.getItem('access_token');
        const resp = await fetch(getApiUrl(`/admin/banner/${id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
  if (resp.ok) { await fetchBanners(); toast.success('Banner deleted'); } else { toast.error('Failed to delete'); }
  } catch (e) { console.error(e); toast.error('Error deleting'); }
    })();
  };

  const toggleStatus = (id: number) => {
    (async ()=>{
      if (toggling[id]) return; // already toggling
      setToggling(prev => ({ ...prev, [id]: true }));
      try {
        const token = localStorage.getItem('access_token');
        // determine current status: prefer local state
        let current = banners.find(b => Number(b.id) === Number(id));
        if (!current) {
          // try fetching single banner from API
          const g = await fetch(getApiUrl(`/admin/banner/${id}`), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
          if (!g.ok) {
            const body = await g.json().catch(()=> ({}));
            toast.error(body?.message || 'Banner not found');
            setToggling(prev => ({ ...prev, [id]: false }));
            return;
          }
          current = await g.json();
        }
        if (!current) {
          toast.error('Banner not found');
          setToggling(prev => ({ ...prev, [id]: false }));
          return;
        }
        const statusVal = typeof current.status === 'boolean' ? current.status : (String(current.status).toLowerCase() === 'active' || String(current.status).toLowerCase() === 'true');
        const nextStatus = statusVal ? false : true;

        // Try JSON status endpoint first
        try {
          const resp = await fetch(getApiUrl(`/admin/banner/status/${id}`), {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ status: nextStatus })
          });
          if (resp.ok) {
            toast.success('Banner status updated');
            await fetchBanners();
            setToggling(prev => ({ ...prev, [id]: false }));
            return;
          }
        } catch (e) {
          // fallthrough to multipart fallback
          console.warn('JSON status endpoint failed, will try multipart update', e);
        }

        // Fallback: send FormData to PUT /admin/banner/{id}
        try {
          const fd = new FormData();
          fd.append('status', nextStatus ? 'true' : 'false');
          const upd = await fetch(getApiUrl(`/admin/banner/${id}`), { method: 'PUT', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
          if (upd.ok) {
            toast.success('Banner status updated');
            await fetchBanners();
          } else {
            const body = await upd.json().catch(()=> ({}));
            toast.error(body?.message || 'Failed to update status');
          }
        } catch (e) {
          console.error(e);
          toast.error('Error toggling status');
        }
      } catch (e) { console.error(e); toast.error('Error toggling status'); }
      finally { setToggling(prev => ({ ...prev, [id]: false })); }
    })();
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Banner Management</h4>
                <Button 
                  variant="dark" 
                  onClick={() => handleShowModal()}
                  className="d-flex align-items-center gap-2"
                >
                  <FaPlus /> Add New Banner
                </Button>
              </Card.Header>
              <Card.Body>
                <Alert variant="info">
                  <strong>Banner Guidelines:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Recommended image size: 1920x600 pixels</li>
                    <li>Maximum file size: 2MB</li>
                    <li>Supported formats: JPG, PNG, WebP</li>
                    <li>Position determines display order (1 = first)</li>
                  </ul>
                </Alert>

                <Table responsive hover className="mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>Position</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Button Link</th>
                      <th>Subtitle</th>
                      <th>Button Text</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners
                      .sort((a, b) => a.position - b.position)
                      .map((banner) => {
                        const b: any = banner;
                        const derivedLink = b.buttonLink || (b.type === 'dynamic' ? (categories.find(c => String(c.id || c._id) === String(b.categoryId))?.slug ? `/products/${categories.find(c => String(c.id || c._id) === String(b.categoryId))?.slug}` : '-') : '-');
                        return (
                        <tr key={b.id}>
                        <td>
                          <Badge bg="secondary">{banner.position}</Badge>
                        </td>
                        <td>
                          <strong>{banner.title}</strong>
                        </td>
                        <td>{b.type || 'static'}</td>
                        <td>{derivedLink}</td>
                        <td className="text-muted">{b.sub_title}</td>
                        <td>
                          <Badge bg="dark">{b.buttonText}</Badge>
                        </td>
                        <td>
                          <Badge bg={b.status === 'active' ? 'success' : 'danger'}>
                            {b.status}
                          </Badge>
                        </td>
                        <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleShowModal(b)}
                              title="Edit"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant={banner.status === 'active' ? 'outline-warning' : 'outline-success'}
                              size="sm"
                              onClick={() => toggleStatus(b.id)}
                              title="Toggle Status"
                            >
                              {b.status === 'active' ? <FaToggleOff /> : <FaToggleOn />}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(b.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </Table>

                {banners.length === 0 && (
                  <div className="text-center py-5">
                    <h5 className="text-muted">No banners found</h5>
                    <p className="text-muted">Click "Add New Banner" to create your first banner.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Banner Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? 'Edit Banner' : 'Add New Banner'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter banner title"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtitle</Form.Label>
                    <Form.Control
                      type="text"
                      name="sub_title"
                      value={formData.sub_title}
                      onChange={handleInputChange}
                      placeholder="Enter banner subtitle"
                    />
                  </Form.Group>
                </Col>
              </Row>


              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type *</Form.Label>
                    <Form.Select name="type" value={(formData as any).type} onChange={(e:any)=>{
                      const t = e.target.value;
                      setFormData(prev => ({ ...prev, type: t, categoryId: '', buttonLink: '' }));
                    }}>
                      <option value="static">Static</option>
                      <option value="dynamic">Dynamic (category)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>{(formData as any).type === 'dynamic' ? 'Category' : 'Page'}</Form.Label>
                    <Form.Select name="categoryId" value={(formData as any).categoryId} onChange={(e:any)=>{
                      const val = e.target.value;
                                      if ((formData as any).type === 'dynamic') {
                                        const cat = categories.find(c => String(c.id || c._id) === String(val));
                                        const slug = cat?.slug || cat?.name || val;
                                        // set placement for dynamic category banners
                                        setFormData(prev => ({ ...prev, categoryId: val, buttonLink: `/products/${slug}`, placement: 'home slider' }));
                      } else {
                                        // static: val is one of our staticPages.key — find path
                                        const sp = staticPages.find(p=>p.key===val);
                                        setFormData(prev => ({ ...prev, categoryId: val, buttonLink: sp ? sp.path : `/${val}`, placement: '' }));
                      }
                    }}>
                      <option value="">-- Select --</option>
                      {(formData as any).type === 'dynamic' ? (
                        categories.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)
                      ) : (
                        staticPages.map(p => <option key={p.key} value={p.key}>{p.label}</option>)
                      )}
                    </Form.Select>
                  </Form.Group>
                  { (formData as any).placement && (
                    <div style={{ marginTop: 6, marginBottom: 8 }}>
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip id={`placement-tooltip`}>This determines where the banner will display on the storefront.</Tooltip>}>
                        <span style={{ color: 'green', fontWeight: 600 }}>Placement: {String((formData as any).placement)}</span>
                      </OverlayTrigger>
                    </div>
                  )}
                </Col>

              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Button Text *</Form.Label>
                    <Form.Control
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      placeholder="e.g., Shop Now, Order Now"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Button Link *</Form.Label>
                    <Form.Control
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      placeholder="e.g., /flowers, /cakes"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" rows={3} value={(formData as any).description} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Background (CSS)</Form.Label>
                    <Form.Control type="text" name="backgroundColor" value={(formData as any).backgroundColor} placeholder="e.g. linear-gradient(135deg,#667eea,#764ba2) or #fff" onChange={handleInputChange} />
                    <Form.Text className="text-muted">Enter a CSS background value or color.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Text Color</Form.Label>
                    <Form.Control type="text" name="textColor" value={(formData as any).textColor} placeholder="e.g. white or #000" onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Banner Image Upload</Form.Label>
                    <Form.Control type="file" onChange={(e:any) => {
                      const f = e.target.files?.[0];
                      if (f) { setFormData(prev=> ({...prev, image: f.name, imageFile: f})); setImagePreview(URL.createObjectURL(f)); }
                    }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {imagePreview && <img src={imagePreview} style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />}
                </Col>
              </Row>


              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position *</Form.Label>
                    <Form.Control
                      type="number"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                    <Form.Text className="text-muted">
                      Lower numbers appear first (1 = first banner)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status *</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="dark" type="submit">
                {isEditing ? 'Update Banner' : 'Create Banner'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default BannerManagement;