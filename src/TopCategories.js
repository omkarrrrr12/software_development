import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';

function TopCategories() {
    const [topCategories, setTopCategories] = useState([]);
    const navigate = useNavigate();
    const sliderRef = useRef(null); // Ref for the slider

    useEffect(() => {
        async function fetchTopCategories() {
            try {
                const response = await axios.get('http://localhost:8080/api/categories/top');
                setTopCategories(response.data);
            } catch (error) {
                console.error('Error fetching top categories:', error);
            }
        }
        fetchTopCategories();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        arrows: false, 
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Disable default arrows to use custom buttons
        responsive: [
            {
                breakpoint: 2000,
                settings: { slidesToShow: 5,slidesToScroll: 1 },
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 550,
                settings: { slidesToShow: 2 },
            },
        ],
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        navigate(`/category/${categoryId}`, { state: { categoryName } });
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: 'white', position: 'relative' }}>
            <h2 className="text-center mb-4">Top Categories</h2>

            {/* Custom Navigation Buttons */}
            <button
                className="custom-arrow left-arrow"
                onClick={() => sliderRef.current.slickPrev()} // Move to the previous slide
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            <Slider ref={sliderRef} {...settings}>
                {topCategories.length > 0 ? (
                    topCategories.map((category) => (
                        <div
                            key={category.id}
                            className="d-flex flex-column align-items-center px-2"
                        >
                            {/* Category Card */}
                            <div
                                className="card"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleCategoryClick(category.id, category.name)}
                            >
                                <img
                                    src={`data:image/jpeg;base64,${category.image}`}
                                    alt={category.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            </div>

                            {/* Category Name */}
                            <h5
                                className="text-center mt-2"
                                style={{
                                    fontSize: '16px',
                                    maxWidth: '150px',
                                    wordWrap: 'break-word',
                                    cursor: 'pointer',
                                }}
                            >
                                <Link
                                    to="#"
                                    className="text-decoration-none"
                                    onClick={() => handleCategoryClick(category.id, category.name)}
                                >
                                    {category.name}
                                </Link>
                            </h5>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No categories available</p>
                )}
            </Slider>
        </div>
    );
}

export default TopCategories;
