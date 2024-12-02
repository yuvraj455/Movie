import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddMovie from './components/AddMovie';
import MovieDetail from './components/MovieDetail';
import AuthCallback from './components/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;