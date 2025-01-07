import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubcategoryWithSubcategories = () => {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/selected-category2/details-with-subcategories")
            .then((response) => {
                const { subcategoryId, subcategoryName, subcategoryImage, products } = response.data;
                setSelectedSubcategory({ subcategoryId, subcategoryName, subcategoryImage });
                setProducts(products);
            })
            .catch((error) => console.error("Error fetching subcategory details:", error));
    }, []);

    const handleSortChange = (e) => setSortOrder(e.target.value);
    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

    const filteredProducts = products.filter((product) => {
        const price = product.variants?.[0]?.price || 0;
        return (
            (minPrice ? price >= minPrice : true) &&
            (maxPrice ? price <= maxPrice : true)
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;
        return sortOrder === "asc" ? priceA - priceB : sortOrder === "desc" ? priceB - priceA : 0;
    });

    const handleProductClick = (productId) => navigate(`/product/details/${productId}`);

    return (
        <div className="container my-5" style={{ minHeight: "70vh", backgroundColor: "white" }}>
    

            {selectedSubcategory && (
                <div className="text-center mb-4">
                    <h1>{selectedSubcategory.subcategoryName}</h1>
                    {selectedSubcategory.subcategoryImage && (
                        <img
                            src={`data:image/jpeg;base64,${selectedSubcategory.subcategoryImage}`}
                            alt={selectedSubcategory.subcategoryName}
                            className="rounded-circle"
                            style={{ width: "200px", height: "200px", objectFit: "cover" }}
                        />
                    )}
                </div>
            )}

            <div className="mb-3" style={{ maxWidth: "300px" }}>
                <label htmlFor="sortOrder" className="form-label">Sort by Price</label>
                <select
                    id="sortOrder"
                    className="form-select"
                    onChange={handleSortChange}
                    value={sortOrder}
                >
                    <option value="">Sort by price</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>

            <div className="mb-3" style={{ maxWidth: "300px" }}>
                <label htmlFor="priceRange" className="form-label">Price Range</label>
                <div className="d-flex justify-content-between">
                    <input
                        type="number"
                        className="form-control"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        placeholder="Min Price"
                        style={{ width: "48%" }}
                    />
                    <input
                        type="number"
                        className="form-control"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        placeholder="Max Price"
                        style={{ width: "48%" }}
                    />
                </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-3 gy-3">
                {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => {
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
                                            <button className="btn btn-outline-primary btn-sm">Wishlist</button>
                                            <button className="btn btn-outline-secondary btn-sm">Compare</button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <p>No products found for this subcategory.</p>
                    </div>
                )}
            </div>

            {/* Custom media query for widths between 430px and 575px */}
            <style>{`
                @media (min-width: 360px) and (max-width: 575px) {
                    .row {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0rem;
                    }
                }

                .form-select option {
                    width: 25vw;
                    font-size: 2.3vw;
                }
            `}</style>
        </div>
    );
};

export default SubcategoryWithSubcategories;
