import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components
import { NavBar, Footer } from '../components';

// pages
import { Main, Login, Register, NotFound } from '../pages';

// hoc
import Auth from '../shared/hoc/auth';

const Router = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/*' element={<NotFound />} />
        <Route path='/' element={Auth(Main, null)} />
        <Route path='/login' element={Auth(Login, false)} />
        <Route path='/register' element={Auth(Register, false)} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
