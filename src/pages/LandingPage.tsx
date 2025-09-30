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
    <div className="container">
      <h1 className="page-title"> Welcome to Sakila Rentals 🎬 </h1>

      {/* Top Films */}
      <h2 className="section-title">Top 5 Films</h2>
<div className="horizontal-list">
  {films.map((f) => (
    <div key={f.film_id} className="film-card">
      <h3>{f.title}</h3>
      <p>{f.category}</p>
      <button className="details" onClick={() => loadFilmDetails(f.film_id)}>
        Details
      </button>
    </div>
  ))}
</div>

<h2 className="section-title">Top 5 Actors</h2>
<div className="horizontal-list">
  {actors.map((a) => (
    <div key={a.actor_id} className="film-card">
      <h3>{a.first_name} {a.last_name}</h3>
      <button className="details" onClick={() => loadActorDetails(a.actor_id)}>
        Details
      </button>
    </div>
  ))}
</div>


      {/* Film Modal */}
      <Modal isOpen={!!selectedFilm} onClose={() => setSelectedFilm(null)}>
        {selectedFilm && (
          <>
            <h3>{selectedFilm.title}</h3>
            <p>{selectedFilm.description}</p>
            <p>
              <strong>Year:</strong> {selectedFilm.release_year}
            </p>
            <p>
              <strong>Category:</strong> {selectedFilm.category}
            </p>
            <p>
              <strong>Rating:</strong> {selectedFilm.rating}
            </p>
          </>
        )}
      </Modal>

      {/* Actor Modal */}
      <Modal isOpen={!!selectedActor} onClose={() => setSelectedActor(null)}>
  {selectedActor && (
    <>
      <h3>
        {selectedActor.first_name} {selectedActor.last_name}
      </h3>
      <p><strong>Actor ID:</strong> {selectedActor.actor_id}</p>
      <p><strong>Total Films:</strong> {selectedActor.total_films}</p>

      <h4>🎬 Top 5 Rented Films</h4>
      <ul>
        {actorTopFilms.map((f) => (
          <li key={f.film_id}>
            {f.title} ({f.rental_count} rentals)
          </li>
        ))}
      </ul>
    </>
  )}
</Modal>

    </div>
  );
}

export default LandingPage;
