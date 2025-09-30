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
    // Simulate success
    alert("✅ Successfully rented!");

    // Reset rent modal
    setRentFilmId(null);
    setCustomerId("");
  };

  return (
    <div className="container">
      <h1 className="page-title">🎥 All Films</h1>

      {/* Search bar */}
      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, genre, or actor"
        />
        <button onClick={() => loadFilms(1, query)}>Search</button>
        <button className="reset-btn" onClick={() => { setQuery(""); loadFilms(1); }}>
          Reset
        </button>
      </div>

      {/* Films table */}
      <table className="films-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film) => (
            <tr key={film.film_id}>
              <td>{film.film_id}</td>
              <td>{film.title}</td>
              <td>{film.category}</td>
              <td>{film.rating}</td>
              <td>
                <button onClick={() => loadFilmDetails(film.film_id)}>Details</button>
                <button onClick={() => setRentFilmId(film.film_id)}>Rent</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => loadFilms(page - 1, query)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => loadFilms(page + 1, query)}>
          Next
        </button>
      </div>

      {/* Film details modal */}
      <Modal isOpen={!!selectedFilm} onClose={() => setSelectedFilm(null)}>
        {selectedFilm && (
          <>
            <h3>{selectedFilm.title}</h3>
            <p>{selectedFilm.description}</p>
            <p><strong>Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Category:</strong> {selectedFilm.category}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Length:</strong> {selectedFilm.length} min</p>
          </>
        )}
      </Modal>

      {/* Rent modal */}
      <Modal isOpen={!!rentFilmId} onClose={() => setRentFilmId(null)}>
        <h3>Rent Film</h3>
        <p>Please enter your Customer ID to rent this film.</p>
        <input
          type="number"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Customer ID"
        />
        <br />
        <button onClick={rentFilm}>Confirm Rent</button>
      </Modal>
    </div>
  );
}

export default FilmsPage;
