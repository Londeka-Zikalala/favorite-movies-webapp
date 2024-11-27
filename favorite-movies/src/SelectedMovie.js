import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const SelectedMovie = ({ movie, onFavoriteToggle }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      {/* Movie Card */}
      <Card
        className="h-100 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={handleModalOpen}
      >
        <Card.Img
          variant="top"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Button
            variant="outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(movie);
            }}
          >
            {movie.isFavorite ? '💔 Remove' : '❤️ Add'}
          </Button>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Movie Poster */}
          <div className="text-center mb-3">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="img-fluid"
            />
          </div>
          {/* Movie Details */}
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectedMovie;

