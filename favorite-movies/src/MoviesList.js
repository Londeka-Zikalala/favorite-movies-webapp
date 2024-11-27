import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SelectedMovie from './SelectedMovie';

const MovieList = ({ movies, onFavoriteToggle, onMovieClick }) => (
  <Container className="movie-list mt-4">
    <Row className="g-4">
      {movies.map((movie) => (
        <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
          <SelectedMovie
            movie={movie}
            onFavoriteToggle={onFavoriteToggle}
            onMovieClick={onMovieClick}
          />
        </Col>
      ))}
    </Row>
  </Container>
);

export default MovieList;
