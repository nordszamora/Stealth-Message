import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/page/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ResetRequest from "./components/reset_pass/ResetRequest";
import ResetConfirmation from "./components/reset_pass/ResetConfirmation";
import SendMessage from "./components/messages/SendMessage";
import User from "./components/protected/User";
import Notification from "./components/protected/notification/Notification";
import ReadMessage from "./components/protected/notification/ReadMessage";
import Settings from "./components/protected/settings/Settings";

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
    path: '/reset_password',
    element: <ResetRequest />
  },
  {
    path: '/reset-confirmation/:token',
    element: <ResetConfirmation />
  },
  {
    path: '/user',
    element: <User />
  },
  {
    path: '/user/notification',
    element: <Notification />
  },

  {
    path: '/user/notification/read/:key',
    element: <ReadMessage />
  },
  
  {
    path: '/user/settings',
    element: <Settings />
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