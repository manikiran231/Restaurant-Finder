import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    if (searchQuery !== searchTerm) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        let url = `https://restaurant-finder123.onrender.com/api/restaurants?page=${page}&limit=20`;
        if (searchTerm) {
          url += `&search=${searchTerm}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        setRestaurants(data.restaurants || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, searchTerm]);

  const filteredRestaurants = useMemo(() => {
    if (!searchTerm) return restaurants;
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisines.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [restaurants, searchTerm]);

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    if (rating >= 2) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    navigate({ search: params.toString() });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-teal-100 text-gray-900">
      <motion.h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Restaurants Available Now 🍽️
      </motion.h1>

      <div className="mb-6 flex items-center w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
        <input
          type="text"
          placeholder="Search by name or cuisine..."
          className="w-full px-4 py-3 border-none focus:ring-0 focus:outline-none text-gray-900"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="px-4 bg-teal-500 text-white hover:bg-teal-600 transition">
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <motion.div key={restaurant.id || restaurant.name} className="max-w-xs w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <img 
                    src={restaurant.featured_image || restaurant.thumb || "https://placekitten.com/300/200"} 
                    alt={restaurant.name} 
                    className="w-full h-60 object-cover rounded-t-2xl"
                  />
                  <div className="p-5">
                    <h2 className="text-2xl font-bold text-blue-600 truncate">{restaurant.name || "Unnamed Restaurant"}</h2>
                    <p className="mt-1 text-gray-600 truncate">{restaurant.location?.city || "Unknown City"}</p>
                    <p className="mt-2 text-lg text-gray-700">Avg Cost: Rs. {restaurant.average_cost_for_two || "N/A"}</p>

                    <div className="flex items-center mt-4">
                      <span className={`px-4 py-1 text-white text-sm rounded-full ${getRatingColor(restaurant.user_rating?.aggregate_rating)}`}>
                        ⭐ {restaurant.user_rating?.aggregate_rating || "N/A"}
                      </span>
                      <span className="ml-2 text-gray-500">({restaurant.user_rating?.votes || 0} votes)</span>
                    </div>

                    <Link to={`/restaurant/${restaurant.id}`} className="block mt-4 text-center py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
                      More Details →
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center col-span-full text-lg text-gray-400">OOPS...No restaurants found.</p>
            )}
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center">
              <ChevronLeftIcon className="h-5 w-5 mr-2" /> Previous
            </button>
            <span className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center">
              Next <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantsList;
