
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// Debounce hook to limit API calls while typing search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PAGE_LIMIT = 10;

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // Fetch meals with filters and pagination
  const fetchMeals = async (pageToFetch = 1, reset = false) => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      console.warn("Min price should not be greater than max price");
      setHasMore(false);
      return;
    }

    setLoading(true);

    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    params.append("page", pageToFetch);
    params.append("limit", PAGE_LIMIT);

    try {
      const res = await fetch(`/api/meals?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch meals");

      const data = await res.json();
      const newMeals = data.meals || [];

      if (reset) {
        setMeals(newMeals);
      } else {
        setMeals((prev) => [...prev, ...newMeals]);
      }

      setHasMore(newMeals.length === PAGE_LIMIT);
      setPage(pageToFetch);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load meals on filters/search change (reset to page 1)
  useEffect(() => {
    fetchMeals(1, true);
  }, [debouncedSearch, category, minPrice, maxPrice]);

  // Handlers
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  // Load more meals on scroll
  const fetchMoreData = () => {
    if (!hasMore || loading) return;
    fetchMeals(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center md:text-left">
        Explore Our Meals
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={handleSearchChange}
          className="border border-indigo-300 rounded-lg px-4 py-3 flex-grow min-w-[200px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Search meals"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border border-indigo-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="border border-indigo-300 rounded-lg px-4 py-3 w-[120px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Minimum price filter"
        />

        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="border border-indigo-300 rounded-lg px-4 py-3 w-[120px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Maximum price filter"
        />
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={meals.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <h4 className="text-center text-indigo-600 font-medium">
            Loading more meals...
          </h4>
        }
        endMessage={
          meals.length > 0 ? (
            <p className="text-center mt-8 text-gray-500 font-semibold">
              You have reached the end.
            </p>
          ) : (
            <p className="text-center mt-8 text-gray-500 font-semibold">
              No meals found.
            </p>
          )
        }
        scrollThreshold={0.9}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <div
              key={meal._id || meal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={meal.image || "/default-meal.jpg"}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-indigo-900 mb-1 truncate">
                  {meal.name}
                </h3>
                <p className="text-sm text-gray-600 capitalize mb-3">
                  {meal.category}
                </p>
                <p className="mt-auto text-xl font-bold text-indigo-700">
                  ${meal.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {/* Initial loading message */}
      {loading && meals.length === 0 && (
        <p className="text-center mt-12 text-indigo-600 font-semibold text-lg">
          Loading meals...
        </p>
      )}
    </div>
  );
};

export default Meals;
