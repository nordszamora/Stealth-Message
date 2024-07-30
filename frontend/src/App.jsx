import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/page/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import SendMessage from "./components/messages/SendMessage";
import User from "./components/protected/User";
import Notification from "./components/protected/notification/Notification";
import ReadMessage from "./components/protected/notification/ReadMessage";
import Settings from "./components/protected/settings/Settings";
import ChangeName from "./components/protected/settings/ChangeName";
import ChangeUsername from "./components/protected/settings/ChangeUsername";
import ChangePassword from "./components/protected/settings/ChangePassword";
import DeleteAccount from "./components/protected/settings/DeleteAccount";
import IsAuthenticated from "./components/context/IsAuthenticatedContext";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signup',
    element: <Register />
  },
  {
    path: '/signin',
    element: <Login />
  },
  {
    path: '/user',
    element: <IsAuthenticated><User /></IsAuthenticated>
  },
  {
    path: '/user/notification',
    element: <IsAuthenticated><Notification /></IsAuthenticated>
  },
  {
    path: '/user/notification/read/:key',
    element: <IsAuthenticated><ReadMessage /></IsAuthenticated>
  },
  {
    path: '/user/settings',
    element: <IsAuthenticated><Settings /></IsAuthenticated>,
    children: [
      {
        path: 'change_name',
        element: <ChangeName />
      },
      {
        path: 'change_username',
        element: <ChangeUsername />
      },
      {
        path: 'change_password',
        element: <ChangePassword />
      },
      {
        path: 'delete_account',
        element: <DeleteAccount />
      }
    ]
  },
  {
    path: '/secret/:secret',
    element: <SendMessage />
  },
  {
    path: '*',
    element: <h1 style={{color: 'white', textAlign: 'center'}} className="mt-2">Not Found</h1>
  }
]);

function App(){
  return <RouterProvider router={router} />
}

export default App;