import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubcategoryManager = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryImage, setNewSubcategoryImage] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);

 

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      console.error('Please select a category before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newSubcategoryName);
    if (newSubcategoryImage) {
      formData.append('image', newSubcategoryImage);
    }
    formData.append('categoryId', selectedCategoryId);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/subcategories/${editSubcategoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:8080/api/subcategories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setNewSubcategoryName('');
      setNewSubcategoryImage(null);
      setSelectedCategoryId('');
      setIsEditing(false);
      setEditSubcategoryId(null);
      fetchSubcategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/subcategories/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setIsEditing(true);
    setEditSubcategoryId(subcategory.id);
    setNewSubcategoryName(subcategory.name);
    setSelectedCategoryId(subcategory.categoryId);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSubcategoryId(null);
    setNewSubcategoryName('');
    setNewSubcategoryImage(null);
    setSelectedCategoryId('');
  };

  const groupedSubcategories = categories.map((category) => {
    const subcategoriesForCategory = subcategories.filter(
      (subcategory) => subcategory.categoryId === category.id
    );
    return {
      category,
      subcategories: subcategoriesForCategory,
    };
  });

  // Pagination logic
 

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  return (
    <div className="container my-0" style={{ width: '500px' }}>
      <h3 className="mb-1 text-center">Subcategory Manager</h3>
      {/* Add/Edit Form */}
      <div className="card p-0">
        <h5 className="mb-3"style={{height:'10px'}}>{isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}</h5>
        <form onSubmit={handleSaveSubcategory} className="mb-4">
          <div className="mb-1"style={{height:'40px'}}>
            <input
              type="text"
              className="form-control"
              placeholder="Subcategory Name"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              required
            />
          </div>
          <div className="mb-1"style={{height:'35px',width:'300px'}}>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setNewSubcategoryImage(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="mb-1"style={{height:'35px',width:'300px'}}>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary"style={{height:'35px',width:'300px'}}>
            {isEditing ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancelEdit} className="btn btn-secondary ms-2">
              Cancel
            </button>
          )}
        </form>
      </div>

      <h2 className="mb-3">Existing Subcategories</h2>
{groupedSubcategories.length > 0 ? (
  <div className="accordion" id="subcategoryAccordion">
    {groupedSubcategories.map((group, index) => (
      <div key={group.category.id} className="accordion-item">
        <h2 className="accordion-header" id={`heading${index}`}>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${index}`}
            aria-expanded="true"
            aria-controls={`collapse${index}`}
          >
            Parent Category - {group.category.name}
          </button>
        </h2>
        <div
          id={`collapse${index}`}
          className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
          aria-labelledby={`heading${index}`}
          data-bs-parent="#subcategoryAccordion"
        >
          <div className="accordion-body">
            <ul className="list-group">
              {group.subcategories.map((subcategory) => (
                <li
                  key={subcategory.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    {subcategory.image && (
                      <img
                        src={`data:image/jpeg;base64,${subcategory.image}`}
                        alt={subcategory.name}
                        width={50}
                        className="me-2"
                      />
                    )}
                    <span>{subcategory.name}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditSubcategory(subcategory)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="alert alert-info">No subcategories available.</div>
)}


     
    </div>
  );
};

export default SubcategoryManager;
