import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../layouts/AdminLayout';
import { Card, Row, Col, Button, Alert, Form, Table, ProgressBar, Badge } from 'react-bootstrap';
import { FaUpload, FaDownload, FaFileExcel, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface UploadStatus {
  file: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message: string;
  recordsProcessed?: number;
  totalRecords?: number;
}

const ExcelUpload = () => {
  const router = useRouter();
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const categoryFileRef = useRef<HTMLInputElement>(null);
  const subcategoryFileRef = useRef<HTMLInputElement>(null);
  const subsubcategoryFileRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  const sampleData = [
    {
      type: 'Categories',
      filename: 'categories.xlsx',
      fields: 'id, name, slug, banner, meta_title, meta_description, status, created_at',
      description: 'Main product categories like Cakes, Flowers, Gifts, etc.'
    },
    {
      type: 'Subcategories',
      filename: 'subcategories.xlsx',
      fields: 'id, name, slug, category_id, category_name, banner, meta_title, meta_description, status, created_at',
      description: 'Sub-categories under main categories like "By Occasion", "By Type", etc.'
    },
    {
      type: 'Subsubcategories',
      filename: 'subsubcategories.xlsx',
      fields: 'id, name, slug, category_id, category_name, subcategory_id, subcategory_name, banner, meta_title, meta_description, status, created_at',
      description: 'Detailed categories like "Birthday Cakes", "Red Roses", etc.'
    },
    {
      type: 'Products',
      filename: 'products.xlsx',
      fields: 'id, name, slug, description, price, sale_price, sku, stock_quantity, category_id, subcategory_id, subsubcategory_id, images, status, meta_title, meta_description, created_at',
      description: 'Individual products with all details and pricing information'
    }
  ];

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    const statusId = `${type}-${Date.now()}`;
    const newStatus: UploadStatus = {
      file: file.name,
      status: 'uploading',
      message: `Uploading ${type}...`,
      recordsProcessed: 0,
      totalRecords: 0
    };

    setUploadStatuses(prev => [...prev, newStatus]);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please login again');
        router.push('/admin/login');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('excel', file);

      // Determine the API endpoint based on type
      let endpoint = '';
      let redirectPath = '';
      switch (type.toLowerCase()) {
        case 'categories':
          endpoint = 'http://localhost:8000/api/admin/categories/upload-excel';
          redirectPath = '/admin/inventory/categories';
          break;
        case 'subcategories':
          endpoint = 'http://localhost:8000/api/admin/subcategories/upload-excel';
          redirectPath = '/admin/inventory/subcategories';
          break;
        case 'subsubcategories':
          endpoint = 'http://localhost:8000/api/admin/subsubcategories/upload-excel';
          redirectPath = '/admin/inventory/subsubcategories';
          break;
        case 'products':
          endpoint = 'http://localhost:8000/api/admin/products/upload-excel';
          redirectPath = '/admin/inventory/products';
          break;
        default:
          throw new Error('Invalid upload type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setUploadStatuses(prev => prev.map(status => 
          status.file === file.name 
            ? { 
                ...status, 
                status: 'success', 
                message: data.message || `Successfully uploaded ${type}`,
                recordsProcessed: data.records_count || data.total_records || 0,
                totalRecords: data.records_count || data.total_records || 0
              }
            : status
        ));

        toast.success(`${type} uploaded successfully! ${data.records_count || ''} records processed.`);
        
        // Redirect to the appropriate page after a short delay
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);

      } else {
        // Error
        setUploadStatuses(prev => prev.map(status => 
          status.file === file.name 
            ? { 
                ...status, 
                status: 'error', 
                message: data.message || `Failed to upload ${type}` 
              }
            : status
        ));

        toast.error(data.message || `Failed to upload ${type}`);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      
      setUploadStatuses(prev => prev.map(status => 
        status.file === file.name 
          ? { 
              ...status, 
              status: 'error', 
              message: `Upload failed: ${error.message}` 
            }
          : status
      ));

      toast.error('Upload failed. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = (filename: string) => {
    // In a real implementation, this would download the actual Excel file
    const link = document.createElement('a');
    link.href = `/api/download-sample/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearUploadHistory = () => {
    setUploadStatuses([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'uploading': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <FaCheck />;
      case 'error': return <FaTimes />;
      case 'uploading': return <FaUpload className="spinner-border spinner-border-sm" />;
      default: return <FaFileExcel />;
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Excel Bulk Upload</h4>
                <Button 
                  variant="outline-secondary" 
                  onClick={clearUploadHistory}
                  disabled={uploadStatuses.length === 0}
                >
                  Clear History
                </Button>
              </Card.Header>
              <Card.Body>
                <Alert variant="info">
                  <strong>Upload Instructions:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Upload Order:</strong> Categories → Subcategories → Subsubcategories → Products</li>
                    <li><strong>File Format:</strong> Only .xlsx (Excel) files are supported</li>
                    <li><strong>Data Processing:</strong> Files will be uploaded to backend API</li>
                    <li><strong>Auto Redirect:</strong> Successfully uploaded categories will redirect to categories page</li>
                    <li><strong>Backup:</strong> Always backup existing data before bulk upload</li>
                  </ul>
                </Alert>

                {/* Upload Sections */}
                <Row className="mt-4">
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="h-100">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">1. Categories</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <FaFileExcel size={40} className="text-success mb-3" />
                        <p className="small text-muted mb-3">
                          Upload main categories first (Cakes, Flowers, etc.)
                        </p>
                        <Form.Control
                          ref={categoryFileRef}
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'Categories');
                          }}
                          className="mb-2"
                        />
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleDownloadSample('categories.xlsx')}
                          className="w-100"
                        >
                          <FaDownload /> Download Sample
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-3">
                    <Card className="h-100">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">2. Subcategories</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <FaFileExcel size={40} className="text-warning mb-3" />
                        <p className="small text-muted mb-3">
                          Upload after categories (By Occasion, By Type, etc.)
                        </p>
                        <Form.Control
                          ref={subcategoryFileRef}
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'Subcategories');
                          }}
                          className="mb-2"
                        />
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleDownloadSample('subcategories.xlsx')}
                          className="w-100"
                        >
                          <FaDownload /> Download Sample
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-3">
                    <Card className="h-100">
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">3. Subsubcategories</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <FaFileExcel size={40} className="text-info mb-3" />
                        <p className="small text-muted mb-3">
                          Upload detailed categories (Birthday Cakes, etc.)
                        </p>
                        <Form.Control
                          ref={subsubcategoryFileRef}
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'Subsubcategories');
                          }}
                          className="mb-2"
                        />
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleDownloadSample('subsubcategories.xlsx')}
                          className="w-100"
                        >
                          <FaDownload /> Download Sample
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-3">
                    <Card className="h-100">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">4. Products</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <FaFileExcel size={40} className="text-success mb-3" />
                        <p className="small text-muted mb-3">
                          Upload products last with all details
                        </p>
                        <Form.Control
                          ref={productFileRef}
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'Products');
                          }}
                          className="mb-2"
                        />
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleDownloadSample('products.xlsx')}
                          className="w-100"
                        >
                          <FaDownload /> Download Sample
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Upload Status */}
                {uploadStatuses.length > 0 && (
                  <Card className="mt-4">
                    <Card.Header>
                      <h5 className="mb-0">Upload Status</h5>
                    </Card.Header>
                    <Card.Body>
                      {uploadStatuses.map((status, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                              {getStatusIcon(status.status)}
                              <strong>{status.file}</strong>
                              <Badge bg={getStatusColor(status.status)}>
                                {status.status}
                              </Badge>
                            </div>
                            {status.recordsProcessed !== undefined && status.totalRecords !== undefined && (
                              <small className="text-muted">
                                {status.recordsProcessed}/{status.totalRecords} records
                              </small>
                            )}
                          </div>
                          {status.status === 'uploading' && status.totalRecords && (
                            <ProgressBar 
                              now={(status.recordsProcessed! / status.totalRecords) * 100}
                              label={`${Math.round((status.recordsProcessed! / status.totalRecords) * 100)}%`}
                              className="mb-2"
                            />
                          )}
                          <p className="text-muted mb-0 small">{status.message}</p>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}

                {/* Sample Data Structure */}
                <Card className="mt-4">
                  <Card.Header>
                    <h5 className="mb-0">Excel File Structure</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>File Type</th>
                          <th>Filename</th>
                          <th>Required Fields</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData.map((item, index) => (
                          <tr key={index}>
                            <td><strong>{item.type}</strong></td>
                            <td><code>{item.filename}</code></td>
                            <td>
                              <small className="text-muted">{item.fields}</small>
                            </td>
                            <td>{item.description}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleDownloadSample(item.filename)}
                              >
                                <FaEye /> View Sample
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default ExcelUpload;