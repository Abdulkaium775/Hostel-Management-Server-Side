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
import AllMeals from "../Component/AllMeals";
import AllReviews from "../Component/AllReviews";
import ServeMeals from "../Component/ServeMeals";
import Meals from "../Component/Meals";
import RequestedMeals from "../Component/RequestedMeals";
import MyProfile from "../Component/MyProfile";
import MealDetails from "../Component/MealDetails";


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
      { path: "upcoming-meals", element: <UpcomingMeals/> },
      { path: "join-us", element: <JoinUs /> },

      // ✅ Dashboard Routes (Nested inside Layout)
      {
        path: "dashboard",
        element: (
         
            <Dashboard />
      
        ),
        children: [
          //  User Dashboard Routes
          { path: "my-profile", element: <MyProfile /> },
          { path: "requested-meals", element: <RequestedMeals/> },
          { path: "my-reviews", element: <MyReviews /> },
          { path: "payment-history", element: <PaymentHistory /> },

          // 🛡️ Admin Dashboard Routes
          {
            path: "admin-profile",
            element: (
       
                <AdminProfile />
          
            ),
          },
          {
            path: "manage-users",
            element: (
             
                <ManageUsers />
            
            ),
          },
          {
            path: "add-meal",
            element: (
          
                <AddMeal />
  
            ),
          },
          {
            path: "all-meals",
            element: (
      
                <AllMeals />
        
            ),
          },
          {
            path: "all-reviews",
            element: (
           
                <AllReviews />
          
            ),
          },
          {
            path: "serve-meals",
            element: (
             
                <ServeMeals />
       
            ),
          },
          {
            path: "upcoming-meals",
            element: (
              
                <UpcomingMeals />
            
            ),
          },
        ],
      },
    ],
  },
]);
