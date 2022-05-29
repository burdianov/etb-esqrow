import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import { useRecoilState } from 'recoil';

import Escrow from '../artifacts/contracts/EscrowAgency.sol/EscrowAgency.json';

import { accountState, chainIdState } from '../recoil/atoms';

function useEthereum() {
  const [account, setAccount] = useRecoilState(accountState);
  const [chainId, setChainId] = useRecoilState(chainIdState);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnection = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const getContract = async () =>
    new Promise(async (resolve, reject) => {
      let provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(provider);
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
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
      ethereum.on('connect', (accounts) => {
        setAccount(accounts[0]);
      });
      ethereum.on('disconnect', () => {
        setAccount(null);
      });
    }
  };

  const removeListeners = () => {
    if (ethereum) {
      ethereum.removeListener('accountsChanged', () => {
        setAccount(null);
      });
      ethereum.removeListener('connect', () => {
        setAccount(null);
      });
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
