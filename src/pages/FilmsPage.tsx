import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function FilmsPage() {
  const [films, setFilms] = useState<any[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");

  // Rent modal state
  const [rentFilmId, setRentFilmId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState("");

  const loadFilms = async (page: number, query: string = "") => {
    let url = `http://localhost:4000/api/films?page=${page}&pageSize=${pageSize}`;
    if (query.trim()) {
      url = `http://localhost:4000/api/films/search?q=${encodeURIComponent(
        query
      )}&page=${page}&pageSize=${pageSize}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setFilms(data.results);
    setTotal(data.total || 0);
    setPage(data.page || 1);
  };

  useEffect(() => {
    loadFilms(1);
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const loadFilmDetails = async (filmId: number) => {
    const res = await fetch(`http://localhost:4000/api/films/${filmId}`);
    const data = await res.json();
    setSelectedFilm(data);
  };

  const rentFilm = async () => {
    if (!customerId) {
      alert("❌ Please enter a Customer ID first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          film_id: rentFilmId,
          customer_id: Number(customerId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.error || "Failed to rent film"}`);
      } else {
        alert(`✅ Film rented successfully!`);
      }
    } catch (err) {
      console.error("Failed to rent film:", err);
      alert("❌ Error renting film.");
    }

    // Reset rent modal
    setRentFilmId(null);
    setCustomerId("");
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 display-4 fw-bold" style={{ color: '#fff4e6' }}>
        All Films
      </h1>

      {/* Search bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, genre, or actor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
            />
            <button 
              className="btn fw-bold"
              style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
              onClick={() => loadFilms(1, query)}
            >
              Search
            </button>
            <button 
              className="btn fw-bold"
              style={{ backgroundColor: '#854442', color: 'white' }}
              onClick={() => { setQuery(""); loadFilms(1); }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Films table */}
      <div className="table-responsive">
        <table className="table table-hover table-borderless">
          <thead>
            <tr style={{ backgroundColor: '#fff4e6', color: '#3c2f2f' }}>
              <th className="ps-3">ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Rating</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {films.map((film) => (
              <tr 
                key={film.film_id}
                style={{ backgroundColor: '#fff4e6' }}
              >
                <td className="ps-3 fw-bold text-dark">{film.film_id}</td>
                <td className="fw-medium text-dark">{film.title}</td>
                <td>
                  <span 
                    className="badge"
                    style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
                  >
                    {film.category}
                  </span>
                </td>
                <td>
                  <span 
                    className="badge"
                    style={{ backgroundColor: '#3c2f2f', color: '#fff4e6' }}
                  >
                    {film.rating}
                  </span>
                </td>
                <td className="text-center">
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-sm fw-bold me-1"
                      style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
                      onClick={() => loadFilmDetails(film.film_id)}
                    >
                      Details
                    </button>
                    <button 
                      className="btn btn-sm fw-bold"
                      style={{ backgroundColor: '#854442', color: 'white' }}
                      onClick={() => setRentFilmId(film.film_id)}
                    >
                      Rent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div style={{ color: '#fff4e6' }}>
          Showing page {page} of {totalPages}
        </div>
        <div className="btn-group">
          <button 
            className="btn fw-bold"
            style={{ 
              backgroundColor: page === 1 ? '#be9b7b' : '#854442', 
              color: 'white',
              opacity: page === 1 ? 0.6 : 1
            }}
            disabled={page === 1}
            onClick={() => loadFilms(page - 1, query)}
          >
            Previous
          </button>
          <button 
            className="btn fw-bold"
            style={{ 
              backgroundColor: page === totalPages ? '#be9b7b' : '#854442', 
              color: 'white',
              opacity: page === totalPages ? 0.6 : 1
            }}
            disabled={page === totalPages}
            onClick={() => loadFilms(page + 1, query)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Film details modal */}
      <Modal isOpen={!!selectedFilm} onClose={() => setSelectedFilm(null)}>
        {selectedFilm && (
          <div>
            <h3 className="text-dark mb-3">{selectedFilm.title}</h3>
            <p className="text-muted">{selectedFilm.description}</p>
            <div className="row mt-3">
              <div className="col-md-6 mb-2">
                <strong style={{ color: '#854442' }}>Year:</strong> {selectedFilm.release_year}
              </div>
              <div className="col-md-6 mb-2">
                <strong style={{ color: '#854442' }}>Category:</strong> {selectedFilm.category}
              </div>
              <div className="col-md-6 mb-2">
                <strong style={{ color: '#854442' }}>Rating:</strong> {selectedFilm.rating}
              </div>
              <div className="col-md-6 mb-2">
                <strong style={{ color: '#854442' }}>Length:</strong> {selectedFilm.length} min
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Rent modal */}
      <Modal isOpen={!!rentFilmId} onClose={() => setRentFilmId(null)}>
        <div>
          <h3 className="text-dark mb-3">Rent Film</h3>
          <p className="text-muted mb-3">Please enter your Customer ID to rent this film.</p>
          <input
            type="number"
            className="form-control mb-3"
            style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Customer ID"
          />
          <div className="text-end">
            <button 
              className="btn fw-bold"
              style={{ backgroundColor: '#854442', color: 'white' }}
              onClick={rentFilm}
            >
              Confirm Rent
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FilmsPage;