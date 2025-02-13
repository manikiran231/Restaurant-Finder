import React, { useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

const ImageSearch = () => {
  const [image, setImage] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const themeClasses = theme === "dark" ? "bg-teal-900 text-white" : "bg-teal-100 text-gray-900";
  const inputClasses = theme === "dark" ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500" : "bg-gray-200 text-gray-900 border-gray-300 placeholder-gray-500";
  const buttonClasses = theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600";

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError(null);
    } else {
      setError("Please upload a valid image.");
      setImage(null);
    }
  };

  const fetchRestaurants = async () => {
    if (!image) {
      setError("No image selected. Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "https://restaurant-production-06c2.up.railway.app/restaurants/imgsearch",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to fetch data from the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 transition-colors duration-300 ${themeClasses}`}>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300"
      >
        {theme === "light" ? <MoonIcon className="h-6 w-6 text-purple-500" /> : <SunIcon className="h-6 w-6 text-yellow-500" />}
      </button>

      <h2 className="text-center text-3xl font-semibold mb-5">Search Restaurants by Image</h2>

      <div className="flex flex-col sm:flex-row justify-center items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-auto ${inputClasses}`}
        />
        <button
          onClick={fetchRestaurants}
          disabled={loading}
          className={`p-3 rounded-lg transition duration-200 w-full sm:w-auto ${buttonClasses}`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded-lg text-center bg-gray-800 shadow-lg hover:shadow-xl transition duration-200">
              <img
                src={restaurant.featured_image || "https://via.placeholder.com/150"}
                alt={restaurant.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p><strong>City:</strong> {restaurant.location.city || "N/A"}</p>
              <p><strong>Locality:</strong> {restaurant.location.locality_verbose || "N/A"}</p>
              <p><strong>Address:</strong> {restaurant.location.address || "N/A"}</p>
              <p><strong>Zipcode:</strong> {restaurant.location.zipcode || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No restaurants found. Try uploading another image.</p>
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
