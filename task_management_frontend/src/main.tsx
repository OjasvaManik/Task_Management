import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from "@/pages/auth/Register.tsx";
import Home from "@/pages/home/Home.tsx";
import Login from "@/pages/auth/Login.tsx";
import {AuthProvider} from "@/context/AuthContext.tsx";
import UserProfile from "@/pages/profile/UserProfile.tsx";
import OrganisationProfile from "@/pages/profile/OrganisationProfile.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/home',
                element: <Home />,
                children: [
                    {
                        index: true,
                        element: <UserProfile />
                    },
                    {
                        path: 'user',
                        element: <UserProfile />
                    },
                    {
                        path: 'organisation',
                        element: <OrganisationProfile />
                    },
                ]
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/login',
                element: <Login />
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
  </StrictMode>,
)
