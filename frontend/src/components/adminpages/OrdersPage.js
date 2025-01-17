import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { getOrderDetails } from "../../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrderDetails();
        setOrders(response.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message || error.request
        );
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { color: "green", fontWeight: "bold" };
      case "Pending":
        return { color: "orange", fontWeight: "bold" };
      default:
        return { color: "red", fontWeight: "bold" };
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            {["Order ID", "Customer Name", "Restaurant", "Status"].map((header) => (
              <TableCell key={header} sx={{ color: "white", fontWeight: "bold" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length ? (
            orders.map((order, index) => (
              <TableRow
                key={order._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.username || "N/A"}</TableCell>
                <TableCell>{order.restaurant?.restaurantName || "N/A"}</TableCell>
                <TableCell sx={getStatusStyle(order.status)}>
                  {order.status}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                No orders available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersPage;
