import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const [page] = useState({
    options: [
      {
        name: 'Free',
        desc: '1 Question per day',
        price: 0,
      },
      {
        name: 'Silver',
        desc: '5 Questions per day',
        price: 100,
      },
      {
        name: 'Premium',
        desc: 'Unlimited Questions per day',
        price: 1000,
      },
    ],
  });

  const navigate = useNavigate();

  const initPayment = async (data) => {
    const options = {
      key: 'rzp_test_RHkbnq3KbCLC6C',
      amount: data.amount.toString(),
      currency: data.currency,
      name: 'Offers', // Replace with your product name
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = 'https://razorpay-mernstack.onrender.com/api/payment/verify';
          const { data } = await axios.post(verifyUrl, response);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) { 
      console.log(response.error.description);
    });
    rzp.open();
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handlePayment = async (price) => {
    if (price === 0) {
      console.log('Free option selected. No payment required.');
      alert('Free option selected. No payment required.');
      return;
    }
    try {
      const orderUrl = 'https://razorpay-mernstack.onrender.com/api/payment/orders';
      const { data } = await axios.post(orderUrl, { amount: price });
      console.log(data);
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="back_btn" onClick={handleGoBack}>
        Go Back
      </button>
      <div className="App">
        <div className="page-container">
          {page.options.map((option, index) => (
            <div key={index} className="page">
              <p className="page_name">{option.name}</p>
              <p className="page_desc">{option.desc}</p>
              <p className="page_price">
                Price: <span>&#8377;{option.price}</span>
              </p>
              <button className="buy_btn" onClick={() => handlePayment(option.price)}>
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
