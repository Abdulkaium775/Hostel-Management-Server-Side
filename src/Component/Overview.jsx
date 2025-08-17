import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axiosInstance from "../Api/axios";

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeals: 0,
    totalRequests: 0,
    totalReviews: 0,
    mealLikes: [],
    monthlyRequests: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/overview-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-lg font-medium text-[#1E293B]">
        Loading overview stats...
      </p>
    );
  }

  const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444"];
  const pieData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Meals", value: stats.totalMeals },
    { name: "Requests", value: stats.totalRequests },
    { name: "Reviews", value: stats.totalReviews },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-[#1E293B]">Dashboard Overview</h1>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, color: "#4F46E5" },
          { label: "Total Meals", value: stats.totalMeals, color: "#06B6D4" },
          { label: "Meal Requests", value: stats.totalRequests, color: "#F59E0B" },
          { label: "Reviews", value: stats.totalReviews, color: "#EF4444" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-sm font-semibold text-[#1E293B]">{card.label}</h2>
            <p className="text-xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1E293B]">Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Meals by Likes Bar Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1E293B]">Top Meals by Likes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.mealLikes} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="title" tick={{ fill: "#1E293B", fontSize: 10 }} />
            <YAxis tick={{ fill: "#1E293B", fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "10px" }} />
            <Legend />
            <Bar dataKey="likes" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Meal Requests Line Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1E293B]">Monthly Meal Requests</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={stats.monthlyRequests}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fill: "#1E293B", fontSize: 10 }} />
            <YAxis tick={{ fill: "#1E293B", fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "10px" }} />
            <Legend />
            <Line type="monotone" dataKey="requests" stroke="#06B6D4" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
