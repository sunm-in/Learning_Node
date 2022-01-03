import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/_actions/user_action';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const $Email = (event) => {
    setEmail(event.currentTarget.value);
  };

  const $Name = (event) => {
    setName(event.currentTarget.value);
  };

  const $Password = (event) => {
    setPassword(event.currentTarget.value);
  };

  const $ConfirmPassword = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const $Submit = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) return alert('비밀번호를 확인해 주세요.');

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        navigate('/login');
      } else {
        alert('Failed to sign up');
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
        marginTop: '-10%',
      }}
    >
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={$Submit}>
        <label>Email</label>
        <input type='email' value={Email} onChange={$Email} />
        <br />

        <label>Name</label>
        <input type='text' value={Name} onChange={$Name} />
        <br />

        <label>Password</label>
        <input type='password' value={Password} onChange={$Password} />
        <br />

        <label>Confirm Password</label>
        <input type='password' value={ConfirmPassword} onChange={$ConfirmPassword} />
        <br />

        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
