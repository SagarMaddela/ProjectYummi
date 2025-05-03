
# ProjectYummi
# Food Ordering Platform

This project is a full-stack Food Ordering Platform, developed with a React.js frontend and a Node.js/Express.js backend. The application facilitates user-friendly online food ordering, providing a seamless experience for both customers and administrators.

---

## Project Structure

### Frontend
The `frontend` folder contains the React.js application, organized as follows:

#### Public Folder:
- **favicon.ico**: The favicon for the web app.
- **index.html**: The main HTML file serving the React app.
- **manifest.json**: Configuration for Progressive Web App (PWA) capabilities.
- **robots.txt**: Instructions for web crawlers.
- **images/**: Folder to store static images.

#### Source (src) Folder:
- **assets/**: Additional resources (e.g., fonts, icons, etc.).
- **components/**: Reusable React components for building UI elements.
- **images/**: Image assets used in the app.
- **pages/**: React components representing individual pages (e.g., Home, Menu, Cart).
- **services/**: API service calls to interact with the backend.
- **styles/**: CSS or SCSS files for styling the application.
- **App.js**: The main React component where routes and providers are defined.
- **index.js**: The entry point of the React application.

---

### Backend
The `backend` folder contains the Node.js/Express.js application, structured as follows:

#### Config:
- **db.js**: Database connection and configuration.

#### Controllers:
- **adminController.js**: Handles admin-related operations.
- **authController.js**: Manages authentication (login, signup, etc.).
- **cartController.js**: Logic for managing user carts.
- **resController.js**: Manages restaurant-related operations.
- **userController.js**: Handles user-related operations.

#### Middleware:
- **authenticateToken.js**: Middleware for token-based authentication.

#### Models:
- **Admin.js**: Schema and model for admin data.
- **Cart.js**: Schema and model for cart data.
- **MenuItem.js**: Schema and model for menu items.
- **Order.js**: Schema and model for orders.
- **Payment.js**: Schema and model for payment details.
- **Rating.js**: Schema and model for restaurant ratings.
- **Restaurant.js**: Schema and model for restaurant details.
- **Review.js**: Schema and model for customer reviews.
- **User.js**: Schema and model for user data.

#### Routes:
- **adminRoutes.js**: API endpoints for admin-related operations.
- **authRoutes.js**: API endpoints for authentication.
- **cartRoutes.js**: API endpoints for cart management.
- **resRoutes.js**: API endpoints for restaurant management.
- **userRoutes.js**: API endpoints for user operations.

#### Uploads:
- Directory for handling file uploads (e.g., images).

#### Root Files:
- **.env**: Environment variables.
- **package.json**: Node.js dependencies and scripts.
- **server.js**: Entry point for the backend server.

---

## Features
- **User Authentication**: Sign up, log in, and secure session management.
- **Menu Management**: View available food items and their details.
- **Cart System**: Add, edit, and remove items from the cart.
- **Order Placement**: Place orders and view order history.
- **Payment Integration**: Simulated or real payment processing.
- **Admin Panel**: Manage menu items, view orders, and oversee user activities.
- **Ratings & Reviews**: Users can rate and review restaurants.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js
- npm or yarn
- MongoDB

### Steps
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd food-ordering-platform
   ```

2. **Set Up Backend:**
   ```bash
   cd backend
   npm install express
   ```
   - Create a `.env` file based on `.env.example` and update environment variables.
   - Start the backend server:
     ```bash
     node server
     ```

3. **Set Up Frontend:**
   ```bash
   cd frontend
   npm install
   ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:3000`.

---

## Contributing
Contributions are welcome! Feel free to fork the repository and create a pull request.

---

![CI](https://github.com/your-username/your-repo-name/actions/workflows/ci.yml/badge.svg)


## License
This project is licensed under the MIT License. See the LICENSE file for details.

