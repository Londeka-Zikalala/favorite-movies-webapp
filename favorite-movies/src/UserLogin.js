import React, { useState } from "react";
import axios from "axios";

const LoginModal = ({ setIsLoggedIn, modalId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleClose = () => {
    document.getElementById(modalId).style.display = "none";
    setUsername("");
    setPassword("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async () => {
    const endpoint = isSignupMode ? "/signup" : "/login";
    try {
      const response = await axios.post(endpoint, { username, password });
      
      if (isSignupMode) {
        // Show success message and switch to login mode
        setSuccessMessage("Signup successful! Please log in.");
        setIsSignupMode(false);

        setUsername("");
        setPassword("");
      } else {
        // Handle successful login
        localStorage.setItem("userId", response.data.userId);
        setIsLoggedIn(true);
        handleClose();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Username not found. Please sign up.");
        setIsSignupMode(true);
      } else if (error.response?.status === 409) {
        setError("User already exists. Please log in.");
        setIsSignupMode(false);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div id={modalId} style={{ display: "none" }} className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isSignupMode ? "Sign Up" : "Login"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            <p>
              {isSignupMode
                ? "Don't have an account? Create one now."
                : ""}
            </p>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
            <br />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
            {error && <p className="text-danger mt-2">{error}</p>}
            <p className="mt-2">
              {isSignupMode
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                className="btn btn-link"
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  // Clear error when switching modes
                  setError(null); 
                }}
              >
                {isSignupMode ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {isSignupMode ? "Sign Up" : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
