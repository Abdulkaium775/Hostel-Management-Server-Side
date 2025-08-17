import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';
import Swal from 'sweetalert2';

const UpdateMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [mealData, setMealData] = useState({
    title: '',
    category: '',
    image: '',
    ingredients: '',
    description: '',
    price: '',
    postTime: '',
    distributorName: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMealData({
          title: data.title || '',
          category: data.category || '',
          image: data.image || '',
          ingredients: data.ingredients || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          postTime: formatDateForInput(data.postTime) || '',
          distributorName: data.distributorName || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load meal data');
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      return Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You must be logged in as admin to update this meal.',
      });
    }

    try {
      await axiosInstance.put(`/meals/${id}`, {
        ...mealData,
        price: parseFloat(mealData.price),
        postTime: new Date(mealData.postTime).toISOString(),
        addedByEmail: user.email,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Meal updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4F46E5', // Primary
      }).then(() => {
        navigate('/dashboard/all-meals');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'An error occurred.',
      });
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#F8FAFC] rounded-xl shadow-lg mt-12">
      <h2 className="text-3xl font-semibold mb-8 text-center text-[#1E293B]">
        Update Meal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { label: 'Title', name: 'title' },
          { label: 'Category', name: 'category' },
          { label: 'Image URL', name: 'image' },
          { label: 'Ingredients', name: 'ingredients', isTextarea: true },
          { label: 'Description', name: 'description', isTextarea: true },
          { label: 'Price', name: 'price', type: 'number' },
          { label: 'Post Time', name: 'postTime', type: 'datetime-local' },
          { label: 'Distributor Name', name: 'distributorName' },
        ].map(({ label, name, isTextarea, type }) => (
          <div key={name} className="flex flex-col">
            <label
              htmlFor={name}
              className="mb-2 font-medium text-[#1E293B]"
            >
              {label}
            </label>
            {isTextarea ? (
              <textarea
                id={name}
                name={name}
                value={mealData[name]}
                onChange={handleChange}
                required
                rows={4}
                className="rounded-md border border-gray-300 px-4 py-3 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            ) : (
              <input
                id={name}
                name={name}
                type={type || 'text'}
                value={mealData[name]}
                onChange={handleChange}
                required
                className="rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Filled Primary */}
          <button
            type="submit"
            className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Update Meal
          </button>

          {/* Outlined Secondary */}
          <button
            type="button"
            onClick={() => navigate('/dashboard/all-meals')}
            className="flex-1 border-2 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4]/10 font-semibold py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMeal;
