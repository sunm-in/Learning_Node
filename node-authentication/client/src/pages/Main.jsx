import React, { useEffect } from 'react';
import axios from 'axios';
const Main = () => {
  useEffect(() => {
    axios.get('/api/hello').then((res) => console.log(res.data));
  }, []);

  return (
    <>
      <h1>Main!!!!</h1>
    </>
  );
};

export default Main;
