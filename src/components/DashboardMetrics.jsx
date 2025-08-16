import React from "react";
import { Package, Users, ShoppingCart } from "lucide-react";
import { useGetProducts } from "../features/products/hooks/useProducts";

const DashboardMetrics = () => {

   const { data: products = [],  } = useGetProducts();


  const metrics = [
    {
      title: "Total Products",
      value: `${products?.length}`,
      icon: Package,
      color: "bg-blue-500",
      iconColor: "text-blue-500"
    },
    {
      title: "Total Users",
      value: "6",
      icon: Users,
      color: "bg-green-500",
      iconColor: "text-green-500"
    },
    {
      title: "Total Orders",
      value: "75",
      icon: ShoppingCart,
      color: "bg-orange-500",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-gray-600 mt-1">{metric.title}</p>
            </div>
            <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics; 