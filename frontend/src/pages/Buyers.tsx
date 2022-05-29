import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import ContentWrapper from '../components/ContentWrapper';
import { accountState } from './../recoil/atoms';
import useContractActions from '../hooks/useContractActions';
import BuyersTable from './../components/BuyersTable';
import NotConnected from '../components/NotConnected';

function Buyers() {
  const [account] = useRecoilState(accountState);
  const { getAllBuyers } = useContractActions();

  useEffect(() => {
    const init = async () => {
      await getAllBuyers();
    };
    if (account) {
      init();
    }
  }, [account]);

  return (
    <ContentWrapper>
      {account ? <BuyersTable /> : <NotConnected />}
    </ContentWrapper>
  );
}

export default Buyers;
