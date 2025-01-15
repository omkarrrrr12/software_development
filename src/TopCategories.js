// import React, { useEffect, useState, useRef } from 'react'; // Import useRef
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import Slider from 'react-slick';

// function TopCategories() {
//     const [topCategories, setTopCategories] = useState([]);
//     const navigate = useNavigate();
//     const sliderRef = useRef(null); // Ref for the slider

//     useEffect(() => {
//         async function fetchTopCategories() {
//             try {
//                 const response = await axios.get('http://localhost:8080/api/categories/top');
//                 setTopCategories(response.data);
//             } catch (error) {
//                 console.error('Error fetching top categories:', error);
//             }
//         }
//         fetchTopCategories();
//     }, []);

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         draggable: true,
//         swipeToSlide: true,
//         arrows: false, 
//         autoplay: true, // Enable autoplay
//         autoplaySpeed: 2000, // Disable default arrows to use custom buttons
//         responsive: [
//             {
//                 breakpoint: 2000,
//                 settings: { slidesToShow: 5,slidesToScroll: 1 },
//             },
//             {
//                 breakpoint: 1024,
//                 settings: { slidesToShow: 4 },
//             },
//             {
//                 breakpoint: 768,
//                 settings: { slidesToShow: 3 },
//             },
//             {
//                 breakpoint: 550,
//                 settings: { slidesToShow: 2 },
//             },
//         ],
//     };

//     const handleCategoryClick = (categoryId, categoryName) => {
//         navigate(`/category/${categoryId}`, { state: { categoryName } });
//     };

//     return (
//         <div className="container mt-5" style={{ backgroundColor: 'white', position: 'relative' }}>
//             <h2
//     className="mb-4"
    
//     style={{
//         cursor: 'pointer',
//         fontFamily: "'Poppins', sans-serif", // Modern font
//         fontWeight: '600',
//         fontSize: '2rem',
//         // background: 'linear-gradient(to right, #ff7e5f,rgb(10, 16, 25))', // Gradient text
//         WebkitBackgroundClip: 'text',
         
//         textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
//         transition: 'transform 0.3s ease, text-shadow 0.3s ease', // Smooth animation
//     }}
//     onMouseEnter={(e) => {
//         e.target.style.transform = 'scale(1.05)'; // Slight zoom on hover
//         e.target.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.2)'; // Stronger shadow on hover
//     }}
//     onMouseLeave={(e) => {
//         e.target.style.transform = 'scale(1)'; // Reset zoom
//         e.target.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)'; // Reset shadow
//     }}
// >
//     Popular Accessories 
// </h2>

//             {/* Custom Navigation Buttons */}
//             <button
//                 className="custom-arrow left-arrow"
//                 onClick={() => sliderRef.current.slickPrev()} // Move to the previous slide
//                 style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '10px',
//                     transform: 'translateY(-50%)',
//                     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                     color: 'grey',
//                     border: 'none',
//                     borderRadius: '50%',
//                     backgroundColor:'FBFBFB',
//                     width: '30px',
//                     height: '30px',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     zIndex: '10',
//                 }}
//             >
//                 &lt; {/* Left Arrow Symbol */}
//             </button>

//             <button
//                 className="custom-arrow right-arrow"
//                 onClick={() => sliderRef.current.slickNext()} // Move to the next slide
//                 style={{
//                     position: 'absolute',
//                     top: '50%',
//                     right: '10px',
//                     transform: 'translateY(-50%)',
//                     backgroundColor:'FBFBFB',
//                     color: 'grey',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '30px',  // Reduced width
//                     height: '30px', // Reduced height
//                     fontSize: '16px', // Reduced font size
//                     cursor: 'pointer',
//                     zIndex: '10',
//                 }}
//             >
//                 &gt; {/* Right Arrow Symbol */}
//             </button>

//             {/* Slider */}
//             <Slider ref={sliderRef} {...settings}>
//                 {topCategories.length > 0 ? (
//                     topCategories.map((category) => (
//                         <div
//                             key={category.id}
//                             className="d-flex flex-column align-items-center px-2"
//                         >
//                             {/* Category Card */}
//                             <div
//                                 className="card"
//                                 style={{
//                                     width: '50px',
//                                     height: '50px',
//                                     overflow: 'hidden',
//                                     position: 'relative',
//                                     cursor: 'pointer',
//                                     borderRadius:'50%',
//                                 }}
//                                 onClick={() => handleCategoryClick(category.id, category.name)}
//                             >
//                                 <img
//                                     src={`data:image/jpeg;base64,${category.image}`}
//                                     alt={category.name}
//                                     style={{
//                                         width: '100%',
//                                         height: '100%',
//                                         objectFit: 'cover',
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0,
//                                     }}
//                                 />
//                             </div>

//                             {/* Category Name */}
//                             <h5
//                                 className="text-center mt-2"
//                                 style={{
//                                     fontSize: '16px',
//                                     maxWidth: '150px',
//                                     wordWrap: 'break-word',
//                                     cursor: 'pointer',
//                                 }}
//                             >
//                                 <Link
//                                     to="#"
//                                     className="text-decoration-none"
//                                     onClick={() => handleCategoryClick(category.id, category.name)}
//                                 >
//                                     {category.name}
//                                 </Link>
//                             </h5>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-center">No categories available</p>
//                 )}
//             </Slider>
//         </div>
//     );
// }

// export default TopCategories;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';

function TopCategories() {
    const [topCategories, setTopCategories] = useState([]);
    const navigate = useNavigate();
    const sliderRef = useRef(null);

    useEffect(() => {
        async function fetchTopCategories() {
            try {
                const response = await axios.get('http://localhost:8080/api/subcategories');
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
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            { breakpoint: 2000, settings: { slidesToShow: 7, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 550, settings: { slidesToShow: 4 } },
        ],
    };

    // const handleCategoryClick = (subcategoryId, subsubcategories) => {
    //     if (subsubcategories) {
    //         navigate(`/subsubcategories/${subcategoryId}`);
    //     } else {
    //         navigate(`/products/subcategory/${subcategoryId}`);
    //     }
    // };
    const handleCategoryClick = (subcategoryId, subsubcategories) => {
        console.log('Subcategory ID:', subcategoryId);
        console.log('Subsubcategories:', subsubcategories);
    
        if (Array.isArray(subsubcategories) && subsubcategories.length > 0) {
            navigate(`/subsubcategories/${subcategoryId}`);
        } else {
            navigate(`/products/subcategory/${subcategoryId}`);
        }
    };
    
    return (
        <div className="container mt-5" style={{ backgroundColor: '', position: 'relative' }}>
            <h2
                className="mb-4"
                style={{
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600',
                    fontSize: '2rem',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, text-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
                }}
            >
                Popular Accessories
            </h2>

            {/* Custom Navigation Buttons */}
            <button
                className="custom-arrow left-arrow"
                onClick={() => sliderRef.current.slickPrev()}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'grey',
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor: 'FBFBFB',
                    width: '30px',
                    height: '30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: '10',
                }}
            >
                &lt;
            </button>

            <button
                className="custom-arrow right-arrow"
                onClick={() => sliderRef.current.slickNext()}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'FBFBFB',
                    color: 'grey',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: '10',
                }}
            >
                &gt;
            </button>

            {/* Slider */}
            <Slider ref={sliderRef} {...settings}>
                {topCategories.length > 0 ? (
                    topCategories.map((category) => (
                        <div key={category.id} className="d-flex flex-column align-items-center px-2">
                            {/* Category Card */}
                            <div
                                className="card"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    border:'none',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }}
                                onClick={() => handleCategoryClick(category.id, category.subsubcategoryId)}
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
                                    onClick={() => handleCategoryClick(category.id, category.subsubcategoryId)}
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




