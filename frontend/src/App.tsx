import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Layout from './components/Layout';
import useEthereum from './hooks/useEthereum';
import Buyers from './pages/Buyers';
import InitiateEscrow from './pages/InitiateEscrow';
import Escrows from './pages/Escrows';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import RegisterSeller from './pages/RegisterSeller';
import Sellers from './pages/Sellers';
import Services from './pages/Services';
import RegisterBuyer from './pages/RegisterBuyer';
import EscrowDetails from './pages/EscrowDetails';

function App() {
  const location = useLocation();
  const { checkConnection, setListeners, removeListeners } = useEthereum();

  useEffect(() => {
    checkConnection();

    setListeners();

    return () => {
      removeListeners();
    };
  }, []);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='sellers/create' element={<RegisterSeller />} />
        <Route path='sellers' element={<Sellers />} />
        <Route path='buyers/create' element={<RegisterBuyer />} />
        <Route path='buyers' element={<Buyers />} />
        <Route path='escrows' element={<Escrows />} />
        <Route path='escrows/create' element={<InitiateEscrow />} />
        <Route path='/escrows/:id' element={<EscrowDetails />} />
        <Route path='services' element={<Services />} />

        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
