// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const CategoryWithSubcategories = () => {
//     const [selectedCategory, setSelectedCategory] = useState(null); // Stores category details
//     const [subcategories, setSubcategories] = useState([]); // Stores subcategories
//     const [loading, setLoading] = useState(true); // Tracks loading status
//     const navigate = useNavigate(); // Navigation hook

//     useEffect(() => {
//         // Fetch selected category details and subcategories
//         axios
//             .get('http://localhost:8080/api/selected-category/details-with-subcategories')
//             .then(response => {
//                 const { categoryId, categoryName, categoryImage, subcategories } = response.data;
//                 setSelectedCategory({ categoryId, categoryName, categoryImage });
//                 setSubcategories(subcategories);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching category details:', error);
//                 setLoading(false);
//             });
//     }, []);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="container my-5" style={{ minHeight: '70vh' }}>
//             {/* Selected Category Name and Image */}
//             {selectedCategory && (
//                 <div className="text-center mb-4">
//                     <h1>{selectedCategory.categoryName}</h1>
//                     {selectedCategory.categoryImage && (
//                         <img
//                             src={`data:image/jpeg;base64,${selectedCategory.categoryImage}`}
//                             alt={selectedCategory.categoryName}
//                             style={{
//                                 width: '200px',
//                                 height: '200px',
//                                 objectFit: 'cover',
//                                 borderRadius: '50%',
//                             }}
//                         />
//                     )}
//                 </div>
//             )}

//             {/* Subcategories Section */}
//             <h2 className="text-center mt-5">Subcategories</h2>
//             <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 gx-4 gy-4 mt-4">
//                 {subcategories.length > 0 ? (
//                     subcategories.map(subcategory => (
//                         <div
//                             key={subcategory.id}
//                             className="col d-flex flex-column align-items-center"
//                             onClick={() => navigate(`/products/subcategory/${subcategory.id}`)}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <div
//                                 className="card shadow-sm"
//                                 style={{
//                                     width: '150px',
//                                     borderRadius: '8px',
//                                     overflow: 'hidden',
//                                     textAlign: 'center',
//                                 }}
//                             >
//                                 {/* Subcategory Image */}
//                                 {subcategory.image ? (
//                                     <img
//                                         src={`data:image/jpeg;base64,${subcategory.image}`}
//                                         alt={subcategory.name}
//                                         style={{
//                                             width: '100%',
//                                             height: '150px',
//                                             objectFit: 'cover',
//                                         }}
//                                     />
//                                 ) : (
//                                     <div
//                                         style={{
//                                             width: '100%',
//                                             height: '150px',
//                                             backgroundColor: '#f0f0f0',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             color: '#888',
//                                         }}
//                                     >
//                                         No Image
//                                     </div>
//                                 )}
//                                 {/* Subcategory Name */}
//                                 <div className="card-body">
//                                     <h5
//                                         className="card-title"
//                                         style={{
//                                             fontSize: '1rem',
//                                             fontWeight: 'bold',
//                                             marginBottom: 0,
//                                         }}
//                                     >
//                                         {subcategory.name}
//                                     </h5>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="col-12 text-center">
//                         <p>No subcategories found for this category.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CategoryWithSubcategories;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryWithSubcategories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null); // Stores category details
    const [subcategories, setSubcategories] = useState([]); // Stores subcategories
    const [loading, setLoading] = useState(true); // Tracks loading status
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        // Fetch selected category details and subcategories
        axios
            .get('http://localhost:8080/api/selected-category/details-with-subcategories')
            .then(response => {
                const { categoryId, categoryName, categoryImage, subcategories } = response.data;
                setSelectedCategory({ categoryId, categoryName, categoryImage });
                setSubcategories(subcategories);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching category details:', error);
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (subcategory) => {
        if (subcategory.subsubcategories && subcategory.subsubcategories.length > 0) {
            // Navigate to subsubcategory page if subsubcategories exist
            navigate(`/subsubcategories/${subcategory.id}`);
        } else {
            // Navigate to product listing page otherwise
            navigate(`/products/subcategory/${subcategory.id}`);
        }
    };
    

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container my-5" style={{ minHeight: '70vh',backgroundColor:'white' }}>
            {/* Selected Category Name and Image */}
            {selectedCategory && (
                <div className="text-center mb-4">
                    <h1>{selectedCategory.categoryName}</h1>
                    {selectedCategory.categoryImage && (
                        <img
                            src={`data:image/jpeg;base64,${selectedCategory.categoryImage}`}
                            alt={selectedCategory.categoryName}
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                            }}
                        />
                    )}
                </div>
            )}

            {/* Subcategories Section */}
{/* <h2 className="text-center mt-5">Subcategories</h2> */}
<div
    className="d-flex flex-wrap justify-content-center align-items-stretch"
    style={{
        gap: '10px', // Space between cards
        padding: '10px',
    }}
>
    {subcategories.length > 0 ? (
        subcategories.map(subcategory => (
            <div
                key={subcategory.id}
                onClick={() => handleCategoryClick(subcategory)}
                style={{
                    cursor: 'pointer',
                    flex: '1 1 calc(50% - 10px)', // Two cards per row on small screens
                    maxWidth: '200px', // Limit max width
                    minWidth: '150px', // Minimum width ensures two cards fit in 360px
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    className="card shadow-sm"
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%', // Equal height for all cards
                    }}
                >
                    {/* Subcategory Image */}
                    {subcategory.image ? (
                        <img
                            src={`data:image/jpeg;base64,${subcategory.image}`}
                            alt={subcategory.name}
                            style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'contain',
                                marginTop:'10px'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '150px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#888',
                            }}
                        >
                            No Image
                        </div>
                    )}
                    {/* Subcategory Name */}
                    <div className="card-body">
                        <h5
                            className="card-title"
                            style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                marginBottom: 0,
                            }}
                        >
                            {subcategory.name}
                        </h5>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className="text-center" style={{ width: '100%' }}>
            <p>No subcategories found for this category.</p>
        </div>
    )}
</div>

            </div>
        
    );
};

export default CategoryWithSubcategories;
