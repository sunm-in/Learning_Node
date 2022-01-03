import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/_actions/user_action';

import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const $Email = (event) => {
    setEmail(event.currentTarget.value);
  };

  const $Password = (event) => {
    setPassword(event.currentTarget.value);
  };

  const $Submit = (event) => {
    event.preventDefault();
    console.log('Email: ', Email);
    console.log('Password: ', Password);

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        navigate('/');
      } else {
        alert('Error');
      }
    });
  };

  const onChange = (e) => {
    console.log('Change:', e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        marginTop: '-10%',
      }}
    >
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={$Submit}>
        <label>Email</label>
        <input type='email' value={Email} onChange={$Email} />
        <br />

        <label>Password</label>
        <input type='password' value={Password} onChange={$Password} />
        <br />

        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
