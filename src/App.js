import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import TopCategories from './TopCategories';
import NewArrivalProductList from './NewArrivals';
import CustomerProductList from './CustomerProductList';
import SubsubcategoryPage from './SubsubcategoryPage';
import SubcategoryPage from './SubcategoryPage';
import ProductDetails from './ProductDetails';
import ProductFilter from './AdminPanelCategory';
import AllNewArrivals from './NewArrivalsAll';
import './App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <Navbar />
            <Routes>
                {/* Homepage Route: Only TopCategories on the homepage */}
                <Route
                    path="/"
                    element={
                        <>
                            <TopCategories />
                            <NewArrivalProductList /> {/* New Arrivals rendered below Top Categories */}
                            <ProductFilter />
                        </>
                    }
                />
                <Route path="/new-arrivals" element={<AllNewArrivals />} />

                {/* Category and Subcategory Routes */}
                <Route path="/category/:id" element={<SubcategoryPage />} /> {/* Subcategory Page for the selected category */}
                
                {/* Route for Products within a category */}
                <Route path="/products/category/:categoryId" element={<CustomerProductList />} />
                
                {/* Nested Route for Products within a subcategory */}
                <Route path="/products/category/:categoryId/subcategory/:subcategoryId" element={<CustomerProductList />} />

                {/* Subsubcategory Routes */}
                <Route path="/subcategory/category/:categoryId/subcategory/:subcategoryId" element={<SubsubcategoryPage />} />
                <Route path="/products/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId" element={<CustomerProductList />} />

                {/* Product Details Route */}
                <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
