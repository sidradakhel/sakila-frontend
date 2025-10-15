import { useEffect, useState } from "react";
import Modal from "../components/Modal";

function LandingPage() {
  const [films, setFilms] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<any | null>(null);
  const [selectedActor, setSelectedActor] = useState<any | null>(null);
  const [actorTopFilms, setActorTopFilms] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/landing/top-films")
      .then((res) => res.json())
      .then(setFilms);

    fetch("http://localhost:4000/api/landing/top-actors")
      .then((res) => res.json())
      .then(setActors);
  }, []);

  const loadFilmDetails = async (filmId: number) => {
    const res = await fetch(`http://localhost:4000/api/films/${filmId}`);
    const data = await res.json();
    setSelectedFilm(data);
  };

  const loadActorDetails = async (actorId: number) => {
    const res = await fetch(`http://localhost:4000/api/actors/${actorId}`);
    const actor = await res.json();
    setSelectedActor(actor);

    const res2 = await fetch(
      `http://localhost:4000/api/actors/${actorId}/top-rented`
    );
    const films = await res2.json();
    setActorTopFilms(films);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#fff4e6' }}>
          Welcome to Sakila Rentals
        </h1>
        <p className="lead fs-4" style={{ color: '#be9b7b' }}>
          Discover your next cinematic adventure in our curated collection
        </p>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-4 display-5" style={{ color: '#fff4e6' }}>
            Top 5 Films
          </h2>
          <div className="row g-4 justify-content-center">
            {films.map((film) => (
              <div key={film.film_id} className="col-md-6 col-lg-4 col-xl">
                <div 
                  className="card h-100 shadow border-0"
                  style={{ backgroundColor: '#fff4e6' }}
                >
                  <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title text-dark mb-3">{film.title}</h5>
                    <span 
                      className="badge mb-3 fs-6"
                      style={{ backgroundColor: '#854442', color: 'white' }}
                    >
                      {film.category}
                    </span>
                    <p className="text-muted small flex-grow-1">
                      {film.rental_count} rentals
                    </p>
                    <button 
                      className="btn mt-auto fw-bold"
                      style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
                      onClick={() => loadFilmDetails(film.film_id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4 display-5" style={{ color: '#fff4e6' }}>
            Top 5 Actors
          </h2>
          <div className="row g-4 justify-content-center">
            {actors.map((actor) => (
              <div key={actor.actor_id} className="col-md-6 col-lg-4 col-xl">
                <div 
                  className="card h-100 shadow border-0"
                  style={{ backgroundColor: '#fff4e6' }}
                >
                  <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title text-dark mb-3">
                      {actor.first_name} {actor.last_name}
                    </h5>
                    <p className="text-muted small flex-grow-1">
                      {actor.films_in_store} films in store
                    </p>
                    <button 
                      className="btn mt-auto fw-bold border-2"
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: '#854442', 
                        borderColor: '#854442' 
                      }}
                      onClick={() => loadActorDetails(actor.actor_id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedFilm} onClose={() => setSelectedFilm(null)}>
        {selectedFilm && (
          <div>
            <h3 className="text-dark mb-4">{selectedFilm.title}</h3>
            <p className="text-muted mb-3">{selectedFilm.description}</p>
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

      <Modal isOpen={!!selectedActor} onClose={() => setSelectedActor(null)}>
        {selectedActor && (
          <div>
            <h3 className="text-dark mb-3">
              {selectedActor.first_name} {selectedActor.last_name}
            </h3>
            <p className="text-muted mb-4">
              <strong style={{ color: '#854442' }}>Actor ID:</strong> {selectedActor.actor_id}
            </p>
            
            <h5 className="text-dark mb-3">Top Rented Films</h5>
            <div className="list-group">
              {actorTopFilms.map((film) => (
                <div 
                  key={film.film_id} 
                  className="list-group-item"
                  style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium text-dark">{film.title}</span>
                    <span 
                      className="badge"
                      style={{ backgroundColor: '#854442', color: 'white' }}
                    >
                      {film.rental_count} rentals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LandingPage;