import { Buyer } from '../recoil/atoms';
import { Seller } from './../recoil/atoms';

export const shortenAddress = (address: string | undefined) =>
  `${address?.slice(0, 5)}...${address?.slice(address.length - 4)}`;

export enum EscrowStatus {
  AWAITING_DELIVERY,
  CANCELLED,
  DELIVERED,
  COMPLETE
}

export const getStatus = (stringStatus: string) => {
  const status = parseInt(stringStatus);
  let response: string;

  switch (status) {
    case EscrowStatus.AWAITING_DELIVERY:
      response = 'AWAITING DELIVERY';
      break;
    case EscrowStatus.CANCELLED:
      response = 'CANCELLED';
      break;
    case EscrowStatus.DELIVERED:
      response = 'DELIVERED';
      break;
    case EscrowStatus.COMPLETE:
      response = 'COMPLETE';
      break;
    default:
      response = '';
      break;
  }

  return response;
};

export const inArray = (address: string, collection: Seller[] | Buyer[]) => {
  let found = false;

  for (let i = 0; i < collection.length; i++) {
    if (collection[i].id.toLocaleLowerCase() === address.toLowerCase()) {
      found = true;
      break;
    }
  }

  return found;
};

export const chainIdToNetwork = (chainId: number) => {
  let network = '';

  console.log({ chainId });

  switch (chainId) {
    case 31337:
      network = 'Hardhat';
      break;
    case 4:
      network = 'Rinkeby';
      break;
    default:
      network = 'Switch to Rinkeby';
      break;
  }

  return network;
};
