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

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/upcoming-meals');
      if (Array.isArray(res.data)) {
        setMeals(res.data.sort((a, b) => (b.likes || 0) - (a.likes || 0)));
      } else {
        Swal.fire('Error', 'Unexpected data from server', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch meals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key]) {
        Swal.fire('Missing Field', `Please fill in ${key}`, 'error');
        return;
      }
    }
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      Swal.fire('Invalid Price', 'Price must be positive', 'error');
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
        Swal.fire({ icon: 'success', title: 'Meal added', timer: 1500, showConfirmButton: false });
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
        Swal.fire('Failed', 'Could not add meal', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Server Error', 'Could not add meal', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handlePublish = async (mealId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to publish this meal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, publish it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setPublishingId(mealId);
      const res = await axiosInstance.post('/upcoming-meals/publish', {
        mealId: mealId,
        addedByEmail: 'admin@example.com',
      });

      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'Published!', timer: 1500, showConfirmButton: false });
        fetchMeals();
      } else {
        Swal.fire('Failed', res.data.message || 'Could not publish meal', 'error');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Server error';
      Swal.fire('Failed', msg, 'error');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-neutral-100 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-darkText">Upcoming Meals Admin</h1>

      {/* Filled button: Add Upcoming Meal */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-5 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition"
      >
        + Add Upcoming Meal
      </button>

      {/* Meals Table */}
      {loading ? (
        <p className="text-darkText">Loading...</p>
      ) : meals.length === 0 ? (
        <p className="text-darkText">No upcoming meals found</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-secondary/20">
              <tr>
                {['Title', 'Category', 'Likes', 'Publish Date', 'Distributor', 'Actions'].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-darkText font-medium uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meals.map((meal) => (
                <tr key={meal._id} className="hover:bg-secondary/10 transition">
                  <td className="px-4 py-2 font-medium text-darkText">{meal.title}</td>
                  <td className="px-4 py-2 text-darkText">{meal.category}</td>
                  <td className="px-4 py-2 text-center text-darkText font-semibold">{meal.likes || 0}</td>
                  <td className="px-4 py-2 text-darkText">{new Date(meal.publishDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-darkText">{meal.distributorName}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      disabled={publishingId === meal._id}
                      onClick={() => handlePublish(meal._id)}
                      className={`px-3 py-1 rounded-md text-white font-semibold ${
                        publishingId === meal._id ? 'bg-gray-400' : 'bg-primary hover:bg-indigo-700'
                      } transition`}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-neutral-100 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-darkText">Add Upcoming Meal</h2>
            <form onSubmit={handleAddMeal} className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block mb-1 text-darkText capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  {key === 'description' || key === 'ingredients' ? (
                    <textarea
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                      required
                    />
                  ) : (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      type={key === 'price' ? 'number' : key === 'publishDate' ? 'date' : 'text'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                {/* Outline button: Cancel */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-darkText text-darkText font-semibold rounded-md hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>

                {/* Filled button: Add Meal */}
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-indigo-700 transition"
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
