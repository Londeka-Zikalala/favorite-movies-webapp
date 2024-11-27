import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios'

const SignupModal = ({ setIsLoggedIn }) => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/signup', { username, password });
      setIsLoggedIn(true);
      setShow(false);
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>Sign Up</Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignup}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {error && <div className="text-danger mt-2">{error}</div>}
            <Button type="submit" variant="success" className="mt-3">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignupModal;
