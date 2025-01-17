import React, { useEffect, useState } from 'react';
import {getReviewsforRestaurant} from "../../services/api";
import "../../styles/resReviews.css";

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReviewsforRestaurant(token);
                setReviews(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch reviews.');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="reviews-page">
            <h1>Customer Reviews</h1>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to leave a review!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <h3>{review.user?.username || 'Anonymous'}</h3>
                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                        <p><strong>Review:</strong> {review.reviewText}</p>
                        {review.images.length > 0 && (
                            <div className="review-images">
                                {review.images.map((image, index) => (
                                    <img key={index} src={image} alt={`Review ${index + 1}`} />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewsPage;
