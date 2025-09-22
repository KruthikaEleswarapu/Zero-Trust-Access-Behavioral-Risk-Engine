import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
function App(){
  const [token, setToken] = useState(null);
  return (
    <div style={{padding:20}}>
      {!token ? <LoginPage onToken={setToken} /> : <Dashboard onLogout={()=>setToken(null)} />}
    </div>
  );
}
export default App;
