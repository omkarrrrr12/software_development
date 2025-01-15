// AddProductForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onCancel, fetchProducts,categories, subcategories, subsubcategories }) => {
    const [product, setProduct] = useState({
        name: '',
        // productCode: '',
        price: 0,
        taxAmount: 0,
        hsnCode: '',
        inStock: true,
        quantity: 0,
        description: '',
        keyFeatures: [],
        dimensions: '',
        otherDimensions: '',
        productWeight: '',
        power: 0,
        material: '',
        color: '',
        capacity: '',
        categoryId: null,
        subcategoryId: null,
        subsubcategoryId: null,// Keep subsubcategoryId as null by default
        isNewArrival: false,  // Added isNewArrival field
        isMostSelling:false,
    });

    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : (name === 'price' || name === 'taxAmount' || name === 'quantity' || name === 'power') ? (value ? Number(value) : undefined) : value;

        setProduct({ ...product, [name]: newValue });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:8080/api/products';
        const method = 'POST';

        const formData = new FormData();

        // Append only valid fields to FormData
        Object.keys(product).forEach((key) => {
            const value = product[key];
            // Only append fields that are not undefined or null
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        // Append selected images
       
        try {
            await axios({
                method,
                url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Product added successfully');
            fetchProducts(); // Refresh the product list
            onCancel(); // Close the form
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Product</h2>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} required />
            </div>
            {/* <div>
                <label>Product Code:</label>
                <input type="text" name="productCode" value={product.productCode} onChange={handleChange} required />
            </div> */}
            <div>
    <label>New Arrival:</label>
    <input
        type="checkbox"
        name="isNewArrival"
        checked={product.isNewArrival}
        onChange={handleChange} // Toggles the isNewArrival state
    />
    <span>Mark as New Arrival</span>
</div>
<div>
    <label>Most Selling:</label>
    <input
        type="checkbox"
        name="isMostSelling"
        checked={product.isMostSelling}
        onChange={handleChange} // Toggles the isNewArrival state
    />
    <span>Mark as Most Selling</span>
</div>

            <div>
                <label>Tax Amount:</label>
                <input type="number" name="taxAmount" value={product.taxAmount || ''} onChange={handleChange} required />
            </div>
            <div>
                <label>HSN Code:</label>
                <input type="text" name="hsnCode" value={product.hsnCode} onChange={handleChange} />
            </div>
            <div>
                <label>Category:</label>
                <select name="categoryId" value={product.categoryId || ''} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Subcategory:</label>
                <select name="subcategoryId" value={product.subcategoryId || ''} onChange={handleChange} required>
                    <option value="">Select Subcategory</option>
                    {Array.isArray(subcategories) && subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <label>Subsubcategory:</label>
                <select name="subsubcategoryId" value={product.subsubcategoryId || ''} onChange={handleChange}>
                    <option value="">Select Subsubcategory (Optional)</option> {/* Indicate optional nature */}
                    {Array.isArray(subsubcategories) && subsubcategories.map((subsubcategory) => (
                        <option key={subsubcategory.id} value={subsubcategory.id}>{subsubcategory.name}</option>
                    ))}
                </select>
            </div>
            {/* <div>
                <label>Images:</label>
                <input type="file" onChange={handleImageChange} multiple />
            </div> */}
            <button type="submit">Add Product</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default AddProductForm;
