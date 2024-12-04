import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import AddProductForm from './AddProductForm';
import UpdateProductForm from './UpdateProductForm';
import ExcelUpload from './UploadProduct';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [variantDetails, setVariantDetails] = useState({
        color: '',
        dimensions: '',
        price: '',
        stock: '',
        inStock: '',
        quantity: '',
        description: '',
        keyFeatures: '',
        otherDimensions: '',
        productWeight: '',
        power: '',
        material: '',
        capacity: '',
        images: [], // Added images field to store current images
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subsubcategories, setSubsubcategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedStockStatus, setSelectedStockStatus] = useState('');
    const [variants, setVariants] = useState([]); // State for storing fetched variants
    const [showVariants, setShowVariants] = useState(false); // Control to toggle variant display
    const [selectedVariantImages, setSelectedVariantImages] = useState([]);
    const [isEditingVariant, setIsEditingVariant] = useState(false); 
    const [variantToEdit, setVariantToEdit] = useState(null);
    const [selectedImageIndicesToDelete, setSelectedImageIndicesToDelete] = useState([]);
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubcategories();
        fetchSubsubcategories();

    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            const products = response.data;
    
            // Ensure each product's name is valid before applying toLowerCase
            const updatedProducts = products.map(product => {
                if (product.name) {
                    product.name = product.name.toLowerCase();
                } else {
                    product.name = ''; // Or set to a default value, depending on your needs
                }
                return product;
            });
    
            setProducts(updatedProducts); // Update the products state with the validated names
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/subcategories');
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchSubsubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/subsubcategories');
            setSubsubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subsubcategories:', error);
        }
    };

    const fetchVariants = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${productId}/variants`);
            setVariants(response.data);
            setShowVariants(true);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const handleCloseVariants = () => {
        setVariants([]);
        setShowVariants(false);
    };

    const handleVariantImageChange = (e) => {
        setSelectedVariantImages(e.target.files);
    };
    const handleSelectImageToDelete = (index) => {
        setSelectedImageIndicesToDelete((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleAddImage = async (productId) => {
        const formData = new FormData();
        Array.from(selectedImages).forEach((file) => {
            formData.append('images', file);
        });

        try {
            await axios.post(`http://localhost:8080/api/products/${productId}/images`, formData);
            alert('Images added successfully');
            setSelectedImages([]);
            fetchProducts();
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };
    const handleEditVariant = (variant) => {
        setVariantDetails({
            color: variant.color,
            dimensions: variant.dimensions,
            price: variant.price,
            stock: variant.stock,
            inStock: variant.inStock,
            quantity: variant.quantity,
            description: variant.description,
            keyFeatures: variant.keyFeatures,
            otherDimensions: variant.otherDimensions,
            productWeight: variant.productWeight,
            power: variant.power,
            material: variant.material,
            capacity: variant.capacity,
            images: variant.images || [], // If variant.images is available, set it, otherwise an empty array
        });
        setVariantToEdit(variant);
        setIsEditingVariant(true);
    };
    
    
    const updateVariant = async (productId) => {
        const {
            color,
            dimensions,
            price,
            stock,
            inStock,
            quantity,
            description,
            keyFeatures,
            otherDimensions,
            productWeight,
            power,
            material,
            capacity,
        } = variantDetails;
    
        const formData = new FormData();
        // Append new images to formData
        Array.from(selectedVariantImages).forEach((file) => {
            formData.append('newImages', file);
        });
    
        // Append other variant details to formData
        formData.append('color', color);
        formData.append('dimensions', dimensions);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock));
        formData.append('inStock', inStock);
        formData.append('quantity', quantity);
        formData.append('description', description);
        formData.append('keyFeatures', keyFeatures);
        formData.append('otherDimensions', otherDimensions);
        formData.append('productWeight', productWeight);
        formData.append('power', power);
        formData.append('material', material);
        formData.append('capacity', capacity);
    
        // Append deleteImageIndices to formData
        const deleteImageIndices = selectedImageIndicesToDelete.join(',');
        formData.append('deleteImageIndices', deleteImageIndices);
    
        try {
            if (variantToEdit) {
                await axios.put(
                    `http://localhost:8080/api/products/${productId}/variants/${variantToEdit.id}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Variant updated successfully');
                fetchVariants(productId); // Reload variants
                setIsEditingVariant(false); // Close edit form
                setVariantDetails({
                    color: '',
                    dimensions: '',
                    price: '',
                    stock: '',
                    inStock: '',
                    quantity: '',
                    description: '',
                    keyFeatures: '',
                    otherDimensions: '',
                    productWeight: '',
                    power: '',
                    material: '',
                    capacity: '',
                    images: [], // Clear images after update
                });
                setSelectedVariantImages([]); // Clear selected images
                setSelectedImageIndicesToDelete([]); // Clear delete indices
            } else {
                alert('No variant selected to edit');
            }
        } catch (error) {
            console.error('Error updating variant:', error);
        }
    };
    
    const handleCancelEditVariant = () => {
        setVariantDetails({
            color: '',
            dimensions: '',
            price: '',
            stock: '',
        });
        setIsEditingVariant(false);
        setSelectedVariantImages([]);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${productId}`);
                alert('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setCurrentProduct(null);
        setIsEditing(false);
    };

    const addVariant = async (productId) => {
        const {
            color,
            dimensions,
            price,
            stock,
            inStock,
            quantity,
            description,
            keyFeatures,
            otherDimensions,
            productWeight,
            power,
            material,
            capacity,
        } = variantDetails;
    
        const formData = new FormData();
    
        // Append variant images to FormData
        Array.from(selectedVariantImages).forEach((file) => {
            formData.append('images', file);
        });
    
        // Append other variant details to FormData
        formData.append('color', color);
        formData.append('dimensions', dimensions);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock));
        formData.append('inStock', inStock);
        formData.append('quantity', parseInt(quantity));
        formData.append('description', description);
        formData.append('keyFeatures', keyFeatures);
        formData.append('otherDimensions', otherDimensions);
        formData.append('productWeight', productWeight);
        formData.append('power', power);
        formData.append('material', material);
        formData.append('capacity', capacity);
    
        try {
            // Ensure currentProduct.id is passed correctly
            if (currentProduct && currentProduct.id) {
                await axios.post(`http://localhost:8080/api/products/${productId}/variants`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ensure the content type is correct for file uploads
                    },
                });
                alert('Variant added successfully');
                fetchProducts(); // Refresh the product list to show the new variant
                setVariantDetails({
                    color: '',
                    dimensions: '',
                    price: '',
                    stock: '',
                    inStock: true,
                    quantity: '',
                    description: '',
                    keyFeatures: '',
                    otherDimensions: '',
                    productWeight: '',
                    power: '',
                    material: '',
                    capacity: '',
                });
                setSelectedVariantImages([]); // Clear images after adding variant
                setIsAddingVariant(false); // Close the variant addition form
            } else {
                alert('Please select a product to add a variant to.');
            }
        } catch (error) {
            console.error('Error adding variant:', error);
        }
    };
    

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteVariant = async (productId, variantId) => {
        if (window.confirm('Are you sure you want to delete this variant?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${productId}/variants/${variantId}`);
                alert('Variant deleted successfully');
                fetchVariants(productId); // Refresh the variant list for the product
            } catch (error) {
                console.error('Error deleting variant:', error);
            }
        }
    };
    

    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category?.name === selectedCategory : true;
        const matchesSubcategory = selectedSubcategory ? product.subcategory?.name === selectedSubcategory : true;
        const matchesStockStatus =
            selectedStockStatus === 'in-stock' ? product.inStock : selectedStockStatus === 'out-of-stock' ? !product.inStock : true;

        return matchesSearchTerm && matchesSubcategory && matchesStockStatus&&matchesCategory;
    });

    return (
        <div className="product-list-container">
            <h2 className="product-list-header">Product List</h2>
            <div className="product-list-actions">
                <button className="add-product-btn" onClick={() => setIsAdding(true)}>Add new product</button>
                <ExcelUpload onUpload={fetchProducts} />
            </div>

            {/* Search and Filter Section */}
            <div className="product-list-filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedSubcategory(e.target.value)} value={selectedSubcategory}>
                    <option value="">All Subcategories</option>
                    {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
                    ))}
                </select>
               
            </div>

            {isAdding && (
                <AddProductForm 
                    onCancel={() => setIsAdding(false)} 
                    fetchProducts={fetchProducts} 
                    categories={categories}
                    subcategories={subcategories} 
                    subsubcategories={subsubcategories} 
                />
            )}

            {isEditing && currentProduct && (
                <UpdateProductForm 
                    productData={currentProduct} 
                    onCancel={handleCloseEdit} 
                    fetchProducts={fetchProducts} 
                    categories={categories}
                    subcategories={subcategories} 
                    subsubcategories={subsubcategories} 
                />
            )}

{isAddingVariant && currentProduct && (
    <div className="variant-form p-4 border rounded shadow-sm">
        <h3 className="mb-4">Add Variant</h3>
        
        <div className="mb-3">
            <label htmlFor="color" className="form-label">Color</label>
            <input
                type="text"
                name="color"
                id="color"
                className="form-control"
                placeholder="Color"
                value={variantDetails.color}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="dimensions" className="form-label">Dimensions</label>
            <input
                type="text"
                name="dimensions"
                id="dimensions"
                className="form-control"
                placeholder="Dimensions"
                value={variantDetails.dimensions}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
                type="number"
                name="price"
                id="price"
                className="form-control"
                placeholder="Price"
                value={variantDetails.price}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="stock" className="form-label">Stock</label>
            <input
                type="number"
                name="stock"
                id="stock"
                className="form-control"
                placeholder="Stock"
                value={variantDetails.stock}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3 form-check">
            <input
                type="checkbox"
                name="inStock"
                id="inStock"
                className="form-check-input"
                checked={variantDetails.inStock}
                onChange={(e) => handleVariantChange({ target: { name: 'inStock', value: e.target.checked } })}
            />
            <label htmlFor="inStock" className="form-check-label">In Stock</label>
        </div>

        <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
                type="number"
                name="quantity"
                id="quantity"
                className="form-control"
                placeholder="Quantity"
                value={variantDetails.quantity}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
                name="description"
                id="description"
                className="form-control"
                placeholder="Description"
                value={variantDetails.description}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="keyFeatures" className="form-label">Key Features</label>
            <input
                type="text"
                name="keyFeatures"
                id="keyFeatures"
                className="form-control"
                placeholder="Key Features"
                value={variantDetails.keyFeatures}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="otherDimensions" className="form-label">Other Dimensions</label>
            <input
                type="text"
                name="otherDimensions"
                id="otherDimensions"
                className="form-control"
                placeholder="Other Dimensions"
                value={variantDetails.otherDimensions}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="productWeight" className="form-label">Product Weight</label>
            <input
                type="text"
                name="productWeight"
                id="productWeight"
                className="form-control"
                placeholder="Product Weight"
                value={variantDetails.productWeight}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="power" className="form-label">Power</label>
            <input
                type="text"
                name="power"
                id="power"
                className="form-control"
                placeholder="Power"
                value={variantDetails.power}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="material" className="form-label">Material</label>
            <input
                type="text"
                name="material"
                id="material"
                className="form-control"
                placeholder="Material"
                value={variantDetails.material}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="capacity" className="form-label">Capacity</label>
            <input
                type="text"
                name="capacity"
                id="capacity"
                className="form-control"
                placeholder="Capacity"
                value={variantDetails.capacity}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="variantImages" className="form-label">Variant Image Upload</label>
            <input
                type="file"
                name="variantImages"
                id="variantImages"
                className="form-control"
                multiple
                onChange={handleVariantImageChange}
            />
        </div>

        <div className="mb-3 text-end">
            <button className="btn btn-primary me-2" onClick={() => addVariant(currentProduct.id)}>Add Variant</button>
            <button className="btn btn-secondary" onClick={() => setIsAddingVariant(false)}>Cancel</button>
        </div>
    </div>
)}

{isEditingVariant && (
    <div className="variant-form p-4 border rounded shadow-sm">
        <h3 className="mb-4">Edit Variant</h3>

        <div className="mb-3">
            <label htmlFor="color" className="form-label">Color</label>
            <input
                type="text"
                name="color"
                id="color"
                className="form-control"
                value={variantDetails.color}
                onChange={handleVariantChange}
                placeholder="Color"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="dimensions" className="form-label">Dimensions</label>
            <input
                type="text"
                name="dimensions"
                id="dimensions"
                className="form-control"
                value={variantDetails.dimensions}
                onChange={handleVariantChange}
                placeholder="Dimensions"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
                type="number"
                name="price"
                id="price"
                className="form-control"
                value={variantDetails.price}
                onChange={handleVariantChange}
                placeholder="Price"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="stock" className="form-label">Stock</label>
            <input
                type="number"
                name="stock"
                id="stock"
                className="form-control"
                value={variantDetails.stock}
                onChange={handleVariantChange}
                placeholder="Stock"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="inStock" className="form-label">In Stock</label>
            <input
                type="number"
                name="inStock"
                id="inStock"
                className="form-control"
                value={variantDetails.inStock}
                onChange={handleVariantChange}
                placeholder="In Stock"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
                type="number"
                name="quantity"
                id="quantity"
                className="form-control"
                value={variantDetails.quantity}
                onChange={handleVariantChange}
                placeholder="Quantity"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
                type="text"
                name="description"
                id="description"
                className="form-control"
                value={variantDetails.description}
                onChange={handleVariantChange}
                placeholder="Description"
            />
        </div>

        {/* Displaying current images */}
        <label>Current Images</label>
        <div className="mb-3">
            {variantDetails.images.length > 0 ? (
                variantDetails.images.map((image, index) => (
                    <div key={index} className="d-inline-block me-2">
                        <img
                            src={`data:image/jpeg;base64,${image}`}
                            alt={`Variant Image ${index}`}
                            className="img-thumbnail"
                            style={{ width: '100px', height: '100px' }}
                        />
                        <div>
                            <input
                                type="checkbox"
                                onChange={() => handleSelectImageToDelete(index)}
                                checked={selectedImageIndicesToDelete.includes(index)}
                            />
                            <label>Delete</label>
                        </div>
                    </div>
                ))
            ) : (
                <p>No images available</p>
            )}
        </div>

        {/* File input for new images */}
        <div className="mb-3">
            <label htmlFor="newImages" className="form-label">Add New Images</label>
            <input
                type="file"
                id="newImages"
                className="form-control"
                multiple
                onChange={(e) => setSelectedVariantImages(e.target.files)}
            />
        </div>

        <div className="mb-3 text-end">
            <button className="btn btn-primary me-2" onClick={() => updateVariant(currentProduct.id)}>Update Variant</button>
            <button className="btn btn-secondary" onClick={handleCancelEditVariant}>Cancel</button>
        </div>
    </div>
)}


<table className="product-table">
                <thead>
                    <tr className="product-table-header">
                        {/* <th>Image</th> */}
                        <th>Name</th>
                        <th>Code</th>
                        {/* <th>Price</th> */}
                        <th>Tax</th>
                        <th>HSN</th>
                        {/* <th>Stock</th>
                        <th>Quantity</th>
                        <th>Features</th>
                        <th>Color</th> */}

                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Subsubcategory</th>
                        <th>New Arrivals</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product) => (
                        <tr key={product.id} className="product-table-row">
                            {/* <td>
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={`data:image/jpeg;base64,${product.images[0]}`} 
                                        alt={`Product ${product.id} - Main Image`} 
                                        className="product-image"
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </td> */}
                            <td>{product.name}</td>
                            <td>{product.productCode}</td>
                            {/* <td>₹{product.price}</td> */}
                            <td>₹{product.taxAmount}</td>
                            <td>{product.hsnCode}</td>
                            {/* <td className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'} */}
                            {/* </td> */}
                            {/* <td>{product.quantity}</td>
                            <td>{product.keyFeatures.join(', ')}</td>
                            <td>{product.color}</td> */}
                            <td>{product.category?.name}</td>
                            <td>{product.subcategory?.name}</td>
                            <td>{product.subsubcategory?.name}</td>
                            <td>
                {product.newArrival ? (
                    <span className="new-arrival">New Arrival</span>
                ) : (
                    <span className="not-new-arrival">Not New Arrival</span>
                )}
            </td>

                            <td>
                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                <button onClick={() => { setCurrentProduct(product); fetchVariants(product.id); }}>
                                    View Variants
                                </button>
                                <button onClick={() => { setCurrentProduct(product); setIsAddingVariant(true); }}>Add Variant</button>
                                {showVariants && currentProduct?.id === product.id &&  (
    <div className="variants-section">
        <button onClick={handleCloseVariants}>Close Variants</button>
        <table className="variant-table">
            <thead>
                <tr>
                    <th>Color</th>
                    <th>Dimensions</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>In Stock</th>
                    <th>Quantity</th>
                    {/* <th>Description</th>
                    <th>Key Features</th>
                    <th>Other Dimensions</th>
                    <th>Product Weight</th>
                    <th>Power</th>
                    <th>Material</th>
                    <th>Capacity</th> */}
                    <th>Images</th> {/* New column for images */}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {variants.map((variant) => (
                    <tr key={variant.id}>
                        <td>{variant.color}</td>
                        <td>{variant.dimensions}</td>
                        <td>{variant.price}</td>
                        <td>{variant.stock}</td>
                        <td>{variant.inStock ? 'Yes' : 'No'}</td>
                        <td>{variant.quantity}</td>
                        {/* <td>{variant.description}</td>
                        <td>{variant.keyFeatures}</td>
                        <td>{variant.otherDimensions}</td>
                        <td>{variant.productWeight}</td>
                        <td>{variant.power}</td>
                        <td>{variant.material}</td>
                        <td>{variant.capacity}</td> */}
                        <td>
                            {/* Display the first variant image if any */}
{variant.images && variant.images.length > 0 ? (
    <div>
        <img
            src={`data:image/jpeg;base64,${variant.images[0]}`} // Access only the first image
            alt="Variant Image 0"
            className="variant-image"
        />
    </div>
) : (
    <p>No images</p>
)}
                        </td>
                        <td>
                        <button onClick={() => handleEditVariant(variant)}>Edit</button>
                            <button onClick={() => handleDeleteVariant(product.id, variant.id)}>
                                Delete Variant
                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default ProductList;
