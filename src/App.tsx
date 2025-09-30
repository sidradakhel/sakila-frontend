import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FilmsPage from "./pages/FilmsPage";
import './App.css';


function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Landing</Link>
          <Link to="/films">Films</Link>
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/films" element={<FilmsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

