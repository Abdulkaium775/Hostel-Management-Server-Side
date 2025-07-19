import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../Component/Home";
import Login from "../Component/Login";
import Register from "../Component/Register";
import UpcomingMeals from "../Component/UpcomingMeals";
import JoinUs from "../Component/JoinUs";
import Dashboard from "../Component/Dashboard";
import MyReviews from "../Component/MyReviews";
import PaymentHistory from "../Component/PaymentHistory";
import { AdminProfile } from "../Component/AdminProfile";
import ManageUsers from "../Component/ManageUsers";
import AddMeal from "../Component/AddMeal";
import AllReviews from "../Component/AllReviews";
import ServeMeals from "../Component/ServeMeals";
import Meals from "../Component/Meals";
import RequestedMeals from "../Component/RequestedMeals";
import MealDetails from "../Component/MealDetails";
import CheckoutPage from "../Component/CheckoutPage";
import MyProfile from "../Component/MyProfile";
import EditReview from "../Component/EditReview";
import AllMeals from "../Component/AllMeals";
import Unauthorized from "../Component/Unauthorized";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "meals", element: <Meals /> },
      { path: "meal/:id", element: <MealDetails /> },
      { path: "upcoming-meals", element: <UpcomingMeals /> },
      { path: "join-us", element: <JoinUs /> },
      { path: "checkout/:packageName", element: <CheckoutPage /> },

      // ❌ Unauthorized Access
      { path: "unauthorized", element: <Unauthorized /> },

      // ✅ Dashboard Routes
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          // 🔐 User-only Routes
          {
            path: "my-profile",
            element: (
              <UserRoute>
                <MyProfile />
              </UserRoute>
            ),
          },
          {
            path: "requested-meals",
            element: (
              <UserRoute>
                <RequestedMeals />
              </UserRoute>
            ),
          },
          {
            path: "my-reviews",
            element: (
              <UserRoute>
                <MyReviews />
              </UserRoute>
            ),
          },
          {
            path: "payment-history",
            element: (
              <UserRoute>
                <PaymentHistory />
              </UserRoute>
            ),
          },
          {
            path: "edit-review/:id",
            element: (
              <UserRoute>
                <EditReview />
              </UserRoute>
            ),
          },

          // 🔐 Admin-only Routes
          {
            path: "admin-profile",
            element: (
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            ),
          },
          {
            path: "manage-users",
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "add-meal",
            element: (
              <AdminRoute>
                <AddMeal />
              </AdminRoute>
            ),
          },
          {
            path: "all-meals",
            element: (
              <AdminRoute>
                <AllMeals />
              </AdminRoute>
            ),
          },
          {
            path: "all-reviews",
            element: (
              <AdminRoute>
                <AllReviews />
              </AdminRoute>
            ),
          },
          {
            path: "serve-meals",
            element: (
              <AdminRoute>
                <ServeMeals />
              </AdminRoute>
            ),
          },
          {
            path: "upcoming-meals",
            element: (
              <AdminRoute>
                <UpcomingMeals />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
]);
