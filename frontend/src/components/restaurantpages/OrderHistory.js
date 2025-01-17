import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';
import { getOrdersByRestaurants, updateOrderStatus } from '../../services/api'; // Import the updateOrderStatus function
import '../../styles/orderhist.css'

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrdersByRestaurants(); // Call an API to fetch orders
                setOrders(response.data);
            } catch (error) {
                setError('Error fetching order history');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    console.log(orders);

    // Function to handle status update
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus); // Call API to update status
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Failed to update order status', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="order-history">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.user?.username || 'Unknown User'}</TableCell>
                                <TableCell>
                                    <ul>
                                        {order.items?.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.menuItem?.name || 'Unknown Item'} - {item.quantity} x ${item.menuItem?.price?.toFixed(2) || 'N/A'}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No items available</li>
                                        )}
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    {/* Dropdown for status update */}
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Preparing">Preparing</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>${order.totalAmount?.toFixed(2) || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </section>
    );
};

export default OrderHistory;
