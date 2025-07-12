import {createBrowserRouter} from "react-router";
import Root from "../Root/Root";
import Home from "../Component/Home";
export const router = createBrowserRouter([
  {
    path: "/",
    Component : Root,
    children:[
        {
            index :true,
            Component:Home,
        }
    ]
  },
]);