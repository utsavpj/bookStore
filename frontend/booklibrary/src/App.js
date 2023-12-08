import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    // Fetch login status from the backend when the component mounts
    fetch('http://localhost:8080/cutomer/login')
      .then((response) => response.json())
      .then((data) => {
        setIsLoggedIn(data.isLoggedIn);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching login status:', error);
        setLoading(false);
      });
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData); // Store user data received from the Login component
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isLoggedIn && <Navigation isLoggedIn={isLoggedIn} userData={userData} logout={() => setIsLoggedIn(false)} />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Home userData={userData} /> : <Login onLogin={handleLogin}/>
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
};



export default App;
