import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import {  useAuth } from "./context/AuthContext";


import HomePage from "./features/home/pages/HomePage";

// Product routes
import ProductListPage from "./features/products/pages/ProductListPage";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";
import AddProductPage from "./features/products/pages/AddProductPage";
import EditProductPage from "./features/products/pages/EditProductPage";
import AddGarageProductPage from "./features/products/pages/AddGarageProductPage";

// Review routes
import ReviewListPage from "./features/reviews/pages/ReviewListPage";
import AddReviewPage from "./features/reviews/pages/AddReviewPage";

// Other feature routes
import OrdersPage from "./features/orders/pages/OrdersPage";
import MessagesPage from "./features/messages/pages/MessagesPage";
import BonusPage from "./features/bonus/pages/BonusPage";
import CouponPage from "./features/bonus/pages/CouponPage";
import CardDetailsPage from "./features/card-details/pages/CardDetailsPage";
import CustomersPage from "./features/customers/pages/CustomersPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import LoginPage from "./features/auth/pages/LoginPage";
import { AuthProvider } from "./context/AuthProvider";
import { ProductProvider } from "./context/ProductProvider";
import HomeLayout from "./features/home/components/HomeLayout";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Product routes
      {
        path: "products/list",
        element: <ProductListPage />,
      },
      {
        path: "products/detail/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "products/edit/:id",
        element: <EditProductPage />,
      },
      {
        path: "products/add",
        element: <AddProductPage />,
      },
      {
        path: "products/add-garage",
        element: <AddGarageProductPage />,
      },
      // Review routes
      {
        path: "reviews/list",
        element: <ReviewListPage />,
      },
      {
        path: "reviews/add",
        element: <AddReviewPage />,
      },
      // Other feature routes
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "messages",
        element: <MessagesPage />,
      },
      {
        path: "bonus",
        element: <BonusPage />,
      },
      {
        path: "bonus/coupon",
        element: <CouponPage />,
      },
      {
        path: "card-details",
        element: <CardDetailsPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
