import React from "react";
import { Link } from "react-router-dom";

const RecentOrders = () => {
  const orders = [
    { id: "ORD001", customer: "John Doe", total: "$250", date: "2025-03-25" },
    { id: "ORD002", customer: "Jane Smith", total: "$180", date: "2025-03-24" },
    { id: "ORD003", customer: "Mike Johnson", total: "$320", date: "2025-03-23" },
    { id: "ORD004", customer: "Sarah Lee", total: "$150", date: "2025-03-22" },
    { id: "ORD005", customer: "Tom Brown", total: "$200", date: "2025-03-21" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link
          to="/orders"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{order.total}</td>
                <td className="py-3 px-4 text-gray-600">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders; 