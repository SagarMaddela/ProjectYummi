import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResRegister from './pages/ResRegister';
import ResDash from './components/ResDash';
import AdminReg from './pages/AdminReg';
import DashboardPage from './components/adminpages/Dashboard';
import AnalyticsPage from './components/adminpages/AnalyticsPages';
import OrdersPage from './components/adminpages/OrdersPage';
import UsersPage from './components/adminpages/UsersPage';
import SettingsPage from './components/adminpages/SettingsPage';
import RestaurantsPages from './components/adminpages/RestaurantsPages';
import AdminLayout from './components/AdminLayout';
import Admincontent from './components/adminpages/Admincontent';
import UserLayout from './components/UserLayout';
import UserMenuItems from './components/userpages/UserMenuItems';
import UserCartPage from './components/userpages/UserCartPage';
import UserPaymentPage from './components/userpages/UserPaymentPage';
import UserOrderHistory from "./components/userpages/userdashboard/UserOrderHistory";
import UserActiveOrder from "./components/userpages/userdashboard/UserActiveOrder";
import UserProfile from "./components/userpages/userdashboard/UserProfile";
import OrderSuccess from './components/userpages/OrderSuccess';
import UserResPage from "./components/userpages/UserResPage";

const App = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/resregister" element={<ResRegister />} />
                    <Route path="/adminReg" element={<AdminReg />} />
                    
                    {/* Admin Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Admincontent />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="restaurants" element={<RestaurantsPages />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                    </Route>

                    {/* Restaurant Dashboard */}
                    <Route path="/restaurantdash/*" element={<ResDash />} />
                    <Route path="/userlayout/*" element={<UserLayout />} />
                    <Route path="/restaurants/:id/menu" element={<UserMenuItems />} />
                    <Route path="/cart/:restaurantId" element={< UserCartPage/>}/>
                    <Route path="/payment" element={< UserPaymentPage/>}/>
                    <Route path="/cart" element={< UserCartPage/>}/>
                    <Route path="/userorderhistory" element={< UserOrderHistory/>}/>
                    <Route path="/useractiveorders" element={< UserActiveOrder/>}/>
                    <Route path="/userprofile" element={< UserProfile/>}/>
                    <Route path="/ordersuccess" element={< OrderSuccess/>}/>
                    <Route path="/restaurants" element={<UserResPage />}/>
                </Routes>
            </Router>
    );
};

export default App;
