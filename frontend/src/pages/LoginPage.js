import React, { useState } from 'react';
import axios from 'axios';
export default function LoginPage({ onToken }){
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  async function requestOtp(){
    await axios.post(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/auth/request-otp`, { username });
    setOtpSent(true);
  }
  async function verify(){
    const resp = await axios.post(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/auth/verify-otp`, { username, otp });
    onToken(resp.data.token);
  }
  return (
    <div>
      <h3>Login</h3>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
      <button onClick={requestOtp}>Request OTP</button>
      {otpSent && (
        <div>
          <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="enter otp" />
          <button onClick={verify}>Verify</button>
        </div>
      )}
    </div>
  );
}
