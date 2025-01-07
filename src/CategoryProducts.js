import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]); // Initialize as empty array
    const [categoryName, setCategoryName] = useState(''); // State to store the category name
    const [categoryImage, setCategoryImage] = useState(''); // State to store the category image (Base64)
    const [loading, setLoading] = useState(true); // State to track loading status
    const navigate = useNavigate(); // Hook for programmatically navigating between routes

    useEffect(() => {
        // Fetch the selected category data (categoryId, categoryName, and categoryImage)
        axios
            .get('http://localhost:8080/api/selected-category')
            .then(response => {
                const { categoryId, categoryName, categoryImage } = response.data; // Destructure response
                setCategoryName(categoryName); // Set category name
                setCategoryImage(categoryImage); // Set category image

                // Fetch products based on the selected category ID
                return axios.get(
                    `http://localhost:8080/api/products/selected-category?categoryId=${categoryId}`
                );
            })
            .then(productsResponse => {
                setProducts(productsResponse.data || []); // Set products, default to empty array if undefined
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []); // Empty dependency array to run only on mount

    if (loading) return <div>Loading...</div>;

    return (
        <div
            className="container my-5"
            style={{ backgroundColor: 'white', color: 'black', minHeight: '70vh' }}
        >
           

            {/* Display the selected category image and name */}
            <div className="d-flex align-items-center mb-4">
                {categoryImage && (
                    <img
                        src={`data:image/jpeg;base64,${categoryImage}`}
                        alt={categoryName}
                        style={{
                            height: '100px',
                            width: '100px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            marginRight: '1rem',
                        }}
                    />
                )}
                <h2>Products in {categoryName}</h2>
            </div>

            {/* Product Grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-3 gy-3">
                {products.length > 0 ? (
                    products.map(product => {
                        const firstVariant =
                            product.variants && product.variants[0]; // Display the first variant image and price

                        return (
                            <div key={product.id} className="col px-0">
                                <div
                                    className="card shadow-sm h-100"
                                    onClick={() => navigate(`/product/${product.id}`)} // Navigate to product details page
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '0',
                                        
                                        height: 'auto',
                                        overflow: 'hidden',
                                        width: '170px',
                                        margin: 'auto',
                                    }}
                                >
                                    {/* Subcategory name */}
                                    <p
                                        className="card-text"
                                        style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}
                                    >
                                        {product.subcategory ? product.subcategory.name : 'N/A'}
                                    </p>

                                    {/* Product Image */}
                                    {firstVariant &&
                                    firstVariant.images &&
                                    firstVariant.images.length > 0 ? (
                                        <div className="image-container">
                                            <img
                                                src={`data:image/jpeg;base64,${firstVariant.images[0]}`}
                                                alt={firstVariant.name}
                                                className="card-img-top"
                                                style={{
                                                    objectFit: 'contain',
                                                    height: '150px',
                                                    width: '100%',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="image-container">
                                            <img
                                                src="path_to_blank_image.jpg"
                                                alt="No image available"
                                                className="card-img-top"
                                                style={{
                                                    objectFit: 'contain',
                                                    height: '80px',
                                                    width: '100%',
                                                    backgroundColor: '#f0f0f0',
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Card Body */}
                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                        <h5
                                            className="card-title"
                                            style={{
                                                
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                minHeight: '50px',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            {product.name.length > 120
                                                ? `${product.name.substring(0, 120)}...`
                                                : product.name}
                                        </h5>

                                        {/* Price and Buttons */}
                                        <span
                                            className="product-price"
                                            style={{
                                                fontSize: '0.9rem',
                                                display: 'block',
                                                marginBottom: '0.5rem',
                                            }}
                                        >
                                            ₹{firstVariant ? firstVariant.price : 'N/A'}
                                        </span>
                                        {/* <div className="d-flex justify-content-between">
                                            <button className="btn btn-outline-primary btn-sm">
                                                Wishlist
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm">
                                                Compare
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <p>No products found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDisplay;


