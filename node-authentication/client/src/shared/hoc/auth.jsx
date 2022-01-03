/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../redux/_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
  // null: 아무나 출입 가능, true: 로그인한 유저만 출입 가능, false: 로그인한 유저는 출입 불가능

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        if (!response.payload.isAuth) {
          if (option) {
            navigate('/login');
          }
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            navigate('/');
          } else {
            if (option === false) navigate('/');
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }
  return <AuthenticationCheck />;
}
