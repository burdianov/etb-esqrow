import { atom } from 'recoil';

export interface Seller {
  id: string;
  name: string;
  email: string;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
}

export enum EscrowStatus {
  AWAITING_DELIVERY,
  CANCELLED,
  DELIVERED,
  COMPLETE
}

export interface Escrow {
  id: number;
  seller: string;
  buyer: string;
  value: number;
  createdAt: number;
  expiryTime: number;
  status: EscrowStatus;
}

export const sellersState = atom({
  key: 'sellersState',
  default: [] as Seller[]
});

export const sellersLoadingState = atom({
  key: 'sellersLoadingState',
  default: false
});

export const buyersState = atom({
  key: 'buyersState',
  default: [] as Buyer[]
});

export const buyersLoadingState = atom({
  key: 'buyersLoadingState',
  default: false
});

export const confirmDeliveryLoadingState = atom({
  key: 'confirmDeliveryLoadingState',
  default: false
});

export const withdrawValueLoadingState = atom({
  key: 'withdrawValueLoadingState',
  default: false
});

export const accountState = atom({
  key: 'accountState',
  default: null
});

export const escrowsState = atom({
  key: 'escrowsState',
  default: [] as Escrow[]
});

export const currentEscrowState = atom({
  key: 'currentEscrowState',
  default: null
});

export const escrowsLoadingState = atom({
  key: 'escrowsLoadingState',
  default: false
});

export const commissionState = atom({
  key: 'commissionState',
  default: 0
});
