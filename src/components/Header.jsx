import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, User } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Home";
    
    const breadcrumbMap = {
      "products": "Products",
      "list": "Product List",
      "add": "Add Product",
      "add-garage": "Add Garage Product",
      "reviews": "Reviews",
      "orders": "Orders",
      "messages": "Messages",
      "bonus": "Bonus",
      "coupon": "Coupon",
      "card-details": "Card Details",
      "customers": "Customers",
      "profile": "Profile",
      "notifications": "Notifications"
    };

    const breadcrumbs = segments.map(segment => breadcrumbMap[segment] || segment);
    return breadcrumbs.join(" / ");
  };

  return (
    <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-6 ">
      {/* Breadcrumb */}
      <div className="text-gray-600 font-medium">
        {getBreadcrumb()}
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/notifications"
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
        </Link>
        <Link
          to="/profile"
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};

export default Header; 