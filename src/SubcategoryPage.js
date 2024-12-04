import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubcategoryPage() {
    const { id } = useParams(); // Extract the category ID
    const [subcategories, setSubcategories] = useState([]);
    const [categoryName, setCategoryName] = useState(''); // State for top category name
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        window.scrollTo(0, 0);
        // Fetch subcategories and top category name
        async function fetchSubcategories() {
            try {
                // Fetch subcategories by category ID
                const subcategoryResponse = await axios.get(`http://localhost:8080/api/subcategories/category/${id}`);
                setSubcategories(subcategoryResponse.data);

                // Fetch top category details (name) by category ID
                const categoryResponse = await axios.get(`http://localhost:8080/api/categories/${id}`);
                setCategoryName(categoryResponse.data.name); // Assuming the response has a 'name' field for the category
            } catch (error) {
                console.error('Error fetching subcategory details:', error);
            }
        }
        fetchSubcategories();
    }, [id]);

    const handleSubcategoryClick = async (categoryId, subcategoryId) => {
        try {
            // Fetch subsubcategories for the selected subcategory
            const subsubcategoriesResponse = await axios.get(`http://localhost:8080/api/subsubcategories/subcategory/${subcategoryId}`);
            
            // If the response is empty (subsubcategories not found), handle it gracefully
            if (!subsubcategoriesResponse.data || subsubcategoriesResponse.data.length === 0) {
                console.log('No subsubcategories found, navigating to product list');
                navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
            } else {
                console.log('Subsubcategories found, navigating to SubsubcategoryPage');
                navigate(`/subcategory/category/${categoryId}/subcategory/${subcategoryId}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Subsubcategories not found for this subcategory.');
                // If 404 occurs, handle the error gracefully (i.e., navigate to product list)
                navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
            } else {
                console.error('Error fetching subsubcategories:', error);
            }
        }
    };

    return (
        <div className="container mt-5" style={{backgroundColor:'white'}}>
           <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3" style={{marginBottom:'1px'}}>
                &larr; Back
            </button>

            {/* Display the current top category name */}
            <h2 className="text-center mb-4">{categoryName} Subcategories</h2>

            {/* Show message if no subcategories are available */}
            {subcategories.length === 0 ? (
                <p className="text-center mt-5">No subcategories available</p>
            ) : (
                <div className="row">
                    {subcategories.map((subcategory) => (
                        <div
                            key={subcategory.id}
                            className="col-6 col-md-3 d-flex flex-column align-items-center mb-4"
                        >
                            {/* Make the image clickable */}
                            <div
                                className="card"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                                onClick={() => handleSubcategoryClick(id, subcategory.id)} // Make image clickable
                                role="button"
                            >
                                <img
                                    src={`data:image/jpeg;base64,${subcategory.image}`}
                                    alt={subcategory.name}
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
                            <h5
                                className="text-center mt-2"
                                style={{
                                    fontSize: '16px',
                                    maxWidth: '150px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                <Link
                                    to="#"
                                    className="text-decoration-none"
                                    onClick={() => handleSubcategoryClick(id, subcategory.id)} // Make name clickable
                                >
                                    {subcategory.name}
                                </Link>
                            </h5>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SubcategoryPage;
