import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]); // Separate state for top categories
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [isTopCategory, setIsTopCategory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const [categoriesResponse, topCategoriesResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/categories'),
        axios.get('http://localhost:8080/api/categories/top'),
      ]);
      setCategories(categoriesResponse.data);
      setTopCategories(topCategoriesResponse.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryImage) {
      console.error('Please select an image before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCategoryName);
    formData.append('image', newCategoryImage);
    formData.append('topCategory', isTopCategory);

    try {
      await axios.post('http://localhost:8080/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewCategoryName('');
      setNewCategoryImage(null);
      setIsTopCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Edit an existing category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  // Update the category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editingCategory.name);
    formData.append('topCategory', editingCategory.topCategory);
    if (editingCategory.image) {
      formData.append('image', editingCategory.image);
    }

    try {
      await axios.put(`http://localhost:8080/api/categories/${editingCategory.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCategories();
      setIsEditing(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left side: Top Categories */}
        <div className="col-md-4">
          <h2>Top Categories</h2>
          <ul className="list-group">
            {topCategories.map((category) => (
              <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{category.name}</span>
                {category.image && (
                  <img
                    src={`data:image/jpeg;base64,${category.image}`}
                    alt={category.name}
                    width={50}
                    className="ms-2"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: All Categories + Management */}
        <div className="col-md-8">
          <h1>Category Manager</h1>

          {/* Add/Edit Form */}
          <div className="card mb-4">
            <div className="card-body">
              {isEditing ? (
                <div>
                  <h2>Edit Category</h2>
                  <form onSubmit={handleUpdateCategory}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        placeholder="Category Name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.files[0] })}
                        accept="image/*"
                      />
                    </div>
                    <div className="mb-3">
                      <label>
                        Top Category:
                        <input
                          type="checkbox"
                          checked={editingCategory.topCategory}
                          onChange={() =>
                            setEditingCategory({ ...editingCategory, topCategory: !editingCategory.topCategory })
                          }
                        />
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2>Add New Category</h2>
                  <form onSubmit={handleAddCategory}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setNewCategoryImage(e.target.files[0])}
                        accept="image/*"
                        required
                      />
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isTopCategory}
                        onChange={(e) => setIsTopCategory(e.target.checked)}
                      />
                      <label className="form-check-label">Top Category</label>
                    </div>
                    <button type="submit" className="btn btn-success">
                      Add Category
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* All Categories */}
          <h2>All Categories</h2>
          <ul className="list-group">
            {categories.map((category) => (
              <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{category.name}</span>
                {category.image && (
                  <img
                    src={`data:image/jpeg;base64,${category.image}`}
                    alt={category.name}
                    width={50}
                    className="ms-2"
                  />
                )}
                <div>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditCategory(category)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
