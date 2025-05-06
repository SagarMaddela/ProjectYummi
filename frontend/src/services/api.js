import axios from 'axios';
// https://projectyummi-web-service.onrender.com/api
const API = axios.create({ baseURL: 'https://projectyummi-web-service.onrender.com/api' });

export const loginUser = (formData) => API.post('/auth/login', formData);
export const signupUser = (formData) => API.post('/auth/signup', formData);
export const Registeradmin = (formData) => API.post('/admin/registerAdmin', formData);
export const registerRestaurant = (formData) => API.post('/restaurant/registerForm', formData);

export const getRestaurantData = (token) => 
    API.get('/restaurant/restaurantDash', { 
      headers: { Authorization: `Bearer ${token}` } 
});

export const getRestaurantMenu = (token) => API.get('/restaurant/menu', {
  headers: {
      Authorization: `Bearer ${token}`,
  },
});

export const addMenuItems = (token, formData) => API.post('/restaurant/menu/add', formData, {
  headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
  },
});

export const UpdateMenuItem = (token, formData, itemId) => API.post(`/restaurant/menu/update/${itemId}`, formData, {
  headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
  },
});

// export const getCartItems = (token) => API.get('/cart/menu', {
//   headers: {
//       Authorization: `Bearer ${token}`, // Add token manually
//   },
// });

export const getCartItems = async (token) => {
  try {
      const response = await API.get('/cart/menu', {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response; // Ensure this returns the full response, not just `response.data`
  } catch (error) {
      console.error("Error in getCartItems API:", error);
      throw error;
  }
};


export const addToItemCart = (token, itemData) => API.post('/cart/add', itemData,{
  headers: {
      Authorization: `Bearer ${token}`,
  },
});

export const deleteCartItem = (itemId, token) => API.delete(`/cart/delete/${itemId}`, {
  headers: {
      Authorization: token ? `Bearer ${token}` : '', // Add token manually
  },
  
});
export const DeleteMenuItem = (token, itemId) => API.post(`/restaurant/menu/delete/${itemId}`, {}, {
  headers: {
      Authorization: `Bearer ${token}`,
  },
});

export const getRestaurants = async () => {
    try {
      const response = await API.get('/auth/adminrestaurants');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };
  
  // Delete a restaurant by ID
  export const deleteRestaurantById = async (restaurantId) => {
    try {
      await API.delete(`/auth/restaurants/${restaurantId}`);
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  export const getUsers = async () => {
    try {
      const response = await API.get('/auth/adminuser');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };
  
  // Delete a restaurant by ID
  export const deleteUserById = async (userId) => {
    try {
        await API.delete(`/auth/users/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const updateRestaurantStatus = async (restaurantId, newStatus) => {
  const response = await API.put(`/auth/status/${restaurantId}`, { status: newStatus });
  return response.data;
};

export const getAdminDashboardStats = async () => {
  try {
    const response = await API.get('/auth/adminDashboard'); // Adjusted endpoint for clarity
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const RenderUserRest = async () =>{
  try {
    const response = await API.get('/user/userrestaurants');
    return response;
  }
  catch (error){
    throw error.response ? error.response.data : error.message;
  }
}

export const getRestaurantMenuItems = async (restaurantId) => {
  try {
      const response = await API.get(`/user/${restaurantId}/menu`);
      return response;
  } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      throw error; // Propagate the error for handling in the component
  }
};



export const HandleAddToCart = async (itemId, restaurantId, token) => {
  try {
      const response = await API.post('/cart/add', {
          itemId,
          restaurantId
      }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response; // Make sure to return the response
  } catch (error) {
      throw error; // Re-throw the error for the calling function to handle
  }
};

export const placeOrder = async (orderData, token) => {
  return await API.post('/cart/orders', orderData, {
      headers: {
          Authorization: `Bearer ${token}` // Send token in headers for authentication
      }
  });
};

export const getOrderDetails = async () => {
  try {
    const response = await API.get("/admin/orders"); // Adjust the endpoint according to your API structure
    return response; // Return the response data
  } catch (error) {
    throw error; // Rethrow the error to be handled in the component
  }
};

const getToken = () => {
  return localStorage.getItem('token'); // Adjust based on where you store the token
};

export const getOrdersByRestaurants = async () => {
  const token = getToken();
  console.log(token);

  const response = API.get('/restaurant/orders', {
      headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
      },
  });

  return response;
};


export const updateOrderStatus = (orderId, status) => {
  return API.put(`restaurant/orders/${orderId}/status`, { status });
};

export const getordersbystatus = () =>{
  return API.get('/admin/orders-by-status');
}

export const getmostordereditems = () => {
  return API.get('/admin/most-ordered-items');
}

export const gettotalrevenue = () =>{
  return API.get('/admin/total-revenue');
}

export const getordersovertime = () =>{
  return API.get('/admin/order-over-time');
}


export const payments = async(token, paymentData) => API.post('/cart/payments', paymentData, {
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserInfo = async(token) => API.get("/user/getUser",{
  headers: { Authorization: `Bearer ${token}` }
});

export const getOrderHistory = async (token) => API.get("/user/orderhistory", {
    headers: {
      Authorization: `Bearer ${token}`, // Make sure to send the token as a bearer token
    },
  });

export const getActiveOrders = async (token) => {
  const response = API.get('/user/activeorders', {
    headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request header
    },
});

return response;
  };

  export const cancelOrder = async (orderId) => {
    try {
      const response = await API.patch(`/user/cancelorder/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const deleteOrder = async (orderId) => {
    try {
      const response = await API.delete(`/user/deleteorder/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
 
  export const getUserProfile = async (token) => {
    const response = await API.get('/user/getprofile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  };
  
  export const updateUserProfile = async (userData, token) => {
      const response = await API.put('/user/updateprofile', userData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the JWT token for authentication
        },
      });
      console.log("API response in updateUserProfile:", response.data); // Debug log
      return response.data; // Ensure this data is returned
  };

  export const submitReview = async(data,token) => API.put('/user/submitreview', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const updateCartItemQuantity = async(itemId,newQuantity,token) => API.put('/user/updatequantity', itemId, newQuantity, {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const updateQuantity = async(itemId,token) => API.put(`/cart/updatequantity/${itemId}`, itemId, {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const getRestaurantDataForAnalytics = async(token) => API.get('/restaurant/analytics', {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const getReviewsforRestaurant = async(token) => API.get('/restaurant/reviews', {
    headers: { Authorization: `Bearer ${token}` }
  });





  // export const submitReview = async (data, token) => {
  //   try {
  //     const response = await API.put("/orders/submitReview", data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error submitting review:", error);
  //     throw error;
  //   }
  // };
  
  