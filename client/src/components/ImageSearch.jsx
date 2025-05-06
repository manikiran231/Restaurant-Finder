import { useState } from "react";

const ImageSearch = () => {
  const [image, setImage] = useState(null);
  const [cuisine, setCuisine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setError(null);
    } else {
      setError("Please upload a valid image file.");
      setImage(null);
    }
  };

  // Function to detect cuisine
  const detectCuisine = async () => {
    if (!image) {
      setError("No image selected. Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setCuisine(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("https://restaurant-production-06c2.up.railway.app/image/detect-cuisine", {
        method: "POST",
        body: formData,
      });
      

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.cuisine) {
        throw new Error("Cuisine detection failed. Try another image.");
      }

      setCuisine(data.cuisine);
    } catch (error) {
      console.error("Error detecting cuisine:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-screen-xl mx-auto bg-gray-900 text-white">
      <h2 className="text-center text-3xl font-semibold mb-5">Detect Cuisine from Image</h2>

      {/* File input and button */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-auto"
        />
        <button
          onClick={detectCuisine}
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
        >
          {loading ? "Detecting..." : "Detect Cuisine"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {cuisine && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold">Detected Cuisine:</h3>
          <p className="text-2xl font-bold text-green-400">{cuisine}</p>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;