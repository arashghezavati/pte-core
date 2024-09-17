import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sst from '../components/listening/Sst.tsx';
import Mc from '../components/listening/Mc.tsx';
import Lfib from '../components/listening/Lfib.tsx';
import Hcs from '../components/listening/Hcs.tsx';
import Csa from '../components/listening/Csa.tsx';
import Smw from '../components/listening/Smw.tsx';
import Wfd from '../components/listening/Wfd.tsx';
import Hiw from '../components/listening/Hiw.tsx';
import ListeningMenu from '../menu/ListeningMenu.tsx';

const ListeningPage = () => {
  return (
    <div>
      {/* <ListeningMenu /> */}
      <Routes>
        <Route path="sst" element={<Sst />} />
        <Route path="mc" element={<Mc />} />
        <Route path="lfib" element={<Lfib />} />
        <Route path="hcs" element={<Hcs />} />
        <Route path="csa" element={<Csa />} />
        <Route path="smw" element={<Smw />} />
        <Route path="wfd" element={<Wfd />} />
        <Route path="hiw" element={<Hiw />} />
      </Routes>
    </div>
  );
};

export default ListeningPage;
