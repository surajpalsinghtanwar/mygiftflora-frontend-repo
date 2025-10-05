import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchSubSubcategories, deleteSubSubcategory } from '../../../store/subsubcategorySlice';
import { toast } from 'react-toastify';

const SubSubcategories: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { subSubcategories, loading, error } = useSelector((state: RootState) => state.subSubcategories);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subcategories } = useSelector((state: RootState) => state.subcategories);

  useEffect(() => {
    dispatch(fetchSubSubcategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sub-subcategory?')) {
      try {
        await dispatch(deleteSubSubcategory(id)).unwrap();
        toast.success('Sub-subcategory deleted successfully');
      } catch (error) {
        toast.error('Failed to delete sub-subcategory');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
    return subcategory?.name || 'Unknown Subcategory';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Sub-subcategories</h6>
            <button
              className="btn btn-primary btn-sm mb-0"
              onClick={() => navigate('/inventory/subsubcategory/create')}
            >
              Add New Sub-subcategory
            </button>
          </div>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subSubcategories.map((subSubcategory) => (
                  <tr key={subSubcategory.id}>
                    <td>
                      {subSubcategory.icon && (
                        <i className={subSubcategory.icon} style={{ fontSize: '24px' }}></i>
                      )}
                    </td>
                    <td>
                      {subSubcategory.image && (
                        <img
                          src={subSubcategory.image}
                          alt={subSubcategory.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      )}
                    </td>
                    <td>{subSubcategory.name}</td>
                    <td>{getCategoryName(subSubcategory.categoryId)}</td>
                    <td>{getSubcategoryName(subSubcategory.subcategoryId)}</td>
                    <td>
                      <button
                        className="btn btn-link text-secondary mb-0"
                        onClick={() => navigate(`/inventory/subsubcategory/edit/${subSubcategory.id}`)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-link text-danger mb-0"
                        onClick={() => handleDelete(subSubcategory.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSubcategories;
