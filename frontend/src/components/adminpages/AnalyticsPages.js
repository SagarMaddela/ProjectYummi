import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  gettotalrevenue,
  getordersbystatus,
  getordersovertime,
  getmostordereditems,
} from '../../services/api';
import '../../styles/adminanal.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register required chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsPage = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [ordersByStatusData, setOrdersByStatusData] = useState(null);
  const [mostOrderedItemsData, setMostOrderedItemsData] = useState(null);
  const [ordersOverTimeData, setOrdersOverTimeData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [revenueResponse, ordersStatusResponse, mostOrderedItemsResponse, ordersOverTimeResponse] =
          await Promise.all([
            gettotalrevenue(),
            getordersbystatus(),
            getmostordereditems(),
            getordersovertime(),
          ]);

        setRevenueData({
          labels: ['Total Revenue'],
          datasets: [
            {
              label: 'Revenue',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
              borderWidth: 2,
              data: [revenueResponse?.data?.totalRevenue || 0],
            },
          ],
        });

        setOrdersByStatusData({
          labels: ordersStatusResponse?.data?.map(status => status._id) || [],
          datasets: [
            {
              label: 'Orders by Status',
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              data: ordersStatusResponse?.data?.map(status => status.totalOrders) || [],
            },
          ],
        });

        setMostOrderedItemsData({
          labels: mostOrderedItemsResponse?.data?.map(item => item._id) || [],
          datasets: [
            {
              label: 'Most Ordered Items',
              backgroundColor: '#FF5722',
              borderColor: '#D84315',
              data: mostOrderedItemsResponse?.data?.map(item => item.totalOrdered) || [],
            },
          ],
        });

        setOrdersOverTimeData({
          labels: ordersOverTimeResponse?.data?.map(order => `Day ${order._id}`) || [],
          datasets: [
            {
              label: 'Orders Over Time',
              backgroundColor: '#03A9F4',
              borderColor: '#0288D1',
              data: ordersOverTimeResponse?.data?.map(order => order.totalOrders) || [],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to fetch analytics data. Please try again later.');
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page">
      <h2 className="analytics-title">Order Analytics</h2>
      {error ? (
        <p className="analytics-error">{error}</p>
      ) : (
        <div className="analytics-grid">
          {/* Total Revenue */}
          <div className="chart-container">
            <h3>Total Revenue</h3>
            {revenueData ? <Bar data={revenueData} /> : <p className="loading-text">Loading...</p>}
          </div>

          {/* Orders by Status */}
          <div className="chart-container">
            <h3>Orders by Status</h3>
            {ordersByStatusData ? <Pie data={ordersByStatusData} /> : <p className="loading-text">Loading...</p>}
          </div>

          {/* Most Ordered Items */}
          <div className="chart-container">
            <h3>Most Ordered Items</h3>
            {mostOrderedItemsData ? <Bar data={mostOrderedItemsData} /> : <p className="loading-text">Loading...</p>}
          </div>

          {/* Orders Over Time */}
          <div className="chart-container">
            <h3>Orders Over Time</h3>
            {ordersOverTimeData ? <Line data={ordersOverTimeData} /> : <p className="loading-text">Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
