import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/api";
import '../../styles/admindash.css';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminDashboardStats();
        setStats(response);
      } catch (error) {
        setError(error);
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ padding: 3, textAlign: "center", backgroundColor: "#f8d7da" }}>
        <Typography variant="h6" color="error">Error fetching data!</Typography>
        <Typography variant="body2" color="textSecondary">{error.message}</Typography>
      </Paper>
    );
  }

  const totalUsers = stats?.totalUsers ?? 0;
  const totalRestaurants = stats?.totalRestaurants ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;

  return (
    <Box sx={{ padding: 3 }}>
      {/* Total Users Card */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4, padding: 3, backgroundColor: "#ecf0f1", borderRadius: 2, boxShadow: 2 }}>
        <Box textAlign="center" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: "#2c3e50" }}>Total Users</Typography>
          <Typography variant="h4" sx={{ color: "#2980b9", fontWeight: "bold" }}>{totalUsers}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 0 24 24" width="96" fill="#2980b9">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0 6c-2.33 0-7 1.17-7 3v1h14v-1c0-1.83-4.67-3-7-3zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </Box>
      </Box>

      {/* Total Restaurants Card */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4, padding: 3, backgroundColor: "#ecf0f1", borderRadius: 2, boxShadow: 2 }}>
        <Box textAlign="center" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: "#2c3e50" }}>Total Restaurants</Typography>
          <Typography variant="h4" sx={{ color: "#2980b9", fontWeight: "bold" }}>{totalRestaurants}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 0 24 24" width="96" fill="#2980b9">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M11 2c-1.1 0-2 .9-2 2H4v6c0 1.1.9 2 2 2h1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-9h1c1.1 0 2-.9 2-2V4h-5c0-1.1-.9-2-2-2h-2zm0 2h2v2h-2V4zm-5 4V6h14v2H6zm6 3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
          </svg>
        </Box>
      </Box>

      {/* Total Orders Card */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: 3, backgroundColor: "#ecf0f1", borderRadius: 2, boxShadow: 2 }}>
        <Box textAlign="center" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: "#2c3e50" }}>Total Orders</Typography>
          <Typography variant="h4" sx={{ color: "#2980b9", fontWeight: "bold" }}>{totalOrders}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 0 24 24" width="96" fill="#2980b9">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0 8c-2.33 0-7 1.17-7 3v1h14v-1c0-1.83-4.67-3-7-3z" />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;