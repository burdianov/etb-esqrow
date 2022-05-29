import { getContract } from './contracts';

export const getAllSellers = async () => {
  const { escrowContract } = await getContract();
  return await escrowContract.getAllSellers();
};

export const registerSeller = async (name: string, email: string) => {
  const { escrowContract } = await getContract();
  return await escrowContract.registerSeller(name, email);
};

export const getAllBuyers = async () => {
  const { escrowContract } = await getContract();
  return await escrowContract.getAllBuyers();
};

export const registerBuyer = async (name: string, email: string) => {
  const { escrowContract } = await getContract();
  return await escrowContract.registerBuyer(name, email);
};

export const initiateEscrow = async (
  seller: string,
  expiryTime: number,
  value: number
) => {
  const { escrowContract } = await getContract();
  return await escrowContract.initiateEscrow(seller, expiryTime, {
    value
  });
};

export const getEscrowsByBuyer = async (buyer: string) => {
  const { escrowContract } = await getContract();
  return await escrowContract.getEscrowsByBuyer(buyer);
};
