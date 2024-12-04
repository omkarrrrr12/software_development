import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Error occurred:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please try again later.</h2>;
        }

        return this.props.children;
    }
}

const ProductFilter = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedStockStatus, setSelectedStockStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);  // Loading state for categories
    const [visibleCount, setVisibleCount] = useState(4); // Initial visible count
    const navigate = useNavigate();
    const { categoryId, subcategoryId, subsubcategoryId } = useParams();

    // Fetch products based on filters and URL parameters
    const fetchProducts = useCallback(async () => {
        try {
            let url = 'http://localhost:8080/api/products/filter';
            const params = new URLSearchParams();

            if (categoryId) params.append('categoryId', categoryId);
            if (subcategoryId) params.append('subcategoryId', subcategoryId);
            if (subsubcategoryId) params.append('subsubcategoryId', subsubcategoryId);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [categoryId, subcategoryId, subsubcategoryId]);

    // Fetch categories for the dropdown filter
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or filters change
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts]);

    // Handle category selection changes
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Handle subcategory selection changes
    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
    };

    // Handle stock status selection changes
    const handleStockStatusChange = (e) => {
        setSelectedStockStatus(e.target.value);
    };

    // Filter products based on multiple criteria
    const filteredProducts = products.filter((product) => {
        console.log('Product Data:', product);  // Log the entire product

        // Check the search query
        const matchesSearchTerm = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Match category
        const matchesCategory = selectedCategory ? product.category?.id === parseInt(selectedCategory) : true;
        console.log('Matches Category:', matchesCategory);

        // Match subcategory
        const matchesSubcategory = selectedSubcategory ? product.subcategory?.id === parseInt(selectedSubcategory) : true;
        console.log('Matches Subcategory:', matchesSubcategory);

        // Match stock status
     

        // Return if all conditions are met
        return matchesSearchTerm && matchesSubcategory  && matchesCategory;
    });
    const visibleProducts = filteredProducts.slice(0, visibleCount); // Slice based on visible count

    console.log('Filtered Products:', filteredProducts);  // Log the filtered results

    return (
        <ErrorBoundary>
            <div className="container my-5" style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
               

                <h2 className="mb-4">Available Products</h2>

                <div className="mb-4 d-flex justify-content-between flex-wrap">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control mb-3"
                        style={{ maxWidth: '250px', flex: 1 }}
                    />

                    {/* Category Filter Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="form-select mb-3"
                        style={{ maxWidth: '250px', flex: 1 }}
                    >
                        <option value="">All Categories</option>
                        {loading ? (
                            <option>Loading categories...</option>
                        ) : (
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        )}
                    </select>
                    
                </div>

                <div className="mb-4 d-flex justify-content-between flex-wrap">
                    {/* Subcategory Filter Dropdown */}
                    <select
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        className="form-select mb-3"
                        style={{ maxWidth: '250px', flex: 1 }}
                    >
                        <option value="">All Subcategories</option>
                        {categories.length > 0 &&
                            categories.map((category) =>
                                category.subcategories && category.subcategories.length > 0
                                    ? category.subcategories.map((subcategory) => (
                                          <option key={subcategory.id} value={subcategory.id}>
                                              {subcategory.name}
                                          </option>
                                      ))
                                    : null
                            )}
                    </select>

                   
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-3 gy-3">
                {visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => {
                            const firstVariant = product.variants && product.variants[0];

                            return (
                                <div key={product.id} className="col px-0">
                                    <div
                                        className="card shadow-sm h-100"
                                        onClick={() => navigate(`/product/${product.id}`)}
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
                                                        height: '150px',
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

                                            {/* Price */}
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
                        
   
                `}</style>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
    {filteredProducts.length > 4 && visibleCount < filteredProducts.length && (
        <button
            className="btn btn-primary mx-2"
            onClick={() => setVisibleCount((prev) => prev + 4)}
        >
            Show More
        </button>
    )}

    {visibleCount > 4 && (
        <button
            className="btn btn-secondary mx-2"
            onClick={() => setVisibleCount(4)} // Reset to initial count
        >
            Show Less
        </button>
    )}
</div>


            </div>
        </ErrorBoundary>
    );
};

export default ProductFilter;
