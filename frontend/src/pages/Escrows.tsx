import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import ContentWrapper from '../components/ContentWrapper';
import { accountState } from './../recoil/atoms';
import useContractActions from '../hooks/useContractActions';
import EscrowsTable from './../components/EscrowsTable';
import NotConnected from './../components/NotConnected';

function Escrows() {
  const [account] = useRecoilState(accountState);
  const { getEscrowsByBuyer } = useContractActions();

  useEffect(() => {
    const init = async () => {
      // @ts-ignore
      await getEscrowsByBuyer(account);
    };
    if (account) {
      init();
    }
  }, [account]);

  return (
    <ContentWrapper>
      {account ? <EscrowsTable /> : <NotConnected />}
    </ContentWrapper>
  );
}

export default Escrows;
