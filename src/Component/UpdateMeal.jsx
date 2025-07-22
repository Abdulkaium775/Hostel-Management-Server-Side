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
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 text-lg">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
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
              className="mb-2 font-medium text-gray-700 hover:text-blue-600 transition"
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
                className="rounded-md border border-gray-300 px-4 py-3 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            ) : (
              <input
                id={name}
                name={name}
                type={type || 'text'}
                value={mealData[name]}
                onChange={handleChange}
                required
                className="rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        >
          Update Meal
        </button>
      </form>
    </div>
  );
};

export default UpdateMeal;
