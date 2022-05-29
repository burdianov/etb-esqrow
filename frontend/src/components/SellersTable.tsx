import { useRecoilState } from 'recoil';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoMdCopy } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { sellersState } from '../recoil/atoms';
import { accountState } from './../recoil/atoms';
import { inArray } from '../utils';

function SellersTable() {
  const [sellers] = useRecoilState(sellersState);
  const [account] = useRecoilState(accountState);

  return (
    <div className='container mx-auto px-4 sm:px-8 max-w-5xl'>
      <div className='py-8'>
        <div className='flex justify-between'>
          <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
            Sellers
          </h2>
          {account && !inArray(account, sellers) && (
            <Link
              to='create'
              className='text-indigo-600 hover:text-indigo-800 transaction duration-75'
            >
              Register as a Seller
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
                    Address
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800 text-left text-sm uppercase'
                  >
                    Copy
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase'
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className='text-gray-500'>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <div className='flex items-center'>
                        <div className=''>
                          <p className='text-gray-900 whitespace-no-wrap'>
                            <a
                              className='hover:text-purple-800 transition duration-100'
                              href={`https://rinkeby.etherscan.io/address/${seller.id}`}
                              target='_blank'
                            >
                              {seller.id}
                            </a>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        <CopyToClipboard text={seller.id}>
                          <button className='p-2 rounded-full active:bg-indigo-200 transition duration-400'>
                            <IoMdCopy />
                          </button>
                        </CopyToClipboard>
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        {seller.name}
                      </p>
                    </td>
                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                      <p className='text-gray-900 whitespace-no-wrap'>
                        {seller.email}
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

export default SellersTable;
