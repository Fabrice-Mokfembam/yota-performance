import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  List,
  Plus,
  Star,
  ShoppingCart,
  MessageCircle,
  Gift,
  CreditCard,
  Users,
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    products: true,
    reviews: true,
    bonus: true
  });

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isInSection = (section) => location.pathname.startsWith(`/${section}`);

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      type: "link"
    },
    {
      name: "Products",
      icon: Package,
      type: "dropdown",
      key: "products",
      items: [
        { name: "Product List", path: "/products/list", icon: List },
        { name: "Add Product", path: "/products/add", icon: Plus },
        { name: "Add Garage Product", path: "/products/add-garage", icon: Plus }
      ]
    },
    {
      name: "Reviews",
      icon: Star,
      type: "dropdown",
      key: "reviews",
      items: [
        { name: "Review List", path: "/reviews/list", icon: List },
        { name: "Add Review", path: "/reviews/add", icon: Plus }
      ]
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingCart,
      type: "link"
    },
    {
      name: "Messages",
      path: "/messages",
      icon: MessageCircle,
      type: "link"
    },
    {
      name: "Bonus",
      icon: Gift,
      type: "dropdown",
      key: "bonus",
      items: [
        { name: "Bonus", path: "/bonus", icon: List },
        { name: "Coupon", path: "/bonus/coupon", icon: Plus }
      ]
    },
    {
      name: "Card-Details",
      path: "/card-details",
      icon: CreditCard,
      type: "link"
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
      type: "link"
    }
  ];

  return (
    <aside className="w-64 bg-gray-50 h-screen border-r border-gray-200 flex flex-col sticky top-0">
      {/* Logo */}
      <div className=" h-18 border-b border-gray-200">
        <div className="flex h-full items-center">
          <img src="/src/assets/images/load.svg" alt="Logo" className=" w-full h-full  -mt-5 " />
          {/* <div>
            <div className="text-red-600 font-bold text-lg">VOTAPERFORMANCE</div>
            <div className="text-gray-500 text-sm">SHOP.COM</div>
          </div> */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-3 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.type === "link" ? (
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-gray-700 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleExpanded(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isInSection(item.key)
                      ? "bg-gray-700 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {expandedItems[item.key] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems[item.key] && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive(subItem.path)
                            ? "bg-gray-700 text-white"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile */}
      {/* <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive("/profile")
              ? "bg-gray-700 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <User className="w-5 h-5 mr-3" />
          <span className="font-medium">Profile</span>
        </Link>
      </div> */}
    </aside>
  );
};

export default Sidebar; 