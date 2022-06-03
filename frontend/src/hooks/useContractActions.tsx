import { utils, BigNumber } from 'ethers';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import {
  accountState,
  buyersLoadingState,
  buyersState,
  confirmDeliveryLoadingState,
  currentEscrowState,
  sellersLoadingState,
  sellersState,
  withdrawValueLoadingState
} from '../recoil/atoms';

import {
  escrowsState,
  escrowsLoadingState,
  commissionState
} from './../recoil/atoms';
import useEthereum from './useEthereum';

function useContractActions() {
  const { getContract } = useEthereum();

  const [sellers, setSellers] = useRecoilState(sellersState);
  const [buyers, setBuyers] = useRecoilState(buyersState);
  const [escrows, setEscrows] = useRecoilState(escrowsState);
  const [account] = useRecoilState(accountState);
  const [commission, setCommission] = useRecoilState(commissionState);
  const [currentEscrow, setCurrentEscrow] = useRecoilState(currentEscrowState);

  const [createSellerLoading, setCreateSellerLoading] =
    useRecoilState(sellersLoadingState);
  const [createBuyerLoading, setCreateBuyerLoading] =
    useRecoilState(buyersLoadingState);
  const [initiateEscrowLoading, setInitiateEscrowLoading] =
    useRecoilState(escrowsLoadingState);
  const [confirmDeliveryLoading, setConfirmDeliveryLoading] = useRecoilState(
    confirmDeliveryLoadingState
  );
  const [withdrawLoading, setWithdrawLoading] = useRecoilState(
    withdrawValueLoadingState
  );

  const getAllSellers = async () => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const sellers = await escrowContract.getAllSellers();
    setSellers(sellers);
  };

  const getAllBuyers = async () => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const buyers = await escrowContract.getAllBuyers();
    setBuyers(buyers);
  };

  const registerSeller = async (name: string, email: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const tx = await escrowContract.registerSeller(name, email);

    setCreateSellerLoading(true);
    await tx.wait();
    setCreateSellerLoading(false);

    toast('Seller registered successfully!', {
      autoClose: 1000,
      type: 'success'
    });

    await getAllSellers();
  };

  const registerBuyer = async (name: string, email: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const tx = await escrowContract.registerBuyer(name, email);

    setCreateBuyerLoading(true);
    await tx.wait();
    setCreateBuyerLoading(false);

    toast('Buyer registered successfully!', {
      autoClose: 1000,
      type: 'success'
    });

    await getAllBuyers();
  };

  const initiateEscrow = async (
    seller: string,
    expiryTime: number,
    value: number
  ) => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const tx = await escrowContract.initiateEscrow(seller, expiryTime, {
      value: utils.parseEther(value.toString())
    });

    setInitiateEscrowLoading(true);
    await tx.wait();
    setInitiateEscrowLoading(false);

    toast('Escrow initiated successfully!', {
      autoClose: 1000,
      type: 'success'
    });
    // @ts-ignore
    await getEscrowsByBuyer(account);
  };

  const getEscrowsByBuyer = async (buyer: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const escrows = await escrowContract.getEscrowsByBuyer(buyer);
    setEscrows(escrows);
  };

  const getEscrowsBySeller = async (seller: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();
    const escrows = await escrowContract.getEscrowsByBuyer(seller);
    setEscrows(escrows);
  };

  const getCommission = async () => {
    // @ts-ignore
    const { escrowContract } = await getContract();

    const commission = await escrowContract.commission();
    setCommission(parseInt(BigNumber.from(commission).toString()));
  };

  const getEscrowById = async (escrowId: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();

    const escrow = await escrowContract.getEscrowById(escrowId);
    setCurrentEscrow(escrow);
  };

  const confirmDelivery = async (escrowId: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();

    const tx = await escrowContract.confirmDelivery(escrowId);

    setConfirmDeliveryLoading(true);
    await tx.wait();
    setConfirmDeliveryLoading(false);

    const escrow = await escrowContract.getEscrowById(escrowId);
    setCurrentEscrow(escrow);
  };

  const buyerWithdraw = async (escrowId: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();

    const tx = await escrowContract.buyerWithdraw(escrowId);

    setWithdrawLoading(true);
    await tx.wait();
    setWithdrawLoading(false);

    const escrow = await escrowContract.getEscrowById(escrowId);
    setCurrentEscrow(escrow);
  };

  const sellerWithdraw = async (escrowId: string) => {
    // @ts-ignore
    const { escrowContract } = await getContract();

    const tx = await escrowContract.sellerWithdraw(escrowId);

    setWithdrawLoading(true);
    await tx.wait();
    setWithdrawLoading(false);

    const escrow = await escrowContract.getEscrowById(escrowId);
    setCurrentEscrow(escrow);
  };

  return {
    getAllSellers,
    getAllBuyers,
    registerSeller,
    registerBuyer,
    initiateEscrow,
    getEscrowsByBuyer,
    getEscrowsBySeller,
    getCommission,
    getEscrowById,
    confirmDelivery,
    buyerWithdraw,
    sellerWithdraw
  };
}

export default useContractActions;
