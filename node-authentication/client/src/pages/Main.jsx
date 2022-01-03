import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Main = () => {
  const naivgate = useNavigate();
  useEffect(() => {
    axios.get('/api/hello').then((res) => console.log(res.data));
  }, []);

  const $logOut = () => {
    axios.get('/api/users/logout').then((res) => {
      if (res.data.success) {
        naivgate('/login');
      } else {
        alert('페이지에 문제가 발생했습니다.');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h1>Main</h1>
      <button onClick={$logOut}>로그아웃</button>
    </div>
  );
};

export default Main;
