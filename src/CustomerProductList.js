import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { categoryId, subcategoryId, subsubcategoryId } = useParams();

    useEffect(() => {
        fetchProducts();
    }, [subcategoryId, subsubcategoryId]); // Re-fetch products when subsubcategoryId or subcategoryId changes

    const fetchProducts = async () => {
        try {
            const params = {};
            if (subcategoryId) params.subcategoryId = subcategoryId;
            if (subsubcategoryId) params.subsubcategoryId = subsubcategoryId;

            const response = await axios.get('http://localhost:8080/api/products/filter', { params });
            console.log('Fetched products:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="container my-5" style={{ backgroundColor: 'white', color: 'white', minHeight: '100vh' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3" style={{marginBottom:'0px'}}>
                &larr; Back
            </button>

            <h2 className="mb-4">Available Products</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                />
            </div>

            {/* Updated responsive grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-3 gy-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                        const firstVariant = product.variants && product.variants[0];

                        return (
                            <div key={product.id} className="col px-0">
                                <div
                                    className="card shadow-sm h-100"
                                    onClick={() => handleProductClick(product.id)}
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
                                    <p className="card-text" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        {product.subcategory ? product.subcategory.name : 'N/A'}
                                    </p>

                                    {/* Product Image */}
                                    {firstVariant && firstVariant.images && firstVariant.images.length > 0 ? (
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
                                                fontSize: '0.6rem',
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
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-outline-primary btn-sm">Wishlist</button>
                                            <button className="btn btn-outline-secondary btn-sm">Compare</button>
                                        </div>
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

            {/* Custom media query for widths between 430px and 575px */}
            <style >{`
                    @media (min-width: 360px) and (max-width: 575px) {
                        .row {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 0rem;
                        }
                    }
                        
    /* Adjust font size of dropdown options */
    .form-select option {
    width: 25vw;
        font-size: 2.3vw; /* Dynamically resize font size based on screen width */
    }
                `}</style>
        </div>
    );
};

export default CustomerProductList;
