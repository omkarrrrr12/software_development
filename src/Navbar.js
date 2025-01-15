import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';

function Navbar() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null); // To manage the active category
    const [isNavbarOpen, setIsNavbarOpen] = useState(false); // To manage navbar collapse state
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8080/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId); // Toggle active category
    };

    const handleSubcategoryClick = (categoryId, subcategoryId, subsubcategories) => {
        // Close the dropdown after selecting a subcategory
        setActiveCategory(null);

        if (subsubcategories && subsubcategories.length > 0) {
            navigate(`/subcategory/category/${categoryId}/subcategory/${subcategoryId}`);
        } else {
            navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
        }

        // Close the navbar after a subcategory click (hamburger menu)
        setIsNavbarOpen(false);
    };

    // Hover handlers for dropdown
    const handleMouseEnter = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleMouseLeave = () => {
        setActiveCategory(null);
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={isNavbarOpen ? 'true' : 'false'}
                    aria-label="Toggle navigation"
                    onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                >
                    <span className="navbar-toggler-icon"></span> Categories🗂️
                </button>
                <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav">
                        {categories.map((category, index) => (
                            <li
                                key={category.id}
                                className={`nav-item dropdown ${activeCategory === category.id ? 'show' : ''}`}
                                onMouseEnter={() => handleMouseEnter(category.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#!"
                                    id={`category-${category.id}`}
                                    role="button"
                                    aria-expanded={activeCategory === category.id ? 'true' : 'false'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCategoryClick(category.id);
                                    }}
                                    style={{
                                        whiteSpace: 'normal',
                                        wordWrap: 'normal',
                                        maxWidth: '180px',
                                        fontSize: '11px',
                                    }}
                                >
                                    {category.name}
                                </a>
                                {activeCategory === category.id && (
                                    <ul
                                        className="dropdown-menu show"
                                        aria-labelledby={`category-${category.id}`}
                                        style={{
                                            maxWidth: '350px',
                                            overflow: 'hidden',
                                            whiteSpace: 'normal',
                                            fontSize: '9px',
                                            position: 'absolute',
                                            [index >= categories.length - 4 ? 'right' : 'left']: '0',
                                        }}
                                    >
                                        <div className="d-flex align-items-start p-2" style={{ width: '100%',minHeight:'120px' }}>
                                            {/* Subcategories list */}
                                            <div
                                                style={{
                                                    flexGrow: 1,
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    marginRight: '10px',
                                                }}
                                            >
                                                {category.subcategories.length > 0 ? (
                                                    category.subcategories.map((subcategory) => (
                                                        <li key={subcategory.id}>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#!"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleSubcategoryClick(
                                                                        category.id,
                                                                        subcategory.id,
                                                                        subcategory.subsubcategories
                                                                    );
                                                                }}
                                                            >
                                                                {subcategory.name}
                                                            </a>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p className="text-muted" style={{ fontSize: '10px' }}>
                                                        No subcategories available
                                                    </p>
                                                )}
                                            </div>
    
                                            {/* Image on the top-right corner */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    width: '100px',
                                                    height: '100px',
                                                }}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${category.image}`}
                                                    alt={category.name}
                                                    className="img-fluid"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
    export default Navbar;
    
    

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container-fluid">
//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarNav"
//                     aria-controls="navbarNav"
//                     aria-expanded={isNavbarOpen ? 'true' : 'false'} // Control the expanded state based on the `isNavbarOpen` state
//                     aria-label="Toggle navigation"
//                     onClick={() => setIsNavbarOpen(!isNavbarOpen)} // Toggle the navbar on button click
//                 >
//                     <span className="navbar-toggler-icon"></span> Categories🗂️
//                 </button>
//                 <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarNav">
//                     <ul className="navbar-nav">
                        
//                         {categories.map((category, index) => (
//                             <li
//                                 key={category.id}
//                                 className={`nav-item dropdown ${activeCategory === category.id ? 'show' : ''}`}
//                                 onMouseEnter={() => handleMouseEnter(category.id)} // Show dropdown on hover
//                                 onMouseLeave={handleMouseLeave} // Hide dropdown when mouse leaves
//                             >
//                                 <a
//                                     className="nav-link dropdown-toggle"
//                                     href="#!"
//                                     id={`category-${category.id}`}
//                                     role="button"
//                                     aria-expanded={activeCategory === category.id ? 'true' : 'false'}
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         handleCategoryClick(category.id);
//                                     }}
//                                     style={{
//                                         whiteSpace: 'normal',  // Allow the text to wrap if it's too long
//                                         wordWrap: 'normal',
//                                         maxWidth: '180px',
//                                         fontSize: '11px' // Break words if necessary
//                                     }}
//                                 >
//                                     {category.name}
//                                 </a>
//                                 {activeCategory === category.id && (
//                                     <ul
//                                         className="dropdown-menu show"
//                                         aria-labelledby={`category-${category.id}`}
//                                         style={{
//                                             maxWidth: '350px',
//                                             overflow: 'hidden',
//                                             whiteSpace: 'normal', 
//                                             fontSize: '9px', // Allow text to wrap inside the dropdown
//                                             position: 'absolute',
//                                             // Conditional logic for last 2-3 categories
//                                             [index >= categories.length - 4 ? 'right' : 'left']: '0',
//                                         }}
//                                     >
//                                         <div className="d-flex align-items-start p-2" style={{ width: '100%' }}>
//                                             {/* Subcategories list on the left */}
//                                             <div style={{ flexGrow: 1, maxHeight: '300px', overflowY: 'auto' }}>
//                                                 {category.subcategories.map(subcategory => (
//                                                     <li key={subcategory.id}>
//                                                         <a
//                                                             className="dropdown-item"
//                                                             href="#!"
//                                                             onClick={(e) => {
//                                                                 e.preventDefault();
//                                                                 handleSubcategoryClick(
//                                                                     category.id,
//                                                                     subcategory.id,
//                                                                     subcategory.subsubcategories
//                                                                 );
//                                                             }}
//                                                         >
//                                                             {subcategory.name}
//                                                         </a>
//                                                     </li>
                                                    
//                                                 ))}
//                                             </div>
                                            
//                                             {/* Category image on the right */}
//                                             <div style={{ flexShrink: 0 }}>
//                                                 <img
//                                                     src={`data:image/jpeg;base64,${category.image}`}
//                                                     alt={category.name}
//                                                     className="img-fluid"
//                                                     style={{
//                                                         maxWidth: '120px',
//                                                         maxHeight: '120px',
//                                                         objectFit: 'cover',
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// }

// export default Navbar;
