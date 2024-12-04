import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubsubcategoryManager = () => {
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newSubsubcategoryName, setNewSubsubcategoryName] = useState('');
  const [newSubsubcategoryImage, setNewSubsubcategoryImage] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Toggle between adding and editing
  const [editingSubsubcategoryId, setEditingSubsubcategoryId] = useState(null);

  // Fetch subsubcategories
  const fetchSubsubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subsubcategories');
      setSubsubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subsubcategories:', error);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Add a new subsubcategory
  const handleAddSubsubcategory = async (e) => {
    e.preventDefault();
    if (!newSubsubcategoryImage || !selectedSubcategoryId) {
      console.error('Please select a subcategory and image before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newSubsubcategoryName);
    formData.append('image', newSubsubcategoryImage);
    formData.append('subcategoryId', selectedSubcategoryId);

    try {
      await axios.post('http://localhost:8080/api/subsubcategories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      resetForm();
      fetchSubsubcategories();
    } catch (error) {
      console.error('Error adding subsubcategory:', error);
    }
  };

  // Update an existing subsubcategory
  const handleUpdateSubsubcategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newSubsubcategoryName);
    formData.append('subcategoryId', selectedSubcategoryId);
    if (newSubsubcategoryImage) {
      formData.append('image', newSubsubcategoryImage);
    }

    try {
      await axios.put(`http://localhost:8080/api/subsubcategories/${editingSubsubcategoryId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      resetForm();
      fetchSubsubcategories();
    } catch (error) {
      console.error('Error updating subsubcategory:', error);
    }
  };

  // Reset form fields and editing state
  const resetForm = () => {
    setNewSubsubcategoryName('');
    setNewSubsubcategoryImage(null);
    setSelectedSubcategoryId('');
    setIsEditing(false);
    setEditingSubsubcategoryId(null);
  };

  // Pre-fill form for editing
  const handleEditSubsubcategory = (subsubcategory) => {
    setNewSubsubcategoryName(subsubcategory.name);
    setSelectedSubcategoryId(subsubcategory.subcategoryId);
    setIsEditing(true);
    setEditingSubsubcategoryId(subsubcategory.id);
  };

  // Delete a subsubcategory
  const handleDeleteSubsubcategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/subsubcategories/${id}`);
      fetchSubsubcategories();
    } catch (error) {
      console.error('Error deleting subsubcategory:', error);
    }
  };

  // Group subsubcategories by subcategoryId
  const groupedSubsubcategories = subcategories.map((subcategory) => {
    const subsubcategoriesForSubcategory = subsubcategories.filter(
      (subsubcategory) => subsubcategory.subcategoryId === subcategory.id
    );
    return {
      subcategory,
      subsubcategories: subsubcategoriesForSubcategory,
    };
  }).filter(group => group.subsubcategories.length > 0); // Only include subcategories with subsubcategories

  useEffect(() => {
    fetchSubsubcategories();
    fetchSubcategories();
  }, []);

  return (
    <div className="container"style={{ width: '500px' }}>
      <h3 className="my-4">Subsubcategory Manager</h3>
      <div className="card p-0">
      <h5 className="mb-3">{isEditing ? 'Edit Subsubcategory' : 'Add New Subsubcategory'}</h5>
      <form onSubmit={isEditing ? handleUpdateSubsubcategory : handleAddSubsubcategory} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Subsubcategory Name"
            value={newSubsubcategoryName}
            onChange={(e) => setNewSubsubcategoryName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setNewSubsubcategoryImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="mb-3">
          <select
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Add'}</button>
        {isEditing && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      </div>

      <h2 className="mb-3">Existing Subsubcategories</h2>
      {groupedSubsubcategories.length > 0 ? (
        groupedSubsubcategories.map((group) => (
          <div key={group.subcategory.id}>
            <h3>{group.subcategory.name}</h3>
            <ul className="list-group">
              {group.subsubcategories.map((subsubcategory) => (
                <li key={subsubcategory.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span>{subsubcategory.name}</span>
                    {subsubcategory.image && (
                      <img
                        src={`data:image/jpeg;base64,${subsubcategory.image}`}
                        alt={subsubcategory.name}
                        width={50}
                        className="ms-2"
                      />
                    )}
                  </div>
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditSubsubcategory(subsubcategory)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteSubsubcategory(subsubcategory.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No subsubcategories available.</p>
      )}
    </div>
  );
};

export default SubsubcategoryManager;
