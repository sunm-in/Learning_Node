import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components
import { NavBar, Footer } from '../components';

// pages
import { Main, Login, Register, NotFound } from '../pages';

const Router = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/*' element={<NotFound />} />
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
