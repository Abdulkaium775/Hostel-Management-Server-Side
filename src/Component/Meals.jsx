import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Api/axios";

const categories = ["All", "Breakfast", "Lunch", "Dinner"];

const gradients = [
  "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
  "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
  "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500",
  "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500",
  "bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500",
];

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  const fetchMeals = async (pageNum = 1, replace = false) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/meals", {
        params: {
          search: search.trim() || undefined,
          category: category !== "All" ? category : undefined,
          minPrice: minPrice !== "" ? minPrice : undefined,
          maxPrice: maxPrice !== "" ? maxPrice : undefined,
          page: pageNum,
          limit: 6,
        },
      });

      if (replace) {
        setMeals(data.meals);
      } else {
        setMeals((prev) => [...prev, ...data.meals]);
      }

      setHasMore(data.meals.length === 6);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, minPrice, maxPrice]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMeals(page + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-grow min-w-[160px] max-w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered border-gray-300 rounded-md px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input input-bordered w-24 sm:w-28 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input input-bordered w-24 sm:w-28 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Meal Cards with Infinite Scroll */}
      <InfiniteScroll
        dataLength={meals.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <h4 className="text-center text-gray-500 mt-6">Loading more meals...</h4>
        }
        endMessage={
          <p className="text-center mt-6 text-gray-400 font-medium">
            No more meals to load.
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal, index) => {
            const gradientClass = gradients[index % gradients.length];
            return (
              <div
                key={meal._id}
                className={`${gradientClass} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col`}
                style={{ minHeight: "420px" }}
              >
                <img
                  src={meal.image || "https://via.placeholder.com/400x240?text=No+Image"}
                  alt={meal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow text-white">
                  <h2 className="text-xl font-semibold truncate">{meal.title}</h2>
                  <p className="text-sm font-medium mt-1">{meal.category}</p>
                  <p className="mt-3 text-sm line-clamp-3">{meal.description}</p>
                  <p className="text-lg font-semibold mt-4">
                    ${meal.price != null ? meal.price.toFixed(2) : "0.00"}
                  </p>
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="mt-auto bg-white bg-opacity-20 hover:bg-opacity-40 text-black py-2 rounded-md transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Meals;
