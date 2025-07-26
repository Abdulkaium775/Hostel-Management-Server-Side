import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/axios";

const UpcomingMealsAdmin = () => {
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    ingredients: "",
    description: "",
    price: "",
    publishDate: "",
    distributorName: "",
  });

  // Fetch meals and sort by likes descending
  const fetchUpcomingMeals = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/upcoming-meals");
      const sorted = res.data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      setUpcomingMeals(sorted);
    } catch (error) {
      alert("Failed to load upcoming meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMeals();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "title",
      "category",
      "image",
      "ingredients",
      "description",
      "price",
      "publishDate",
      "distributorName",
    ];

    for (const field of required) {
      if (!formData[field]) {
        alert(`Field ${field} is required`);
        return;
      }
    }

    try {
      setAdding(true);
      await axiosInstance.post("/upcoming-meals", {
        ...formData,
        price: parseFloat(formData.price),
      });
      alert("Meal added successfully");
      setFormData({
        title: "",
        category: "",
        image: "",
        ingredients: "",
        description: "",
        price: "",
        publishDate: "",
        distributorName: "",
      });
      setShowModal(false);
      fetchUpcomingMeals();
    } catch (error) {
      alert("Failed to add meal");
    } finally {
      setAdding(false);
    }
  };

  const handlePublish = async (mealId) => {
    if (!window.confirm("Are you sure to publish this meal?")) return;
    try {
      setPublishingId(mealId);
      await axiosInstance.post("/upcoming-meals/publish", { mealId });
      alert("Meal published successfully");
      fetchUpcomingMeals();
    } catch (error) {
      alert("Failed to publish meal");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Upcoming Meals (Sorted by Likes)
      </h2>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add Upcoming Meal
      </button>

      {loading ? (
        <p className="text-center text-gray-600 text-lg py-8">Loading...</p>
      ) : upcomingMeals.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-8">No upcoming meals found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white">
          <table className="min-w-[700px] w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">Title</th>
                <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">Category</th>
                <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">Description</th>
                <th className="p-3 border text-left text-sm sm:text-base whitespace-nowrap">Distributor</th>
                <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">Likes</th>
                <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">Publish Date</th>
                <th className="p-3 border text-center text-sm sm:text-base whitespace-nowrap">Publish</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMeals.map((meal) => (
                <tr key={meal._id} className="hover:bg-gray-100 transition-colors duration-150">
                  <td className="p-3 border text-sm sm:text-base">{meal.title}</td>
                  <td className="p-3 border text-sm sm:text-base">{meal.category}</td>
                  <td className="p-3 border text-sm sm:text-base">{meal.description}</td>
                  <td className="p-3 border text-sm sm:text-base">{meal.distributorName}</td>
                  <td className="p-3 border text-center text-sm sm:text-base">{meal.likes || 0}</td>
                  <td className="p-3 border text-center text-sm sm:text-base">
                    {new Date(meal.publishDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      className={`px-4 py-1 rounded text-white text-sm sm:text-base ${
                        publishingId === meal._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => handlePublish(meal._id)}
                      disabled={publishingId === meal._id}
                    >
                      {publishingId === meal._id ? "Publishing..." : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xl font-semibold mb-4">Add Upcoming Meal</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="ingredients"
                placeholder="Ingredients (comma separated)"
                value={formData.ingredients}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="publishDate"
                placeholder="Publish Date"
                value={formData.publishDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="distributorName"
                placeholder="Distributor Name"
                value={formData.distributorName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={adding}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {adding ? "Adding..." : "Add Meal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMealsAdmin;
