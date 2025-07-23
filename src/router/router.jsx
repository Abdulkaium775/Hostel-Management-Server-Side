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
import ManageUsers from "../Component/ManageUsers";
import ViewMeals from "../Component/ViewMeals";
import { AdminProfile } from "../Component/AdminProfile";
import UpdateMeal from "../Component/UpdateMeal";
import UpcomingMealsAdminTable from "../Component/UpcomingMeals";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Meals and related public routes
      { path: "meals", element: <Meals /> },

      // MealDetails public route
      { path: "meal/:id", element: <MealDetails /> },

      // Optional: public ViewMeal route outside dashboard
      // { path: "view-meal/:id", element: <ViewMeal /> },

      { path: "upcoming-meals", element: <UpcomingMeals /> },
      { path: "join-us", element: <JoinUs /> },
      { path: "checkout/:packageName", element: <CheckoutPage /> },

      // Unauthorized page
      { path: "unauthorized", element: <Unauthorized /> },

      // Dashboard routes (protected)
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          // User-only routes
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

          // Admin-only routes
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

          // Update Meal (Admin only)
          {
            path: "meals/update/:id",
            element: (
              <AdminRoute>
                <UpdateMeal />
              </AdminRoute>
            ),
          },

          // ViewMeal inside dashboard if needed (usually public outside)
          {
            path: "view-meal/:id",
            element: (
              <AdminRoute>
                <ViewMeals />
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
                <UpcomingMealsAdminTable />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
]);
