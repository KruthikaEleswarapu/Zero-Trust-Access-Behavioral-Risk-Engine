import React from 'react';
export default function Dashboard({ onLogout }){
  return (
    <div>
      <h2>Welcome to ZTAE Dashboard</h2>
      <p>Your session is being monitored for anomalous behavior.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
