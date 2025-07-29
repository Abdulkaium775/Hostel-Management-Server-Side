import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';

const UpcomingMealsAdmin = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [publishingId, setPublishingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    ingredients: '',
    description: '',
    price: '',
    publishDate: '',
    distributorName: '',
  });

  // Fetch meals from backend, sorted by likes descending (client-side)
  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/upcoming-meals');
      if (Array.isArray(res.data)) {
        const sortedMeals = res.data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        setMeals(sortedMeals);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Unexpected Data',
          text: 'Unexpected data format from server',
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Failed to fetch upcoming meals',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and add new meal
  const handleAddMeal = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key] === '') {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `Please fill in ${key}`,
        });
        return;
      }
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Please enter a valid positive price',
      });
      return;
    }

    if (isNaN(new Date(formData.publishDate).getTime())) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Please enter a valid publish date',
      });
      return;
    }

    try {
      setAdding(true);
      const res = await axiosInstance.post('/upcoming-meals', {
        ...formData,
        price: parseFloat(formData.price),
        publishDate: formData.publishDate,
      });
      if (res.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Upcoming meal added successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowModal(false);
        setFormData({
          title: '',
          category: '',
          image: '',
          ingredients: '',
          description: '',
          price: '',
          publishDate: '',
          distributorName: '',
        });
        fetchMeals();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to add upcoming meal',
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Server error while adding meal',
      });
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Publish meal with SweetAlert confirmation
  const handlePublish = async (mealId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to publish this meal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e', // green-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Yes, publish it!',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setPublishingId(mealId);
      await axiosInstance.post('/upcoming-meals/publish', {
        mealId,
        addedByEmail: 'admin@example.com',
      });
      await Swal.fire({
        icon: 'success',
        title: 'Published!',
        text: 'Meal published successfully',
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchMeals();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to publish meal',
      });
      console.error(err);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">Upcoming Meals Admin</h1>

      {/* Add Upcoming Meal Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-sm sm:text-base"
        aria-label="Add upcoming meal"
      >
        + Add Upcoming Meal
      </button>

      {/* Meals Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading upcoming meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming meals found.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                {['Title', 'Category', 'Likes', 'Publish Date', 'Distributor', 'Actions'].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meals.map((meal) => (
                <tr key={meal._id?.toString() || meal._id} className="hover:bg-indigo-50 transition-colors">
                  <td
                    className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-800 font-medium max-w-xs truncate"
                    title={meal.title}
                  >
                    {meal.title}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-600">{meal.category}</td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-center text-gray-700 font-semibold">{meal.likes || 0}</td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-600">
                    {new Date(meal.publishDate).toLocaleDateString()}
                  </td>
                  <td
                    className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-600 max-w-xs truncate"
                    title={meal.distributorName}
                  >
                    {meal.distributorName}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-center">
                    <button
                      disabled={publishingId === meal._id}
                      onClick={() => handlePublish(meal._id)}
                      className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-semibold rounded-md shadow-sm
                        ${
                          publishingId === meal._id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }
                        transition duration-150`}
                      aria-label={`Publish meal ${meal.title}`}
                    >
                      {publishingId === meal._id ? 'Publishing...' : 'Publish'}
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
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-upcoming-meal-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-lg sm:max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <h2 id="add-upcoming-meal-title" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Add Upcoming Meal
            </h2>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="Meal title"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  type="text"
                  placeholder="Category"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
                  Image URL
                </label>
                <input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  type="url"
                  placeholder="Image URL"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-gray-700 font-medium mb-1">
                  Ingredients
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="List of ingredients"
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="publishDate" className="block text-gray-700 font-medium mb-1">
                    Publish Date
                  </label>
                  <input
                    id="publishDate"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="distributorName" className="block text-gray-700 font-medium mb-1">
                  Distributor Name
                </label>
                <input
                  id="distributorName"
                  name="distributorName"
                  value={formData.distributorName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Distributor Name"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={adding}
                  className="px-4 sm:px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 sm:px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  {adding ? 'Adding...' : 'Add Meal'}
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
