import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getRestaurantDataForAnalytics } from '../../services/api';
import '../../styles/resanalytics.css';

const AnalyticsPage = ({ restaurantId }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getRestaurantDataForAnalytics(token);
                setAnalyticsData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch analytics');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const { totalReviews, averageRating, popularItems } = analyticsData;
    console.log( popularItems);

    // Bar chart data for popular items
    const barChartData = {
        labels: popularItems.map(item => item.name),
        datasets: [
            {
                label: 'Total Ratings',
                data: popularItems.map(item => item.totalRatings),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    // Doughnut chart data for average rating
    const doughnutChartData = {
        labels: ['Average Rating', 'Remaining'],
        datasets: [
            {
                data: [averageRating, 5 - averageRating],
                backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(201, 203, 207, 0.6)'],
            },
        ],
    };

    return (
        <div className="res-analytics-page">
            <h1>Restaurant Analytics</h1>

            <div className="res-analytics-card">
                <h2>Total Reviews</h2>
                <p>{totalReviews}</p>
            </div>
            <div className='res-btm-container'>
            <div className="res-chart-container">
                <h2>Average Rating</h2>
                <Doughnut data={doughnutChartData} />
            </div>

            <div className="res-chart-container">
                <h2>Popular Menu Items</h2>
                <Bar data={barChartData} />
            </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
