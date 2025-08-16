import React from "react";
import DashboardMetrics from "../../../components/DashboardMetrics";
import SalesChart from "../../../components/SalesChart";
import RecentOrders from "../../../components/RecentOrders";

const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <DashboardMetrics />
      
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
};

export default HomePage;