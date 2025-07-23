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
    <div className="container mt-4">
      <h2 className="mb-4">Upcoming Meals (Sorted by Likes)</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add Upcoming Meal
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : upcomingMeals.length === 0 ? (
        <p>No upcoming meals found</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Distributor</th>
              <th>Likes</th>
              <th>Publish Date</th>
              <th>Publish</th>
            </tr>
          </thead>
          <tbody>
            {upcomingMeals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.title}</td>
                <td>{meal.category}</td>
                <td>{meal.description}</td>
                <td>{meal.distributorName}</td>
                <td>{meal.likes || 0}</td>
                <td>{new Date(meal.publishDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
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
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog"
            style={{
              maxWidth: 600,
              margin: "3rem auto",
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h4>Add Upcoming Meal</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <input
                type="text"
                name="ingredients"
                placeholder="Ingredients (comma separated)"
                value={formData.ingredients}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="form-control mb-2"
                step="0.01"
                min="0"
              />
              <input
                type="date"
                name="publishDate"
                placeholder="Publish Date"
                value={formData.publishDate}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <input
                type="text"
                name="distributorName"
                placeholder="Distributor Name"
                value={formData.distributorName}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={adding}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
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
