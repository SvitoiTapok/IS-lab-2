import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
        .then(res => res.text())
        .then(data => {
          setMessage(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setMessage('Failed to connect to backend');
          setLoading(false);
        });
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1>Spring Boot + React (Simplified)</h1>
          {loading ? (
              <p>Loading...</p>
          ) : (
              <p>Backend says: <strong>{message}</strong></p>
          )}
          <div>
            <p>Frontend: http://localhost:3000</p>
            <p>Backend: http://localhost:8080</p>
          </div>
        </header>
      </div>
  );
}

export default App;