import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data); // Assuming response.data is an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search query change and navigation
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      navigate(`/product?search=${query}`);
    } else {
      navigate(`/`); // Navigate to home if search query is cleared
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }
    navigate(`/product?search=${searchQuery}`); // Redirect to product list with search query
  };

  return (
    <header className="header">
      <div className="logo">Your Logo</div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className="user-actions">
        <Link to="/login" className="login-btn">Login/Register</Link>
        <Link to="/cart" className="cart-btn">🛒</Link>
      </div>
    </header>
  );
};

export default Header;
