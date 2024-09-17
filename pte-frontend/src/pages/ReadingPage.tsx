import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Rwfib from '../components/reading/Rwfib.tsx';
import Mcma from '../components/reading/Mcma.tsx';
import Mcaa from '../components/reading/Mcaa.tsx';
import Rfib from '../components/reading/Rfib.tsx';
import Rop from '../components/reading/Rop.tsx';


const ReadingPage = () => {
  return (
    <div>
      <div className="sst-page">
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">PTE Practice</a>
      </div>
      <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <ul className="nav-menu">
        <li><a href="#speaking">Speaking</a></li>
        <li><a href="#writing">Writing</a></li>
        <li><a href="#listening">Listening</a></li>
        <li><a href="#reading">Reading</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </nav>
      {/* <ReadingMenu /> */}
      <Routes>
        <Route path="rwfib" element={<Rwfib />} />
        <Route path="mcma" element={<Mcma />} />
        <Route path="mcaa" element={<Mcaa />} />
        <Route path="rfib" element={<Rfib />} />
        <Route path="rop" element={<Rop />} />
      </Routes>
    </div>
    </div>
  );
};

export default ReadingPage;
