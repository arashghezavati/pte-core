import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Swt from '../components/writing/swt.tsx';
import We from '../components/writing/We.tsx';
import WritingMenu from '../menu/WritingMenu.tsx';

const WritingPage = () => {
  return (
    <div>
  
      <Routes>
        <Route path="swt" element={<Swt />} />
        <Route path="we" element={<We />} />
      </Routes>
    </div>
  );
};

export default WritingPage;
