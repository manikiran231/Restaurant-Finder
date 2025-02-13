import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(`https://restaurant-finder123.onrender.com/api/restaurants/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details");
        }
        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  if (loading) return <div className="text-center text-xl text-teal-500">Loading...<strong>Please Wait...</strong></div>;
  if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-teal-100 to-purple-200 text-gray-900 rounded-2xl shadow-2xl max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <motion.img
            src={restaurant.featured_image || "https://via.placeholder.com/600"}
            alt={restaurant.name}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-xl text-lg font-semibold">
            ⭐ {restaurant.user_rating?.aggregate_rating || "N/A"}
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold mb-3 text-teal-600">{restaurant.name}</h1>
          <p className="text-lg italic text-gray-700">{restaurant.location?.locality || "Location not available"}</p>
          <div className="mt-4 space-y-3 text-gray-800">
            <p><b>Cuisine:</b> {restaurant.cuisines || "N/A"}</p>
            <p><b>Address:</b> {restaurant.location?.address || "N/A"}</p>
            <p><b>Cost for Two:</b> ₹{restaurant.average_cost_for_two || "N/A"}</p>
            <p><b>Phone:</b> {restaurant.phone_numbers || "Not available"}</p>
          </div>
          
          {showMore && (
            <div className="mt-4 space-y-3 text-gray-800">
              <p><b>Rating Text:</b> {restaurant.user_rating?.rating_text || "N/A"}</p>
              <p><b>Reviews:</b> {restaurant.user_rating?.votes || "N/A"}</p>
              <p><b>Timings:</b> {restaurant.timings || "N/A"}</p>
              <p><b>Speciality:</b> {restaurant.speciality || "N/A"}</p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setShowMore(!showMore)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
            
            {restaurant.url && (
              <a
                href={restaurant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>

      {restaurant.menu_url && (
        <div className="mt-10 p-6 bg-white text-gray-900 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-center">Menu</h2>
          <a
            href={restaurant.menu_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-teal-600 hover:underline text-lg"
          >
            🍽 Click to view menu
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default RestaurantDetails;
