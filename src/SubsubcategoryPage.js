import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubsubcategoryPage() {
    const { categoryId, subcategoryId } = useParams(); // Get categoryId and subcategoryId from URL params
    const [subsubcategories, setSubsubcategories] = useState([]); // Store subsubcategories
    const navigate = useNavigate();

    // Fetch subsubcategories for the given subcategory
    useEffect(() => {
        async function fetchSubsubcategories() {
            try {
                const response = await axios.get(`http://localhost:8080/api/subsubcategories/subcategory/${subcategoryId}`);
                setSubsubcategories(response.data); // Update state with subsubcategories
            } catch (error) {
                console.error('Error fetching subsubcategories:', error);
            }
        }

        if (subcategoryId) {
            fetchSubsubcategories(); // Fetch subsubcategories when subcategoryId is available
        }
    }, [subcategoryId]);

    const handleSubsubcategoryClick = (subsubcategoryId) => {
        // Navigate to the product list for the selected subsubcategory
        navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`);
    };

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="container my-5" style={{backgroundColor:'white'}}>
           <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3" style={{marginBottom:'1px'}}>
                &larr; Back
            </button>

            <h2 className="mb-4">Select a Subsubcategory</h2>

            {/* Display the list of subsubcategories */}
            <div className="row g-3"> {/* Adjusted gutter spacing */}
                {subsubcategories.length > 0 ? (
                    subsubcategories.map(subsub => (
                        <div key={subsub.id} className="col-6 col-md-3"> {/* Smaller column sizes */}
                            <div 
                                className="card h-100 shadow-sm" 
                                onClick={() => handleSubsubcategoryClick(subsub.id)}
                                style={{
                                    cursor: 'pointer',
                                    maxWidth: '180px', // Reduced card width
                                    margin: '0 auto', // Center card horizontally
                                }}
                            >
                                <img 
                                    src={`data:image/jpeg;base64,${subsub.image}`} 
                                    alt={subsub.name} 
                                    className="card-img-top" 
                                    style={{
                                        objectFit: 'contain', 
                                        height: '150px', // Reduced image height
                                    }}
                                />
                                <div 
                                    className="card-body text-center" 
                                    style={{
                                        padding: '0.5rem', // Reduced padding
                                    }}
                                >
                                    <h6 
                                        className="card-title" 
                                        style={{
                                            fontSize: '0.9rem', // Smaller font size
                                            marginBottom: '0.5rem', // Reduced bottom margin
                                        }}
                                    >
                                        {subsub.name}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No subsubcategories found.</p>
                )}
            </div>
        </div>
    );
}

export default SubsubcategoryPage;
