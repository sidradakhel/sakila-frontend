import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FilmsPage from "./pages/FilmsPage";
import CustomersPage from "./pages/CustomersPage";
import './App.css';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#3c2f2f' }}>
        <div className="container">
          <span className="navbar-brand fw-bold fs-3" style={{ color: '#fff4e6' }}>
            🎬 Sakila Rentals
          </span>
          <div className="navbar-nav ms-auto">
            <Link 
              className="nav-link fs-5 mx-2" 
              to="/"
              style={{ color: '#fff4e6' }}
            >
              Home
            </Link>
            <Link 
              className="nav-link fs-5 mx-2" 
              to="/films"
              style={{ color: '#fff4e6' }}
            >
              Films
            </Link>
            <Link 
              className="nav-link fs-5 mx-2" 
              to="/customers"
              style={{ color: '#fff4e6' }}
            >
              Customers
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </Router>
  );
}

export default App;