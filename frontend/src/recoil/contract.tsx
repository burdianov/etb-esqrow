import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';

import Escrow from '../artifacts/contracts/EscrowAgency.sol/EscrowAgency.json';

const getContract = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if (provider) {
      // @ts-ignore
      await provider.request({ method: 'eth_requestAccounts' });
      // @ts-ignore
      provider = new ethers.providers.Web3Provider(provider);
      // @ts-ignore
      const signer = provider.getSigner();

      const escrowContract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        Escrow.abi,
        signer
      );
      resolve({ escrowContract });
      return;
    }
    reject('Install Metamask');
  });

export default getContract;
