import React, { useState } from 'react';
import { registerRestaurant } from '../services/api'; // Adjust the path as necessary
import '../styles/RestaurantReg.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [owner, setOwner] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryRadius, setDeliveryRadius] = useState('');
    const [businessHours, setBusinessHours] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [menuItems, setMenuItems] = useState([{ name: '', price: '', category: '', description: '', foodType: '', image: null }]);
    const [logo, setLogo] = useState(null);
    const [foodLicense, setFoodLicense] = useState(null);
    const [healthCertification, setHealthCertification] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');

    const navigate = useNavigate();

    const addMenuItem = () => {
        setMenuItems([...menuItems, { name: '', price: '', category: '', description: '', foodType: '', image: null }]);
    };

    const handleMenuItemChange = (index, e) => {
        const { name, value, files } = e.target;
        const updatedMenuItems = [...menuItems];
        if (files) {
            updatedMenuItems[index][name] = files[0];
        } else {
            updatedMenuItems[index][name] = value;
        }
        setMenuItems(updatedMenuItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            if (!item.category) {
                alert(`Please select a category for menu item ${i + 1}`);
                return;
            }
        }

        const formData = new FormData();
        formData.append('restaurantName', restaurantName);
        formData.append('owner', owner);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('address', address);
        formData.append('deliveryRadius', deliveryRadius);
        formData.append('businessHours', businessHours);
        formData.append('restaurantDescription', restaurantDescription);
        formData.append('logo', logo);
        formData.append('foodLicense', foodLicense);
        formData.append('healthCertification', healthCertification);
        formData.append('accountNumber', accountNumber);
        formData.append('routingNumber', routingNumber);

        menuItems.forEach((item, index) => {
            formData.append(`menuItems[${index}][name]`, item.name);
            formData.append(`menuItems[${index}][price]`, item.price);
            formData.append(`menuItems[${index}][category]`, item.category);
            formData.append(`menuItems[${index}][description]`, item.description);
            formData.append(`menuItems[${index}][foodType]`, item.foodType);
            formData.append(`menuItems[${index}][image]`, item.image);
        });

        try {
            await registerRestaurant(formData); // Use the imported API function
            alert('Restaurant registered successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering restaurant:', error);
            alert('Failed to register restaurant');
        }
    };

    return (
        <div className="registerPage">
            <h1>Register Your Restaurant</h1>
            <div className="registerForm">
                <form onSubmit={handleSubmit} encType="multipart/form-data">

                    <div className="basicInfo">
                        <h2>Basic Information</h2>
                        <div>
                            <label>Restaurant Name:</label>
                            <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Owner's Name:</label>
                            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required />
                        </div>
                        <div>
                            <label>Email Address:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    <div className="locationInfo">
                        <h2>Location and Address</h2>
                        <div>
                            <label>Physical Address:</label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                        </div>
                        <div>
                            <label>Delivery Radius (km):</label>
                            <input type="number" value={deliveryRadius} onChange={(e) => setDeliveryRadius(e.target.value)} required />
                        </div>
                    </div>

                    <div className="operatingHours">
                        <h2>Operating Hours</h2>
                        <div>
                            <label>Business Hours:</label>
                            <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder="e.g. Mon-Fri: 9am-10pm" required />
                        </div>
                    </div>

                    <div className="menuInfo">
                        <h2>Menu Information</h2>
                        {menuItems.map((item, index) => (
                            <div key={index} className="menuItem">
                                <h3>Menu Item {index + 1}</h3>
                                <div>
                                    <label>Item Name:</label>
                                    <input type="text" name="name" value={item.name} onChange={(e) => handleMenuItemChange(index, e)} required />
                                </div>
                                <div>
                                    <label>Price:</label>
                                    <input type="number" name="price" value={item.price} onChange={(e) => handleMenuItemChange(index, e)} required />
                                </div>
                                <div>
                                    <label>Category:</label>
                                    <select
                                        name="category"
                                        value={item.category}
                                        onChange={(e) => handleMenuItemChange(index, e)}
                                        required
                                    >
                                        <option value="" disabled>Select a Category</option>
                                        <option value="biryani">Biryani</option>
                                        <option value="pizza">Pizza</option>
                                        <option value="burgers">Burgers</option>
                                        <option value="chinese">Chinese</option>
                                        <option value="south-indian">South Indian</option>
                                        <option value="north-indian">North Indian</option>
                                        <option value="italian">Italian</option>
                                        <option value="mexican">Mexican</option>
                                        <option value="thai">Thai</option>
                                        <option value="japanese">Japanese</option>
                                        <option value="seafood">Seafood</option>
                                        <option value="bbq-grills">BBQ & Grills</option>
                                        <option value="street-food">Street Food</option>
                                        <option value="healthy-food">Healthy Food</option>
                                        <option value="desserts-sweets">Desserts & Sweets</option>
                                        <option value="beverages">Beverages</option>
                                        <option value="salads">Salads</option>
                                        <option value="wraps-rolls">Wraps & Rolls</option>
                                        <option value="sandwiches">Sandwiches</option>
                                        <option value="fast-food">Fast Food</option>
                                        <option value="vegan-options">Vegan Options</option>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="non-vegetarian">Non-Vegetarian</option>
                                        <option value="gluten-free">Gluten-Free</option>
                                        <option value="keto-friendly">Keto-Friendly</option>
                                        <option value="family-meals">Family Meals</option>
                                        <option value="combo-meals">Combo Meals</option>
                                        <option value="breakfast">Breakfast</option>
                                        <option value="brunch">Brunch</option>
                                        <option value="late-night-cravings">Late Night Cravings</option>
                                    </select>

                                </div>
                                <div>
                                    <label>Description:</label>
                                    <textarea name="description" value={item.description} onChange={(e) => handleMenuItemChange(index, e)} required />
                                </div>
                                <div>
                                    <label>Food Type:</label>
                                    <select name="foodType" value={item.foodType} onChange={(e) => handleMenuItemChange(index, e)} required>
                                        <option value="" disabled>Select a Category</option>
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Upload Image:</label>
                                    <input type="file" name="image" onChange={(e) => handleMenuItemChange(index, e)} required />
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addMenuItem}>Add Another Menu Item</button>
                    </div>

                    <div className="brandingInfo">
                        <h2>Branding</h2>
                        <div>
                            <label>Restaurant Description:</label>
                            <textarea value={restaurantDescription} onChange={(e) => setRestaurantDescription(e.target.value)}></textarea>
                        </div>
                        <div>
                            <label>Upload Logo:</label>
                            <input type="file" onChange={(e) => setLogo(e.target.files[0])} required />
                        </div>
                    </div>

                    <div className="licensesCertifications">
                        <h2>Licenses and Certifications</h2>
                        <div>
                            <label>Food Business License:</label>
                            <input type="file" onChange={(e) => setFoodLicense(e.target.files[0])} required />
                        </div>
                        <div>
                            <label>Health and Safety Certification:</label>
                            <input type="file" onChange={(e) => setHealthCertification(e.target.files[0])} />
                        </div>
                    </div>

                    <div className="paymentInfo">
                        <h2>Payment Information</h2>
                        <div>
                            <label>Bank Account Number:</label>
                            <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                        </div>
                        <div>
                            <label>Routing Number:</label>
                            <input type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit">Register Restaurant</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;