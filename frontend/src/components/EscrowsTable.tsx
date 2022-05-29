import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { format, fromUnixTime } from 'date-fns';

import { escrowsState } from '../recoil/atoms';
import { accountState, buyersState } from './../recoil/atoms';
import { BigNumber, utils } from 'ethers';
import { getStatus, inArray } from '../utils';

function EscrowsTable() {
  const [escrows] = useRecoilState(escrowsState);
  const [buyers] = useRecoilState(buyersState);
  const [account] = useRecoilState(accountState);

  return (
    <div className='container mx-auto px-4 sm:px-8 max-w-7xl'>
      <div className='py-8'>
        <div className='flex justify-between'>
          <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
            My Escrows{' '}
            <span className='font-light normal-case text-md'>
              (click on status to view escrow details)
            </span>
          </h2>
          {account && inArray(account, buyers) && (
            <Link
              to='create'
              className='text-indigo-600 hover:text-indigo-800 transaction duration-75'
            >
              Add Escrow
            </Link>
          )}
        </div>
        <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
          <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
            <table className='min-w-full leading-normal'>
              <thead>
                <tr className='font-bold'>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800 text-left text-sm uppercase'
                  >
                    #
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800 text-left text-sm uppercase'
                  >
                    Second Party
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    Value (ETH)
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    Expiry
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    My Role
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {escrows.map((escrow) => (
                  <tr key={escrow.id} className='text-gray-500'>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap rounded-full'>
                        {BigNumber.from(escrow.id).toString()}
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <div className='flex items-center'>
                        <div className=''>
                          <p className='text-gray-900 whitespace-no-wrap'>
                            <a
                              className='hover:text-purple-800 transition duration-100'
                              href={`https://rinkeby.etherscan.io/address/${escrow.seller}`}
                              target='_blank'
                            >
                              {escrow.buyer.toLowerCase() ===
                              // @ts-ignore
                              account.toLowerCase()
                                ? escrow.seller
                                : escrow.buyer}
                            </a>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        {utils.formatEther(
                          BigNumber.from(escrow.value).toString()
                        )}
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        {format(
                          new Date(
                            fromUnixTime(
                              parseInt(
                                BigNumber.from(escrow.expiryTime).toString()
                              )
                            )
                          ),
                          'dd-MMM-yyyy'
                        )}
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        {escrow.buyer.toLowerCase() ===
                        // @ts-ignore
                        account.toLowerCase()
                          ? 'Buyer'
                          : 'Seller'}
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        <Link
                          className='hover:text-indigo-500'
                          to={BigNumber.from(escrow.id).toString()}
                        >
                          {getStatus(escrow.status.toString())}
                        </Link>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EscrowsTable;
