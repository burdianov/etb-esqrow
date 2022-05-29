import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import ContentWrapper from '../components/ContentWrapper';
import { accountState } from './../recoil/atoms';
import useContractActions from '../hooks/useContractActions';
import SellersTable from '../components/SellersTable';
import NotConnected from './../components/NotConnected';

function Sellers() {
  const [account] = useRecoilState(accountState);
  const { getAllSellers } = useContractActions();

  useEffect(() => {
    const init = async () => {
      await getAllSellers();
    };
    if (account) {
      init();
    }
  }, [account]);

  return (
    <ContentWrapper>
      {account ? <SellersTable /> : <NotConnected />}
    </ContentWrapper>
  );
}

export default Sellers;
