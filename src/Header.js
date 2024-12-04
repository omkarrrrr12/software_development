import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      console.log("Fetched categories:", response.data);
      setCategories(response.data);  // Assuming response.data is an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setActiveSubcategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubcategory = (index) => {
    setActiveSubcategory(activeSubcategory === index ? null : index);
  };

  return (
    <header className="header">
      <div className="logo">Your Logo</div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
