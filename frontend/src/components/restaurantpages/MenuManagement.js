import React, { useState, useEffect } from 'react';
import { getRestaurantMenu, addMenuItems, UpdateMenuItem, DeleteMenuItem } from '../../services/api';
import '../../styles/ResMenuManagement.css';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: null,
        foodType: ''
    });
    const [editItem, setEditItem] = useState({
        _id: '',
        name: '',
        price: '',
        category: '',
        description: '',
        image: null,
        foodType: ''
    });
    const [isEditing, setIsEditing] = useState(false); // Track whether editing

    useEffect(() => {
        const fetchMenuItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await getRestaurantMenu(token);
                console.log(response.data);
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (isEditing) {
            // Update the editItem state if we're editing
            setEditItem((prev) => ({
                ...prev,
                [name]: type === 'file' ? files[0] : value,
            }));
        } else {
            // Update newItem state for new item
            setNewItem({
                ...newItem,
                [name]: type === 'file' ? files[0] : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await handleUpdate(editItem._id); // Update existing item
        } else {
            await handleAddNewItem(); // Add new item
        }
    };

    const handleAddNewItem = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        Object.entries(newItem).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await addMenuItems(token, formData);
            const response = await getRestaurantMenu(token);
            setMenuItems(response.data);
            setNewItem({ name: '', price: '', category: '', description: '', foodType: '', image: null });
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    const handleUpdate = async (itemId) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        Object.entries(editItem).forEach(([key, value]) => {
            if (value) formData.append(key, value); // Avoid appending null values
        });

        try {
            await UpdateMenuItem(token, formData, itemId);
            const response = await getRestaurantMenu(token);
            setMenuItems(response.data);
            resetEdit(); // Reset edit item state after update
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        const token = localStorage.getItem('token');

        try {
            await DeleteMenuItem(token, itemId);
            const response = await getRestaurantMenu(token);
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const handleEdit = (item) => {
        setEditItem({
            _id: item._id,
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            image: null, // Reset image for edit
            foodType: item.foodType,
        });
        setIsEditing(true); // Set editing mode
    };

    const resetEdit = () => {
        setEditItem({
            _id: '',
            name: '',
            price: '',
            category: '',
            description: '',
            image: null,
            foodType: '',
        });
        setIsEditing(false); // Reset editing mode
    };

    return (
        <div className="menu-management-container">
            <div className={`main-content`}>
                <div className='form-content'>
                <h1>Menu Management</h1>

                <h2>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Item Name:</label>
                    <input type="text" name="name" value={isEditing ? editItem.name : newItem.name} onChange={handleChange} required />

                    <label>Price:</label>
                    <input type="number" name="price" value={isEditing ? editItem.price : newItem.price} onChange={handleChange} required />

                    <label>Category:</label>
                    <select
                        name="category"
                        value={isEditing ? editItem.category : newItem.category}
                        onChange={handleChange}
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

                    <label>Description:</label>
                    <textarea name="description" value={isEditing ? editItem.description : newItem.description} onChange={handleChange} required />

                    <label>Food Type:</label>
                    <select name="foodType" value={isEditing ? editItem.foodType : newItem.foodType} onChange={handleChange} required>
                        <option value="" disabled>Select a Category</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>

                    <label>Upload Image:</label>
                    <input type="file" name="image" onChange={handleChange} required/>

                    <button type="submit">{isEditing ? 'Update Item' : 'Add Item'}</button>
                    {isEditing && <button type="button" onClick={resetEdit}>Cancel Edit</button>}
                </form>
                </div>

                <div className='current-menu' >
                <h2>Current Menu</h2>
                <ul>
                    {menuItems.length > 0 ? (
                        menuItems.map(item => (
                            <li key={item._id}>
                                <span>{item.name} - {item.price} - {item.description} - {item.category}</span>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </ul>
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;
