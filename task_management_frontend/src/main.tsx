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
import CreateGroup from "@/pages/Group/CreateGroup.tsx";
import {AllGroups} from "@/pages/Group/AllGroups.tsx";

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
                        element: <AllGroups />
                    },
                    {
                        path: 'user',
                        element: <UserProfile />
                    },
                    {
                        path: 'organisation',
                        element: <OrganisationProfile />
                    },
                    {
                        path: 'create',
                        element: <CreateGroup />
                    },
                    {
                        path: "",
                        element: <AllGroups />
                    }
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
