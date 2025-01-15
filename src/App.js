import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import TopCategories from './TopCategories';
import NewArrivalProductList from './NewArrivals';
import CustomerProductList from './CustomerProductList';
import CustomerSearchProductList from './CustomerSearchProductList';
import SubsubcategoryPage from './SubsubcategoryPage';
import SubcategoryPage from './SubcategoryPage';
import ProductDetails from './ProductDetails';
import ProductFilter from './AdminPanelCategory';
import AllNewArrivals from './NewArrivalsAll';
import ProductDisplay from './CategoryProducts';
import CategoryWithSubcategories from './CategoryWithSubcategories';
import SubcategoryWithSubcategories from './subcategoryselected';
// import Breadcrumb from './Breadcrumb';
import MostSellingProductList from './MostSelling';
import './App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <Navbar />
            {/* <Breadcrumb />   */}
            <Routes>
                {/* Homepage Route: Only TopCategories on the homepage */}
                <Route
                    path="/"
                    element={
                        <>
                             
                            <TopCategories />
                            <MostSellingProductList/>
                            <ProductFilter />
                            <NewArrivalProductList /> {/* New Arrivals rendered below Top Categories */}
                            <ProductDisplay/>
                            <CategoryWithSubcategories/>
                            <SubcategoryWithSubcategories/>
                        </>
                    }
                />
                <Route path="/subsubcategories/:subcategoryId" element={<SubsubcategoryPage />} />
                <Route path="/products/subcategory/:subcategoryId" element={<CustomerProductList />} />
                <Route path="/product/productId/category/:categoryId/subcategory/:subcategoryId" element={<ProductDetails />} />
                <Route path="/product" element={<CustomerSearchProductList />} />

                <Route path="/new-arrivals" element={<AllNewArrivals />} />
                <Route path="/cutomer-products" element={<ProductFilter />} />

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
// import React from 'react'; 
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './Navbar';
// import Header from './Header';
// import TopCategories from './TopCategories';
// import NewArrivalProductList from './NewArrivals';
// import CustomerProductList from './CustomerProductList';
// import CustomerSearchProductList from './CustomerSearchProductList';
// import SubsubcategoryPage from './SubsubcategoryPage';
// import SubcategoryPage from './SubcategoryPage';
// import ProductDetails from './ProductDetails';
// import ProductFilter from './AdminPanelCategory';
// import AllNewArrivals from './NewArrivalsAll';
// import ProductDisplay from './CategoryProducts';
// import './App.css';

// const App = () => {
//     return (
//         <Router>
//             <Header />
//             <Navbar />
//             <Routes>
//                 {/* Homepage Route: Only TopCategories on the homepage */}
//                 <Route
//                     path="/"
//                     element={
//                         <>
//                             <TopCategories />
//                             <NewArrivalProductList /> {/* New Arrivals rendered below Top Categories */}
//                             <ProductFilter />
//                             <ProductDisplay />
//                         </>
//                     }
//                 />
//                 <Route path="/product" element={<CustomerSearchProductList />} />

//                 <Route path="/new-arrivals" element={<AllNewArrivals />} />
//                 <Route path="/cutomer-products" element={<ProductFilter />} />

//                 {/* Category and Subcategory Routes */}
//                 <Route path="/category/:categoryName" element={<SubcategoryPage />} /> {/* Updated to use category name */}
                
//                 {/* Route for Products within a category */}
//                 <Route path="/products/category/:categoryName" element={<CustomerProductList />} />
                
//                 {/* Nested Route for Products within a subcategory */}
//                 <Route path="/products/category/:categoryName/subcategory/:subcategoryName" element={<CustomerProductList />} />

//                 {/* Subsubcategory Routes */}
//                 <Route path="/subcategory/category/:categoryName/subcategory/:subcategoryName" element={<SubsubcategoryPage />} />
//                 <Route path="/products/category/:categoryName/subcategory/:subcategoryName/subsubcategory/:subsubcategoryName" element={<CustomerProductList />} />

//                 {/* Product Details Route */}
//                 <Route path="/product/:id" element={<ProductDetails />} /> {/* Assuming product name is used here as well */}
//             </Routes>
//         </Router>
//     );
// };

// export default App;

