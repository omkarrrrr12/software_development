import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateProductForm = ({ productData, onCancel, fetchProducts, categories,subcategories, subsubcategories }) => {
    const [product, setProduct] = useState({
        name: '',
        // productCode: '',
        price: '',
        taxAmount: '',
        hsnCode: '',
        inStock: true,
        quantity: '',
        description: '',
        keyFeatures: [],
        dimensions: '',
        otherDimensions: '',
        productWeight: '',
        power: '',
        material: '',
        color: '',
        capacity: '',
        categoryId:null,
        subcategoryId: null,
        subsubcategoryId: null,
        isNewArrival: false  // Add isNewArrival to state
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        if (productData) {
            setProduct({
                ...productData,
                categoryId:productData.categoryId || null,
                subcategoryId: productData.subcategoryId || null,
                subsubcategoryId: productData.subsubcategoryId || null,
                isNewArrival: productData.isNewArrival || false  // Ensure isNewArrival value is preserved
            });
            setSelectedImages([]); 
            setExistingImages(productData.images || []); 
        }
    }, [productData]);
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : (name === 'price' || name === 'taxAmount' || name === 'quantity' || name === 'power') ? (value ? Number(value) : '') : value;

        setProduct({ ...product, [name]: newValue });
    };

    const handleImageChange = (e) => {
        setSelectedImages(e.target.files); 
    };

    const handleDeleteExistingImage = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/products/${productData.id}/images/${index}`);
            const updatedImages = existingImages.filter((_, i) => i !== index);
            setExistingImages(updatedImages);
            setImagesToDelete([...imagesToDelete, index]);
            alert('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:8080/api/products/${productData.id}`;
        const method = 'PUT';

        const formData = new FormData();

        Object.keys(product).forEach((key) => {
            const value = product[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        Array.from(selectedImages).forEach((file) => {
            formData.append('images', file);
        });

        imagesToDelete.forEach((imageIndex) => {
            formData.append('imagesToDelete', imageIndex);
        });

        try {
            await axios({
                method,
                url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Product updated successfully');
            fetchProducts(); 
            onCancel(); 
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">{productData ? 'Update Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* <div className="mb-3">
                    <label htmlFor="productCode" className="form-label">Product Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productCode"
                        name="productCode"
                        value={product.productCode}
                        onChange={handleChange}
                        required
                    />
                </div> */}

                <div className="mb-3">
                    <label htmlFor="taxAmount" className="form-label">Tax Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="taxAmount"
                        name="taxAmount"
                        value={product.taxAmount || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="hsnCode" className="form-label">HSN Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="hsnCode"
                        name="hsnCode"
                        value={product.hsnCode}
                        onChange={handleChange}
                    />
                </div>
                 <div className="mb-3">
    <label htmlFor="categoryId" className="form-label">Category</label>
    <select
        className="form-select"
        name="categoryId"
        value={product.categoryId || ''}
        onChange={handleChange}
        
    >
        <option value="">Select Category</option>
        {Array.isArray(categories) &&
            categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
            ))}
    </select>
</div>

                <div className="mb-3">
    <label htmlFor="subcategoryId" className="form-label">Subcategory</label>
    <select
        className="form-select"
        name="subcategoryId"
        value={product.subcategoryId || ''}
        onChange={handleChange}
        
    >
        <option value="">Select Subcategory</option>
        {Array.isArray(subcategories) &&
            subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                </option>
            ))}
    </select>
</div>

<div className="mb-3">
    <label htmlFor="subsubcategoryId" className="form-label">Subsubcategory</label>
    <select
        className="form-select"
        name="subsubcategoryId"
        value={product.subsubcategoryId || ''}
        onChange={handleChange}
    >
        <option value="">Select Subsubcategory (Optional)</option>
        {Array.isArray(subsubcategories) &&
            subsubcategories.map((subsubcategory) => (
                <option key={subsubcategory.id} value={subsubcategory.id}>
                    {subsubcategory.name}
                </option>
            ))}
    </select>
</div>


                <div className="mb-3">
                    <label htmlFor="isNewArrival" className="form-label">New Arrival</label>
                    <input
                        type="checkbox"
                        id="isNewArrival"
                        name="isNewArrival"
                        checked={product.isNewArrival}
                        onChange={handleChange} // Toggling the checkbox state
                    />
                    <span>Mark as new arrival</span>
                </div>

             

               
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">Update Product</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProductForm;
