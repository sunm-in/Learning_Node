import React from 'react';
import { Link } from 'react-router-dom';

const Test = () => {
  return (
    <div>
      <h1>Test !!</h1>

      <Link to='/home'>home</Link>
      <Link to='/about' style={{ margin: '0 3%' }}>
        about
      </Link>
      <Link to='/test'>test</Link>
    </div>
  );
};

export default Test;
