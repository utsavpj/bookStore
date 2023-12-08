import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import ManageBooks from './components/ManageBooks';
import Orders from './components/Orders';
import Profile from './components/Profile';
import AddBook from './components/AddBook';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('sessionToken'));
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch login status from the backend when the component mounts
    fetch('http://localhost:8080/customer/login')
      .then((response) => response.json())
      .then((data) => {
        setIsLoggedIn(data.isLoggedIn);
        setUserData(data.customer);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching login status:', error);
        setLoading(false);
      });
  }, []);

  const handleLogin = (userData) => {
    // Assuming your server returns a session token in the response
    const sessionToken = userData.token;
    localStorage.setItem('sessionToken', sessionToken);
    // Store the session token in a secure way (e.g., using cookies or local storage)
    document.cookie = `sessionToken=${sessionToken}; Path=/; Secure; SameSite=Strict`;

    setIsLoggedIn(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    // Clear session token from localStorage and cookies
    localStorage.removeItem('sessionToken');
    document.cookie = 'sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict';
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isLoggedIn && <Navigation isLoggedIn={isLoggedIn} userData={userData} logout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Home userData={userData} /> : <Login onLogin={handleLogin} />
          }
        />
        {!isLoggedIn && <Route path="/signup" element={<Signup />} />}
        {isLoggedIn && (
          <>
            <Route path="/cart" element={<Cart userData={userData} />} />
            <Route path="/manage-books" element={<ManageBooks userData={userData} />} />
            <Route path="/view-orders" element={<Orders userData={userData} />} />
            <Route path="/profile" element={<Profile userData={userData} />} />
            <Route path="/add-book" element={<AddBook userData={userData} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
