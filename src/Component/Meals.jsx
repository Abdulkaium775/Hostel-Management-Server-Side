import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Api/axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const categories = ["All", "Breakfast", "Lunch", "Dinner"];

const gradients = [
  "bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5]/80",
  "bg-gradient-to-r from-[#06B6D4] via-[#4F46E5] to-[#06B6D4]/80",
  "bg-gradient-to-r from-[#4F46E5]/80 via-[#06B6D4]/80 to-[#4F46E5]/80",
  "bg-gradient-to-r from-[#06B6D4]/70 via-[#4F46E5]/80 to-[#06B6D4]/70",
  "bg-gradient-to-r from-[#4F46E5]/70 via-[#06B6D4]/70 to-[#4F46E5]/70",
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
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const fetchMeals = async (pageNum = 1, replace = false, userToken = token) => {
    if (!userToken) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/meals", {
        params: {
          search: search.trim() || undefined,
          category: category !== "All" ? category : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page: pageNum,
          limit: 6,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setMeals(replace ? data.meals : (prev) => [...prev, ...data.meals]);
      setHasMore(data.meals.length === 6);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userToken = await user.getIdToken();
        setToken(userToken);
        fetchMeals(1, true, userToken);
      } else {
        setToken(null);
        setMeals([]);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, minPrice, maxPrice]);

  const loadMore = () => {
    if (!loading && hasMore) fetchMeals(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-[#F8FAFC] p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow min-w-[160px] max-w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-[120px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
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
          className="w-24 sm:w-28 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24 sm:w-28 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        />
      </div>

      {/* Meals Grid */}
      <InfiniteScroll
        dataLength={meals.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 className="text-center text-gray-500 mt-6">Loading more meals...</h4>}
        endMessage={
          <p className="text-center mt-6 text-gray-400 font-medium">No more meals to load.</p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal, index) => {
            const gradientClass = gradients[index % gradients.length];
            return (
              <div
                key={meal._id}
                className={`${gradientClass} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col`}
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
                    className="mt-auto bg-[#4F46E5] hover:bg-[#06B6D4] text-white py-2 rounded-md transition-colors duration-300"
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
