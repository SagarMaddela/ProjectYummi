import React from 'react';
import '../styles/homepage.css';
import yummylogo from '../assets/yummylogo.png';
import burger from '../assets/burger.png';
import sub1img from '../assets/sub1img.png'
import sub2img from '../assets/sub2img.png'

const HomePage = () => {
    return (
      <div className="home-page">
        <header className="header">
         <div className="logo">
          <img src= { yummylogo } alt="yummylogo"/>
          </div>
          <nav className="nav">
            <a href="/login">LOGIN</a>
            <a href="/signup">REGISTER AS USER</a>
            <a href="/resregister">REGISTER AS RESTAURANT</a>
          </nav>
        </header>
       
        <div className='Mainbody'>
            <h1>A Premium <br/>And Aesthetic <br/> Food Ordering Platform </h1>
            <div className='Mainbody-image'>
            <img src= { burger } alt='pic1'></img>
            </div>
        </div>

        <div className='sub1'>
            <div className='sub1-image'>
                <img src= {sub1img} alt='sub1img'></img>
            </div>
            <div className='sub1-text'>
            <h2>Craving something delicious? At Yummy kitchen, we make food ordering quick, easy, and enjoyable. Explore a wide variety of cuisines from your favorite local restaurants and get your meal delivered right to your doorstep. Whether you're in the mood for comfort food or something new, Yummy Kitchen has got you covered.</h2>
            <a href="/signup">REGISTER AS USER   <span>&#8594;</span></a>

           </div>
        </div>

        <div className='sub2'>
            <div className='sub2-image'>
                <img src= {sub2img} alt='sub1img'></img>
            </div>
            <div className='sub2-text'>
            <h2>At Yummy kitchen, we don't just cater to food lovers—we’re here to support restaurants too! If you own a restaurant or run a food business, you can easily register with us and expand your reach. By partnering with Yummy, you’ll be able to offer your delicious meals to a larger audience, boost your sales, and provide seamless delivery services to your customers.</h2>
            <a href="/resregister">REGISTER AS RESTAURANT<span>&#8594;</span></a>
            </div>
        </div>
       
          {/* Footer Section */}
          <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={yummylogo} alt="Yummy Kitchen Logo" />
            </div>
            <div className="footer-links">
              <h3>Useful Links</h3>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#terms">Terms & Conditions</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <p>Email: support@yummykitchen.com</p>
              <p>Phone: +123 456 7890</p>
              <p>Address: 123 Yummy St, Food City</p>
              <button>Contact Us</button>
              <button>Support</button>
            </div>
            <div className="footer-socials">
              <h3>Follow Us</h3>
              <ul>
                <li><a href="https://facebook.com">Facebook</a></li>
                <li><a href="https://twitter.com">Twitter</a></li>
                <li><a href="https://instagram.com">Instagram</a></li>
              </ul>
            </div>
          </div>
        </footer>
        
      </div>
    );
  };

export default HomePage;
