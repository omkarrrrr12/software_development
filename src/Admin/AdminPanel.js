import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import Category from './Category';
import SubcategoryManager from './Subcategory';
import SubsubcategoryManager from './Subsubcategory';
import { useAdminAuth } from '../contexts/AdminAuthContext'; 
import CategorySelection from './CategorySelection';

const AdminPanel = () => {
    const { adminLogout } = useAdminAuth(); // Access the logout function

    return (
        <div className="container-fluid" style={styles.container}>
            {/* Left side navigation using Bootstrap */}
            <nav className="col-md-2 bg-dark text-white p-3 d-flex flex-column">
                <h2 className="mb-4">Admin Panel</h2>
                <ul className="nav flex-column mb-4">
                    <li className="nav-item">
                        <Link to="/admin/products" className="nav-link text-white">Manage <br/>Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/categories" className="nav-link text-white">Categories</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/subcategories" className="nav-link text-white">Subcategories</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/subsubcategories" className="nav-link text-white">Subsubcategories</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/selectedcategories" className="nav-link text-white">Selectedcategories</Link>
                    </li>
                    {/* Add Logout button in the navigation */}
                    <li className="nav-item">
                        <button onClick={adminLogout} className="btn btn-danger w-50">Logout</button>
                    </li>
                </ul>
            </nav>

            {/* Right side content */}
            <div className="col-md-10 p-4 bg-light" style={styles.content}>
                <Routes>
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/subcategories" element={<SubcategoryManager />} />
                    <Route path="/subsubcategories" element={<SubsubcategoryManager />} />
                    <Route path="/selectedcategories" element={<CategorySelection />} />
                </Routes>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        flexWrap: 'nowrap',
    },
    content: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f5f5f5',
        overflowY: 'auto',
    },
};

export default AdminPanel;
