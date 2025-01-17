import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { placeOrder, payments } from '../../services/api';
import "../../styles/PaymentPage.css";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(''); // State for delivery address
    const token = localStorage.getItem('token');

    // Retrieve order data from location state
    const orderData = location.state?.orderData;

    if (!orderData) {
        console.error("Order data is missing");
    }

    // Tax and Total Calculation
    const taxRate = 0.10; // 10% tax rate
    const taxAmount = orderData ? orderData.totalAmount * taxRate : 0;
    const totalAmountWithTax = orderData ? orderData.totalAmount + taxAmount : 0;

    // Handle payment success
    const handlePaymentSuccess = async () => {
        if (!deliveryAddress) {
            setError('Please provide a delivery address');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create pending order with delivery address
            const orderResponse = await placeOrder({ ...orderData, deliveryAddress }, token);
            if (orderResponse.status === 201) {
                const orderId = orderResponse.data._id;
                const paymentData = {
                    orderId,
                    userId: orderData.userId,
                    amount: totalAmountWithTax,
                    paymentMethod: 'card',
                    transactionId: `txn_${Date.now()}`,
                    paymentStatus: 'completed',
                    deliveryAddress, // Add delivery address to payment data
                };

                // Process payment
                const paymentResponse = await payments(token, paymentData);
                if (paymentResponse.status === 201) {
                    // Update order status
                    const updateOrderResponse = await placeOrder({ orderId, status: 'Pending' }, token);
                    if (updateOrderResponse.status === 200) {
                        alert('Payment successful, order placed!');
                        navigate('/ordersuccess');
                    } else {
                        alert('Failed to update order status after payment');
                    }
                } else {
                    alert('Payment failed. Please try again.');
                }
            } else {
                alert('Failed to create the order');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Payment failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="payment-loading">Processing your payment...</div>;

    return (
        <div className="payment-container">
            <h2 className="payment-title">Payment Details</h2>

            {/* {!orderData && (
                <div className="no-order-data">
                    <p>Order data is missing. Please go back to the cart and try again.</p>
                    <button onClick={() => navigate('/cart')} className="go-back-button">Go Back to Cart</button>
                </div>
            )} */}

            {orderData && (
                <div className="order-summary">
                    <h3 className="order-summary-title">Order Summary</h3>
                    <p className="order-summary-text">
                        <strong>Restaurant:</strong> {orderData.restaurantName}
                    </p>
                    <p className="order-summary-text">
                        <strong>Total Amount:</strong> ${orderData.totalAmount.toFixed(2)}
                    </p>
                    <p className="order-summary-text">
                        <strong>Tax (10%):</strong> ${taxAmount.toFixed(2)}
                    </p>
                    <p className="order-summary-text">
                        <strong>Total Amount with Tax:</strong> ${totalAmountWithTax.toFixed(2)}
                    </p>

                    <div className="order-items">
                        <h4 className="order-items-title">Items:</h4>
                        {orderData.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <p className="order-item-text">{item.menuItem.name} (x{item.quantity})</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delivery Address Form */}
            { (
                <div className="delivery-address">
                    <h3>Delivery Address</h3>
                    <textarea
                        placeholder="Enter delivery address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows="4"
                        className="address-textarea"
                    />
                </div>
            )}

            {error && <p className="error-message">{error}</p>}

            {orderData && (
                <button className="payment-button" onClick={handlePaymentSuccess}>Complete Payment</button>
            )}
        </div>
    );
};

export default Payment;
