import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../Component/Home";
import Login from "../Component/Login";
import Register from "../Component/Register";
import Meals from "../Component/Meals";
import UpcomingMeals from "../Component/UpcomingMeals";
import JoinUs from "../Component/JoinUs";
import Dashboard from "../Component/Dashboard";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "meals",
        element: <Meals />,
      },
      {
        path: "upcoming-meals",
        element: <UpcomingMeals />,
      },
      {
        path: "join-us",
        element: <JoinUs />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
