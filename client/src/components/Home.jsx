import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, SearchIcon, LocationMarkerIcon, GlobeIcon, ViewListIcon, CameraIcon } from "@heroicons/react/solid";

const Home = () => {
  const [search, setSearch] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(100);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const themeClasses = theme === "dark" ? "bg-teal-900 text-white" : "bg-teal-100 text-gray-900";
  const buttonClasses = theme === "dark" ? "bg-teal-700 text-white hover:bg-teal-800" : "bg-teal-500 text-white hover:bg-teal-600";

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/restaurants?query=${search.trim()}`);
    } else {
      navigate("/restaurants");
    }
  };

  const handleLocationSearch = () => {
    if (latitude && longitude) {
      navigate(`/restaurants/location?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    }
  };

  const handleGeoLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          navigate(`/restaurants/location?lat=${latitude}&lng=${longitude}&radius=${radius}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please grant location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleImageSearch = () => {
    navigate("/restaurants/imgsearch");
  };

  const handleViewAll = () => {
    setSearch("");
    navigate("/restaurants");
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 transition-colors duration-300 ${themeClasses}`}>
      <button onClick={toggleTheme} className="fixed top-4 right-4 p-2 rounded-full bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300">
        {theme === "light" ? <MoonIcon className="h-6 w-6 text-purple-500" /> : <SunIcon className="h-6 w-6 text-yellow-500" />}
      </button>

      <motion.h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Discover Delicious Dining Spots 🍽️
      </motion.h1>

      <motion.div className="flex flex-wrap gap-4 justify-center mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className={`flex flex-col rounded-2xl shadow-lg overflow-hidden p-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
          <div className={`flex rounded-2xl shadow-lg overflow-hidden p-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
            <input type="text" placeholder="Search by Name or ID..." className={`w-full border-none focus:ring-0 focus:outline-none px-3 bg-transparent ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"}`} value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button className={`${buttonClasses} px-4 py-2 rounded-xl transition duration-300 ease-in-out cursor-pointer`} onClick={handleSearch}>
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className={`flex flex-col rounded-2xl shadow-lg overflow-hidden p-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
          <div className="flex items-center mb-2">
            <LocationMarkerIcon className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
            <input type="text" placeholder="Enter Latitude..." className={`w-full border-none focus:ring-0 focus:outline-none px-3 bg-transparent ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"}`} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div className="flex items-center mb-2">
            <LocationMarkerIcon className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
            <input type="text" placeholder="Enter Longitude..." className={`w-full border-none focus:ring-0 focus:outline-none px-3 bg-transparent ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"}`} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
          <div className="flex items-center mb-2">
            <GlobeIcon className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
            <input type="number" placeholder="Enter Radius in km..." className={`w-full border-none focus:ring-0 focus:outline-none px-3 bg-transparent ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"}`} value={radius} onChange={(e) => setRadius(e.target.value)} />
          </div>
          <button className={`${buttonClasses} px-4 py-2 rounded-xl transition duration-300 ease-in-out cursor-pointer flex items-center justify-center`} onClick={handleLocationSearch}>
            <SearchIcon className="h-5 w-5 mr-2" />
            Search Nearby
          </button>
        </div>

        {/* Image Upload for Searching */}
        <div className={`flex flex-col rounded-2xl shadow-lg overflow-hidden p-5 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
          <button className={`mt-4 ${buttonClasses} px-4 py-2 rounded-xl transition duration-300 ease-in-out cursor-pointer flex items-center justify-center`} onClick={handleImageSearch}>
            <CameraIcon className="h-5 w-5 mr-2" />
            Search by Image
          </button>
        </div>
      </motion.div>

      <div className="mt-6 flex gap-4">
        <button className={`${buttonClasses} px-6 py-3 rounded-xl transition duration-300 ease-in-out cursor-pointer flex items-center justify-center`} onClick={handleViewAll}>
          <ViewListIcon className="h-5 w-5 mr-2" />
          View All Restaurants
        </button>
      </div>
    </div>
  );
};

export default Home;
