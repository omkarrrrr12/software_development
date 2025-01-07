import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CustomerSearchProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // State for sort order
  const [minPrice, setMinPrice] = useState(""); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(""); // State for maximum price
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    setSearchQuery(query || "");
    fetchProducts(query);
  }, [location.search]);

  // Fetch products from backend
  const fetchProducts = async (query) => {
    try {
      if (query) {
        const response = await axios.get("http://localhost:8080/api/products/search", {
          params: { query },
        });
        setProducts(response.data);
      } else {
        setProducts([]); // Clear products if no query
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle changes to the sorting order
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handle changes to the minimum price
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  // Handle changes to the maximum price
  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  // Filter products based on price range
  const filteredProducts = products.filter((product) => {
    const firstVariant = product.variants ? product.variants[0] : null;
    const price = firstVariant ? firstVariant.price : 0;

    // Filter products by the price range
    const isInPriceRange =
      (minPrice ? price >= minPrice : true) && (maxPrice ? price <= maxPrice : true);

    return isInPriceRange;
  });

  // Sort products based on selected order
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const firstVariantA = a.variants ? a.variants[0] : null;
    const firstVariantB = b.variants ? b.variants[0] : null;
    const priceA = firstVariantA ? firstVariantA.price : 0;
    const priceB = firstVariantB ? firstVariantB.price : 0;

    if (sortOrder === "asc") {
      return priceA - priceB;
    } else if (sortOrder === "desc") {
      return priceB - priceA;
    }
    return 0; // No sorting if sortOrder is empty or invalid
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container my-5" style={{ backgroundColor: 'white', color: 'white', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3" style={{ marginBottom: '0px' }}>
        &larr; Back
      </button>

      {/* Sort Dropdown */}
      <div className="mb-3" style={{ maxWidth: '200px' }}>
        <label htmlFor="sortOrder" className="form-label">Sort by Price</label>
        <select id="sortOrder" className="form-select" onChange={handleSortChange} value={sortOrder}>
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range Inputs */}
      <div className="mb-3" style={{ maxWidth: '300px' }}>
  <label htmlFor="priceRange" className="form-label">Price Range</label>
  <div className="d-flex justify-content-between">
    <input
      type="number"
      id="minPrice"
      className="form-control"
      value={minPrice}
      onChange={handleMinPriceChange}
      placeholder="Min Price"
      style={{ width: '48%' }}
    />
    <span className="d-flex align-items-center" style={{ margin: '0 10px' }}>
      
    </span>
    <input
      type="number"
      id="maxPrice"
      className="form-control"
      value={maxPrice}
      onChange={handleMaxPriceChange}
      placeholder="Max Price"
      style={{ width: '48%' }}
    />
  </div>
</div>


      {/* Updated responsive grid */}
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
          font-size: 2.3vw; /* Dynamically resize font size based on screen width */
        }
      `}</style>
    </div>
  );
};

export default CustomerSearchProductList;
