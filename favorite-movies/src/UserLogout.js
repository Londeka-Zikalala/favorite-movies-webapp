import React from 'react';

const Logout = ({ handleLogout }) => {
  return (
    <div>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
