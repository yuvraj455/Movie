import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddMovie from './components/AddMovie';
import EditMovie from './components/EditMovie';
import MovieDetail from './components/MovieDetail'; // Import the MovieDetail component

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="container mx-auto mt-4 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-movie" element={<AddMovie />} />
              <Route path="/edit-movie/:id" element={<EditMovie />} />
              <Route path="/movie/:id" element={<MovieDetail />} /> {/* Add MovieDetail route */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
