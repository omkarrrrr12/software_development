import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick'; // Import react-slick
import './NewArrivals.css';

const NewArrivalProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0); // Progress state to control progress bar
    const navigate = useNavigate();
    const sliderRef = useRef(null); // Ref for the slider

    useEffect(() => {
        fetchNewArrivals();
    }, []);

    const fetchNewArrivals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products/new-arrivals');
            console.log('Fetched new arrivals:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Slider settings
    const sliderSettings = {
        infinite: true,
        arrows:false,
        speed: 500,
        slidesToScroll: 1,
        centerMode: false,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, 
        slidesToShow: Math.min(6, filteredProducts.length),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(4, filteredProducts.length),
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(3, filteredProducts.length),
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 530,
                settings: {
                    slidesToShow: Math.min(2, filteredProducts.length),
                    slidesToScroll: 1,
                },
            },
        ],
        beforeChange: (current, next) => setCurrentSlide(next),
        afterChange: (index) => updateProgress(index),
    };

    // Function to update progress based on slide position
    const updateProgress = (nextSlide) => {
        const totalSlides = filteredProducts.length;
        const progressIncrement = (100 / totalSlides);
        const newProgress = nextSlide === totalSlides - 1 ? 100 : nextSlide * progressIncrement;
        setProgress(newProgress);
    };

    // Conditionally render the section if products are available
    if (filteredProducts.length === 0) {
        return null; // Don't render anything if there are no products
    }
    const handleNewArrivalsClick = () => {
        navigate('/new-arrivals');
    };

    return (
        <div className="container my-5" style={{ background: "linear-gradient(to right, #ccdcf1,#091b33)", position: 'relative'}}>
            <h2
    className="mb-4"
    onClick={handleNewArrivalsClick}
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
    New Arrivals
</h2>



            {/* Custom Arrow Navigation */}
            <button
                className="custom-arrow left-arrow"
                onClick={() => sliderRef.current.slickPrev()} // Move to the previous slide
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'grey',
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor:'FBFBFB',
                    width: '30px',
                    height: '30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: '10',
                }}
            >
                &lt; {/* Left Arrow Symbol */}
            </button>

            <button
    className="custom-arrow right-arrow"
    onClick={() => sliderRef.current.slickNext()} // Move to the next slide
    style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        backgroundColor:'FBFBFB',
        color: 'grey',
        border: 'none',
        borderRadius: '50%',
        width: '30px',  // Reduced width
        height: '30px', // Reduced height
        fontSize: '16px', // Reduced font size
        cursor: 'pointer',
        zIndex: '10',
    }}
>
    &gt; {/* Right Arrow Symbol */}
</button>


            {/* Slider */}
            <Slider ref={sliderRef} {...sliderSettings}>
                {filteredProducts.map((product) => {
                    const firstVariant = product.variants && product.variants[0];
                    return (
                        <div key={product.id} className="px-0">
                            <div
                                className="card shadow-sm h-100"
                                onClick={() => handleProductClick(product.id)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '10px',
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
                                    <h5 className="card-title" style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold',
                                        minHeight: '50px',
                                        textDecoration:'underline'
                                    }}>
                                        {product.name.length > 120
                                            ? `${product.name.substring(0, 120)}...`
                                            : product.name}
                                    </h5>

                                    {/* Price and Buttons */}
                                    <span className="product-price" style={{
                                        fontSize: '0.9rem',
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                    }}>
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
                })}
            </Slider>

               {/* Slider Progress Bar */}
               <div
                style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: '#ddd',
                    marginTop: '10px',
                    position: 'relative',
                    borderRadius: '2px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#000',
                        transition: 'width 0.2s ease-out',
                        borderRadius: '2px',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default NewArrivalProductList;
