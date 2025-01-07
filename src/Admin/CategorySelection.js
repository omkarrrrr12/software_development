import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategorySelection = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();  // For redirecting to the display page

    useEffect(() => {
        // Fetch categories from the backend
        axios.get('http://localhost:8080/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

        // Retrieve the selected category from localStorage on component mount
        const storedCategoryId = localStorage.getItem('selectedCategory');
        if (storedCategoryId) {
            setSelectedCategory(storedCategoryId);
        }

        // Optionally, fetch the selected category from the backend (if required)
        axios.get('http://localhost:8080/api/selected-category')
            .then(response => {
                setSelectedCategory(response.data?.categoryId || storedCategoryId);  // Use stored category if backend doesn't return one
            })
            .catch(error => {
                console.error("Error fetching selected category:", error);
            });
    }, []);

    const handleCategorySelect = (categoryId) => {
        // Store the selected category in localStorage
        localStorage.setItem('selectedCategory', categoryId);
        
        // Optionally, store the selected category on the backend
        axios.post('http://localhost:8080/api/selected-category/update', null, {
            params: { categoryId }
        }).then(() => {
            setSelectedCategory(categoryId);  // Update the selected category state
            // Redirect to the products display page
              // Assuming you navigate to a category display page
        }).catch(error => {
            console.error("Error updating selected category:", error);
        });
    };

    return (
        <div>
            <h2>Select a Category</h2>
            <ul className="list-group">
                {categories.map(category => (
                    <li key={category.id} className="list-group-item">
                        <button
                            onClick={() => handleCategorySelect(category.id)}
                            className={`btn ${category.id === selectedCategory ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{
                                backgroundColor: category.id === selectedCategory ? '#007bff' : 'transparent',
                                color: category.id === selectedCategory ? '#fff' : '#000',
                            }}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategorySelection;
