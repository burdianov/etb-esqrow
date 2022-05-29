import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BigNumber, utils } from 'ethers';
import { useRecoilState } from 'recoil';
import { format, fromUnixTime } from 'date-fns';

import ContentWrapper from '../components/ContentWrapper';

import {
  currentEscrowState,
  accountState,
  confirmDeliveryLoadingState,
  withdrawValueLoadingState
} from './../recoil/atoms';
import useContractActions from './../hooks/useContractActions';
import { getStatus, EscrowStatus } from './../utils';
import { spinner } from '../components/Button';

function EscrowDetails() {
  const { id } = useParams();
  const { getEscrowById, confirmDelivery, sellerWithdraw, buyerWithdraw } =
    useContractActions();
  const [account] = useRecoilState(accountState);

  const [escrow] = useRecoilState(currentEscrowState);
  const [deliveryLoading] = useRecoilState(confirmDeliveryLoadingState);
  const [withdrawLoading] = useRecoilState(withdrawValueLoadingState);

  useEffect(() => {
    const init = async () => {
      if (id) {
        await getEscrowById(id);
      }
    };
    init();
  }, [id]);

  const handleConfirmDelivery = () => {
    if (id) {
      confirmDelivery(id);
    }
  };

  const handleWithdrawValue = () => {
    // @ts-ignore
    if (escrow.seller?.toLowerCase() === account.toLowerCase()) {
      if (id) {
        sellerWithdraw(id);
      }
    }
    // @ts-ignore
    if (escrow.buyer?.toLowerCase() === account.toLowerCase()) {
      if (id) {
        buyerWithdraw(id);
      }
    }
  };

  return (
    <ContentWrapper>
      {escrow ? (
        <div className='container mx-auto p-8 sm:px-8 max-w-7xl'>
          <article className='max-w-xl mx-auto shadow-xl border rounded-lg px-8 py-6'>
            <h1 className='text-center font-semibold text-xl border-b-[1px] pb-2'>
              Escrow Details
            </h1>
            <div className='mt-2'>
              <label className='w-full font-thin'>ID</label>
              <p className='w-full font-semibold'>
                {
                  // @ts-ignore
                  BigNumber.from(escrow.id).toString()
                }
              </p>
            </div>
            <div className='mt-4'>
              <label className='w-full font-thin'>
                Seller{' '}
                {
                  // @ts-ignore
                  escrow.seller?.toLowerCase() === account.toLowerCase() &&
                    '(me)'
                }
              </label>
              <p className='w-full font-semibold'>
                {
                  // @ts-ignore
                  escrow.seller
                }
              </p>
            </div>
            <div className='mt-4'>
              <label className='w-full font-thin'>
                Buyer{' '}
                {
                  // @ts-ignore
                  escrow.buyer.toLowerCase() === account.toLowerCase() && '(me)'
                }
              </label>
              <p className='w-full font-semibold'>
                {
                  // @ts-ignore
                  escrow.buyer
                }
              </p>
            </div>
            <div className='mt-4'>
              <label className='w-full font-thin'>Value</label>
              <p className='w-full font-semibold'>
                {utils.formatEther(
                  BigNumber.from(
                    // @ts-ignore
                    escrow.value
                  ).toString()
                )}
              </p>
            </div>
            <div className='mt-4'>
              <label className='w-full font-thin'>Expiry</label>
              <p className='w-full font-semibold'>
                {format(
                  new Date(
                    fromUnixTime(
                      parseInt(
                        BigNumber.from(
                          // @ts-ignore
                          escrow.expiryTime
                        ).toString()
                      )
                    )
                  ),
                  'dd-MMM-yyyy'
                )}
              </p>
            </div>
            <div className='mt-4'>
              <label className='w-full font-thin'>Status</label>
              <p className='w-full font-semibold'>
                {
                  // @ts-ignore
                  getStatus(escrow.status.toString())
                }
              </p>
            </div>
            <div className='flex mt-4 pt-4 border-t-[1px] justify-around'>
              <button
                type='button'
                onClick={handleConfirmDelivery}
                className='py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:bg-green-400 disabled:cursor-not-allowed'
                disabled={
                  deliveryLoading ||
                  // @ts-ignore
                  escrow.buyer.toLowerCase() !== account.toLowerCase() ||
                  // @ts-ignore
                  escrow.status.toString() !==
                    EscrowStatus.AWAITING_DELIVERY.toString()
                }
              >
                {deliveryLoading && spinner}
                {deliveryLoading ? ' processing...' : 'Confirm Delivery'}
              </button>
              <button
                type='button'
                onClick={handleWithdrawValue}
                className='py-2 px-4 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:bg-blue-400 disabled:cursor-not-allowed'
                disabled={
                  // @ts-ignore
                  (escrow.buyer.toLowerCase() === account.toLowerCase() &&
                    // @ts-ignore
                    escrow.status.toString() !==
                      EscrowStatus.AWAITING_DELIVERY.toString()) ||
                  // @ts-ignore
                  (escrow.seller.toLowerCase() === account.toLowerCase() &&
                    // @ts-ignore
                    escrow.status.toString() !==
                      EscrowStatus.DELIVERED.toString())
                }
              >
                {withdrawLoading && spinner}
                {withdrawLoading ? ' processing...' : 'Withdraw Value'}
              </button>
            </div>
          </article>
        </div>
      ) : (
        <div className='flex w-full h-full flex-col justify-center items-center font-bold text-4xl'>
          Access Denied
        </div>
      )}
    </ContentWrapper>
  );
}

export default EscrowDetails;
