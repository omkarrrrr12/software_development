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

// Main ProductFilter Component
const ProductFilter = () => {
    const [products, setProducts] = useState([]); // Stores the fetched products
    const [categories, setCategories] = useState([]); // Stores the fetched categories
    const [subcategories, setSubcategories] = useState([]); 
 const [selectedCategory, setSelectedCategory] = useState(''); // Selected category filter
    const [selectedSubcategory, setSelectedSubcategory] = useState(''); // Selected subcategory filter
    const [selectedStockStatus, setSelectedStockStatus] = useState(''); // Selected stock status filter
    const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering products by name
    const [loading, setLoading] = useState(true); // Loading state for categories
    const [visibleCount, setVisibleCount] = useState(4); // Number of products to show initially
    const [sortOrder, setSortOrder] = useState(''); // Sorting order ('low-to-high' or 'high-to-low')
    const navigate = useNavigate(); // React Router navigation
    const { categoryId, subcategoryId, subsubcategoryId } = useParams(); // URL parameters for filtering

    // Fetch products from the backend
    const fetchProducts = useCallback(async () => {
        try {
            let url = 'http://localhost:8080/api/products/filter'; // API endpoint for products
            const params = new URLSearchParams();

            if (categoryId) params.append('categoryId', categoryId); // Append category filter
            if (subcategoryId) params.append('subcategoryId', subcategoryId); // Append subcategory filter
            if (subsubcategoryId) params.append('subsubcategoryId', subsubcategoryId); // Append subsubcategory filter

            if (params.toString()) {
                url += `?${params.toString()}`; // Construct the URL with query parameters
            }

            const response = await axios.get(url); // Fetch the products
            setProducts(response.data); // Set the products in state
        } catch (error) {
            console.error('Error fetching products:', error); // Log errors
        }
    }, [categoryId, subcategoryId, subsubcategoryId]);

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories'); // API endpoint for categories
            setCategories(response.data); // Set the categories in state
        } catch (error) {
            console.error('Error fetching categories:', error); // Log errors
        } finally {
            setLoading(false); // End the loading state
        }
    };
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/subcategories'); // API endpoint for categories
            setSubcategories(response.data); // Set the categories in state
        } catch (error) {
            console.error('Error fetching subcategories:', error); // Log errors
        } finally {
            setLoading(false); // End the loading state
        }
    };

    // Fetch products and categories on mount or when filters change
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubcategories();
    }, [fetchProducts]);

    // Handle changes to the category filter
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value); // Update the selected category
    };

    // Handle changes to the subcategory filter
    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value); // Update the selected subcategory
    };

    // Handle changes to the stock status filter
    const handleStockStatusChange = (e) => {
        setSelectedStockStatus(e.target.value); // Update the selected stock status
    };

    // Handle changes to the sorting order
    const handleSortChange = (e) => {
        setSortOrder(e.target.value); // Update the sorting order
    };

    // Filter and sort the products
    const filteredProducts = products
        .filter((product) => {
            const matchesSearchTerm = product.name.toLowerCase().includes(searchQuery.toLowerCase()); // Check search term
            const matchesCategory = selectedCategory ? product.category?.id === parseInt(selectedCategory) : true; // Check category
            const matchesSubcategory = selectedSubcategory ? product.subcategory?.id === parseInt(selectedSubcategory) : true; // Check subcategory
            return matchesSearchTerm && matchesCategory && matchesSubcategory; // Combine filters
        })
        .sort((a, b) => {
            if (sortOrder === 'low-to-high') {
                return a.variants[0]?.price - b.variants[0]?.price; // Sort by price low to high
            } else if (sortOrder === 'high-to-low') {
                return b.variants[0]?.price - a.variants[0]?.price; // Sort by price high to low
            }
            return 0; // No sorting
        });

    // Get visible products based on the visible count
    const visibleProducts = filteredProducts.slice(0, visibleCount);

   return (
    <ErrorBoundary>
        <div className="container my-5" style={{ backgroundColor: 'white', color: 'black', minHeight: '50vh' }}>
        <h2
    className="mb-4"
    
    style={{
        cursor: 'pointer',
        fontFamily: "'Poppins', sans-serif", // Modern font
        fontWeight: '600',
        fontSize: '2rem',
        // background: 'linear-gradient(to right, #ff7e5f,rgb(10, 16, 25))', // Gradient text
        WebkitBackgroundClip: 'text',
         
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
        transition: 'transform 0.3s ease, text-shadow 0.3s ease', // Smooth animation
    }}
    onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)'; // Slight zoom on hover
        e.target.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.2)'; // Stronger shadow on hover
    }}
    onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'; // Reset zoom
        e.target.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)'; // Reset shadow
    }}
>
    Shop By Category 
</h2>

            {/* Search, Category, and Sorting Filters */}
            <div className="mb-4">
                {/* Search Bar */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        style={{ width: '100%' }}
                    />
                </div>
                {/* Sort Dropdown */}
                <select
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="form-select mb-3"
                        style={{ maxWidth: '250px', flex: 1 }}
                    >
                        <option value="">Sort by</option>
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                    </select>

                {/* Filters Row */}
                <div className="d-flex justify-content-between flex-wrap">
                     
                    {/* Category Dropdown */}
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
                    {/* Category Dropdown */}
                    <select
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        className="form-select mb-3"
                        style={{ maxWidth: '250px', flex: 1 }}
                    >
                        <option value="">All Subcategories</option>
                        {loading ? (
                            <option>Loading subcategories...</option>
                        ) : (
                            subcategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))
                        )}
                    </select>

                   
                </div>
            </div>

            {/* Product Grid */}
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
                                    ) : (
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
                                    )}

                                    {/* Product Info */}
                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                        <h5
                                            className="card-title"
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                minHeight: '50px',
                                                textDecoration:'underline'
                                            }}
                                        >
                                            {product.name}
                                        </h5>
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
                    <p>No products found for this category.</p>
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
                     @media (min-width: 768px) and (max-width: 1024px) {
                    .row {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 0rem;
                    }
                }
                  
            `}</style>

            {/* Show More / Show Less Buttons */}
            <div style={{ marginTop: '1rem' }}>
                {filteredProducts.length > visibleCount && (
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
                        onClick={() => setVisibleCount(4)}
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
