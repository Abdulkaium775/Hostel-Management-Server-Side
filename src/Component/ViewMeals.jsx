import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';



const ViewMeals = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data } = await axiosInstance.get(`/meals/${id}`);
        setMeal(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meal');
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) return <p>Loading meal details...</p>;
  if (error) return <p>{error}</p>;
  if (!meal) return <p>Meal not found</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>{meal.title}</h1>
      <img src={meal.image} alt={meal.title} style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
      <p><strong>Category:</strong> {meal.category}</p>
      <p><strong>Ingredients:</strong> {meal.ingredients}</p>
      <p><strong>Description:</strong> {meal.description}</p>
      <p><strong>Distributor:</strong> {meal.distributorName}</p>
      <p><strong>Price:</strong> ${meal.price.toFixed(2)}</p>
      <p><strong>Post Time:</strong> {new Date(meal.postTime).toLocaleString()}</p>
      <p><strong>Likes:</strong> {meal.likes}</p>
      <p><strong>Reviews Count:</strong> {meal.reviewCount}</p>
      <p><strong>Rating:</strong> {meal.rating.toFixed(1)}</p>
      {/* You can add buttons here for like, review, etc. */}
    </div>
  );
};

export default ViewMeals;
