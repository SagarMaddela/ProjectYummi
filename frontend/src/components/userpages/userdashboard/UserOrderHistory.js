import React, { useEffect, useState } from "react";
import "../../../styles/userorderhistory.css";
import { getOrderHistory, submitReview, cancelOrder } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [reviewedOrders, setReviewedOrders] = useState([]); // Tracks reviewed orders

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrderHistory(token);
        console.log(response.data);
        const orderData = response.data.map((order) => {
          // Check if order already has a review and update the feedback state accordingly
          if (order.review && order.review.rating) {
            setFeedback((prevFeedback) => ({
              ...prevFeedback,
              [order._id]: {
                rating: order.review.rating,
                review: order.review.reviewText,
              },
            }));
            setReviewedOrders((prevReviewedOrders) => [
              ...prevReviewedOrders,
              order._id,
            ]);
          }
          return order;
        });
        setOrders(orderData);
      } catch (err) {
        setError("Failed to fetch order history. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleFeedbackChange = (orderId, type, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [orderId]: {
        ...prevFeedback[orderId],
        [type]: value,
      },
    }));
  };

  const handleSubmitReview = async (orderId) => {
    try {
      const data = {
        orderId,
        rating: feedback[orderId]?.rating || 0,
        reviewText: feedback[orderId]?.review || "",
      };

      const response = await submitReview(data, token);
      console.log("Review submitted:", response.data);

      // Update reviewedOrders state
      setReviewedOrders((prevReviewedOrders) => [...prevReviewedOrders, orderId]);

      alert("Thank you for your feedback!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again later.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      if (response.status === 200) {
        setOrders(orders.filter((order) => order._id !== orderId));
        alert("Order has been cancelled.");
      }
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const handleReOrder = (order) => {
    const orderData = {
      restaurantName: order.restaurant.restaurantName,
      restaurantId: order.restaurant._id,
      userId: order.user._id,
      items: order.items.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
        name: item.menuItem.name,
      })),
      totalAmount: order.totalAmount,
    };
    navigate("/payment", { state: { orderData } });
  };

  if (loading) return <div>Loading your order history...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-history-container">
      <h1>Your Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-cards">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <div className="order-items">
                <h4>Items</h4>
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.menuItem ? item.menuItem._id : item._id}
                  >
                    <span>
                      {item.menuItem
                        ? `${item.menuItem.name} (x${item.quantity})`
                        : "Menu Item Not Available"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-details">
                <p>
                  <strong>Restaurant:</strong>{" "}
                  {order.restaurant
                    ? order.restaurant.restaurantName
                    : "Not Available"}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total:</strong>  ₹{(order.totalAmount ?? 0).toFixed(2)}
                </p>
                <button
                  onClick={() => handleReOrder(order)}
                  className="reorder-btn"
                >
                  Re-Order
                </button>
              </div>
              <div className="rating-review-section">
                <h4>Rate & Review</h4>
                {reviewedOrders.includes(order._id) ? (
                  <div className="submitted-feedback">
                    <p>
                      <strong>Rating:</strong> {feedback[order._id]?.rating} ★
                    </p>
                    <p>
                      <strong>Review:</strong> {feedback[order._id]?.review}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${
                            feedback[order._id]?.rating >= star ? "filled" : ""
                          }`}
                          onClick={() =>
                            handleFeedbackChange(order._id, "rating", star)
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea
                      placeholder="Write your review here..."
                      value={feedback[order._id]?.review || ""}
                      onChange={(e) =>
                        handleFeedbackChange(order._id, "review", e.target.value)
                      }
                    ></textarea>
                    <button
                      onClick={() => handleSubmitReview(order._id)}
                      className="submit-review-btn"
                    >
                      Submit Review
                    </button>
                  </>
                )}
              </div>
              <button
                className="active-orders-container__cancel-button"
                onClick={() => handleDeleteOrder(order._id)}
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

// ${order.totalAmount.toFixed(2)}