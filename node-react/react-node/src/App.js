import React from 'react';
import { Link } from 'react-router-dom';

// page

function App() {
  return (
    <>
      <div style={{ width: '400px', margin: '5% auto', textAlign: 'center' }}>
        <Link to='/home'>home</Link>
        <Link to='/about' style={{ margin: '0 3%' }}>
          about
        </Link>
        <Link to='/test'>test</Link>
      </div>
    </>
  );
}

export default App;
