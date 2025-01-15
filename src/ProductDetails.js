// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ProductDetails = () => {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentVariant, setCurrentVariant] = useState(null);
//     const [variantImages, setVariantImages] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [dimensions, setDimensions] = useState([]);
//     const sliderRef = useRef();
//     const [variants, setVariants] = useState([]);
    
    
//     useEffect(() => {
        
//         const fetchProduct = async () => {
//             try {
//                 const productResponse = await axios.get(`http://localhost:8080/api/products/${id}`);
//                 setProduct(productResponse.data);

//                 const variantResponse = await axios.get(`http://localhost:8080/api/products/${id}/variants`);
//                 const fetchedVariants = variantResponse.data;
//                 setVariants(fetchedVariants);

//                 if (fetchedVariants.length > 0) {
//                     setCurrentVariant(fetchedVariants[0]);
//                     setVariantImages(getFirstImagePerColor(fetchedVariants));
//                     setDimensions(getUniqueDimensionsForVariant(fetchedVariants, fetchedVariants[0]));
//                 }

//                 setLoading(false);
//             } catch (error) {
//                 setError('Error fetching product details');
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, [id]);

//     const getUniqueDimensionsForVariant = (variants, selectedVariant) => {
//         const filteredVariants = variants.filter((variant) => variant.color === selectedVariant.color);
//         return [...new Set(filteredVariants.map((variant) => variant.dimensions))];
//     };

//     const getFirstImagePerColor = (variants) => {
//         const seenColors = new Set();
//         const uniqueImages = [];

//         variants.forEach((variant) => {
//             if (!seenColors.has(variant.color)) {
//                 seenColors.add(variant.color);
//                 uniqueImages.push(variant.images[0]);
//             }
//         });

//         return uniqueImages;
//     };

//     const handleDotClick = (index) => {
//         setCurrentIndex(index);
//         const scrollTo = sliderRef.current.clientWidth * index;
//         sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
//     };

//     const handleScroll = () => {
//         const slider = sliderRef.current;
//         const imageWidth = slider.clientWidth;
//         const newIndex = Math.round(slider.scrollLeft / imageWidth);
//         setCurrentIndex(newIndex);
//     };

//     useEffect(() => {
//         const slider = sliderRef.current;
//         if (slider) {
//             slider.addEventListener('scroll', handleScroll);
//             return () => slider.removeEventListener('scroll', handleScroll);
//         }
//     }, []);
  
//     const handleDimensionChange = (event) => {
//         const selectedDimension = event.target.value;
//         const selectedVariant = variants.find(
//             (v) => v.color === currentVariant.color && v.dimensions === selectedDimension
//         );
//         setCurrentVariant(selectedVariant);
//         setDimensions(getUniqueDimensionsForVariant(variants, selectedVariant));
//     };

//     if (loading) return <div className="text-center mt-5">Loading...</div>;
//     if (error) return <div className="text-center text-danger mt-5">{error}</div>;
//     if (!product) return <div className="text-center mt-5">Product not found</div>;

//     return (
//         <div className="container my-5 bg-white shadow-sm rounded">
//             <div className="row">
//                 {/* Left Section */}
//                 <div className="col-lg-6 mb-4">
//                     <div className="p-3">
//                         {/* Main Image Slider */}
//                         <div className="slider-container" ref={sliderRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap', borderRadius: '10px', maxWidth: '350px', maxHeight: '350px' }}>
//                             {currentVariant &&
//                                 currentVariant.images.map((image, index) => (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             display: 'inline-block',
//                                             width: '100%',
//                                             paddingTop: '100%',
//                                             position: 'relative',
//                                         }}
//                                     >
//                                         <img
//                                             src={`data:image/jpeg;base64,${image}`}
//                                             alt={`Variant ${index}`}
//                                             className={`position-absolute top-0 start-0 w-100 h-100 rounded`}
//                                             style={{
//                                                 objectFit: 'contain', // Ensures the image fits within the new size while maintaining aspect ratio
//                                             }}
//                                         />
//                                     </div>
//                                 ))}
//                         </div>
//                         {/* Thumbnail Images */}
//                         <div className="d-flex justify-content-center mt-3">
//                             {currentVariant &&
//                                 currentVariant.images.map((image, index) => (
//                                     <div
//                                         key={index}
//                                         className={`rounded overflow-hidden mx-1 ${currentIndex === index ? 'border border-primary' : ''}`}
//                                         onMouseOver={() => handleDotClick(index)}
//                                         style={{
//                                             width: '50px', // Adjusted width
//                                             height: '50px', // Adjusted height
//                                             cursor: 'pointer',
//                                         }}
//                                     >
//                                         <img
//                                             src={`data:image/jpeg;base64,${image}`}
//                                             alt={`Thumbnail ${index}`}
//                                             className="w-100 h-100"
//                                             style={{ objectFit: 'cover' }}
//                                         />
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="col-lg-6">
//                     <div className="p-3">
//                         <h3>{product.name}</h3>
//                         <h4 className="text-success">₹{currentVariant?.price.toFixed(2)}</h4>
//                         <p className={currentVariant?.stock > 0 ? 'text-success' : 'text-danger'}>
//                             {currentVariant?.stock > 0 ? 'In Stock' : 'Out of Stock'}
//                         </p>

//                         {/* Colors */}
//                         <h5>Color Options:</h5>
//                         <div className="d-flex flex-wrap mb-4">
//                             {variantImages.map((image, index) => (
//                                 <div
//                                     key={index}
//                                     className={`square p-1 mx-1 ${currentVariant?.color === variants[index]?.color ? 'border border-primary' : 'border border-light'}`}
//                                     onMouseOver={() => setCurrentVariant(variants[index])}
//                                     style={{ cursor: 'pointer', width: '60px', height: '60px', borderRadius: '20px' }}
//                                 >
//                                     <img
//                                         src={`data:image/jpeg;base64,${image}`}
//                                         alt={`Color ${index}`}
//                                         className="w-100 h-100 square"
//                                         style={{ objectFit: 'cover', borderRadius: '20px' }}
//                                     />
//                                     <p className="color-name">{variants[index].color}</p> {/* Color name under the image */}
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Dimensions */}
//                         <h5>Select Dimensions:</h5>
//                         <select
//     className="form-select mb-3"
//     style={{ maxWidth: '200px', width: '50%' }}  // Added width: '100%' for consistency
//     onChange={handleDimensionChange}
//     value={currentVariant?.dimensions || ''}
//  >
//     {dimensions.map((dimension, index) => (
//         <option key={index} value={dimension}>
//             {dimension}
//         </option>
//     ))}
//  </select>


//                         {/* Description */}
//                         <h5>Description:</h5>
//                         <p>{currentVariant?.description || product.description}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetails;  
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentVariant, setCurrentVariant] = useState(null);
    const [uniqueColors, setUniqueColors] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef();
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProduct(productResponse.data);

                const variantResponse = await axios.get(`http://localhost:8080/api/products/${id}/variants`);
                const fetchedVariants = variantResponse.data;
                setVariants(fetchedVariants);

                if (fetchedVariants.length > 0) {
                    const uniqueColorMap = getUniqueColorMap(fetchedVariants);
                    setUniqueColors(uniqueColorMap);

                    const initialColor = Object.keys(uniqueColorMap)[0];
                    const initialVariant = fetchedVariants.find((v) => v.color === initialColor);

                    setCurrentVariant(initialVariant);
                    setDimensions(getDimensionsByColor(fetchedVariants, initialColor));
                }

                setLoading(false);
            } catch (error) {
                setError("Error fetching product details");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getUniqueColorMap = (variants) => {
        const colorMap = {};
        variants.forEach((variant) => {
            if (!colorMap[variant.color]) {
                colorMap[variant.color] = variant.images[0]; // First image for each color
            }
        });
        return colorMap;
    };

    const getDimensionsByColor = (variants, color) => {
        return [...new Set(variants.filter((variant) => variant.color === color).map((variant) => variant.dimensions))];
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
        const scrollTo = sliderRef.current.clientWidth * index;
        sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    };

    const handleColorChange = (color) => {
        const selectedVariant = variants.find((variant) => variant.color === color);
        setCurrentVariant(selectedVariant);
        setDimensions(getDimensionsByColor(variants, color));
    };

    const handleDimensionChange = (event) => {
        const selectedDimension = event.target.value;
        const selectedVariant = variants.find(
            (variant) => variant.color === currentVariant.color && variant.dimensions === selectedDimension
        );
        setCurrentVariant(selectedVariant);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;
    if (!product) return <div className="text-center mt-5">Product not found</div>;

    return (
        <div className="container my-5 bg-white shadow-lg rounded p-4">
            <div className="row">
                 {/* Left Section */}
                 <div className="col-lg-6 mb-4">
                    <div className="p-3">
                        {/* Main Image Slider */}
                        <div className="slider-container" ref={sliderRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap', borderRadius: '10px', maxWidth: '450px', maxHeight: '450px', }}>
                            {currentVariant &&
                                currentVariant.images.map((image, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'inline-block',
                                            width: '100%',
                                            paddingTop: '100%',
                                            position: 'relative',
                                            
                                        }}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${image}`}
                                            alt={`Variant ${index}`}
                                            className={`position-absolute top-0 start-0 w-100 h-100 rounded`}
                                            style={{
                                                objectFit: 'contain', // Ensures the image fits within the new size while maintaining aspect ratio
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                        {/* Thumbnail Images */}
                        <div className="d-flex justify-content-center mt-3">
                            {currentVariant &&
                                currentVariant.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`rounded overflow-hidden mx-1 ${currentIndex === index ? 'border border-primary' : ''}`}
                                        onMouseOver={() => handleDotClick(index)}
                                        style={{
                                            width: '50px', // Adjusted width
                                            height: '50px', // Adjusted height
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${image}`}
                                            alt={`Thumbnail ${index}`}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-lg-6">
                    <div className="p-3">
                        <h3 className="mb-3 text-dark">{product.name}</h3>
                        <h4 className="text-success mb-3">₹{currentVariant?.price.toFixed(2)}</h4>
                        <p className={currentVariant?.stock > 0 ? "text-success" : "text-danger"}>
                            {currentVariant?.stock > 0 ? "In Stock" : "Out of Stock"}
                        </p>

                        {/* Colors */}
                        <h5 className="mb-2">Color Options:</h5>
                        <div className="d-flex flex-wrap mb-4">
                            {Object.entries(uniqueColors).map(([color, image], index) => (
                                <div
                                    key={index}
                                    className={`p-1 mx-1 ${
                                        currentVariant?.color === color ? "border border-primary" : "border border-light"
                                    }`}
                                    onClick={() => handleColorChange(color)}
                                    style={{
                                        cursor: "pointer",
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "20px",
                                        transition: "box-shadow 0.3s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
                                    }
                                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${image}`}
                                        alt={`Color ${color}`}
                                        className="w-100 h-100 rounded"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <p
                                        className="mt-1 text-center"
                                        style={{
                                            fontSize: "12px",
                                            margin: "0",
                                            fontWeight: currentVariant?.color === color ? "bold" : "normal",
                                        }}
                                    >
                                        {color}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Dimensions */}
                        <h5 className="mb-2">Select Dimensions:</h5>
                        <select
                            className="form-select mb-3 shadow-sm"
                            style={{ maxWidth: "200px", transition: "box-shadow 0.3s" }}
                            onChange={handleDimensionChange}
                            value={currentVariant?.dimensions || ""}
                            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")}
                            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        >
                            {dimensions.map((dimension, index) => (
                                <option key={index} value={dimension}>
                                    {dimension}
                                </option>
                            ))}
                        </select>

                        {/* Description */}
                        <h5 className="mb-2">Description:</h5>
                        <p className="text-muted">{currentVariant?.description || product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;



