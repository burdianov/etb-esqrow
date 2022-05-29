import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import { useRecoilState } from 'recoil';

import Escrow from '../artifacts/contracts/EscrowAgency.sol/EscrowAgency.json';

import { accountState } from '../recoil/atoms';

function useEthereum() {
  const [account, setAccount] = useRecoilState(accountState);

  const connectWallet = async () => {
    try {
      // @ts-ignore
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      // @ts-ignore
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnection = async () => {
    // @ts-ignore
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const getContract = async () =>
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

  const setListeners = () => {
    // @ts-ignore
    if (ethereum) {
      // @ts-ignore
      ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
      // @ts-ignore
      ethereum.on('connect', (accounts) => {
        setAccount(accounts[0]);
      });
      // @ts-ignore
      ethereum.on('disconnect', () => {
        setAccount(null);
      });
    }
  };

  const removeListeners = () => {
    // @ts-ignore
    if (ethereum) {
      // @ts-ignore
      ethereum.removeListener('accountsChanged', () => {
        setAccount(null);
      });
      // @ts-ignore
      ethereum.removeListener('connect', () => {
        setAccount(null);
      });
      // @ts-ignore
      ethereum.removeListener('disconnect', () => {
        setAccount(null);
      });
    }
  };

  return {
    connectWallet,
    checkConnection,
    getContract,
    setListeners,
    removeListeners
  };
}

export default useEthereum;
