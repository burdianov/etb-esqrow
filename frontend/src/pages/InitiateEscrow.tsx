import { SyntheticEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getYear, getUnixTime } from 'date-fns';

import 'react-toastify/dist/ReactToastify.css';

import ContentWrapper from '../components/ContentWrapper';

import useContractActions from '../hooks/useContractActions';
import { useRecoilState } from 'recoil';
import { accountState, escrowsLoadingState } from '../recoil/atoms';
import Button from '../components/Button';
import { DateType } from '../components/NumberInput';
import NumberInput from '../components/NumberInput';
import { commissionState } from './../recoil/atoms';

const initialState = {
  seller: '',
  value: 0,
  valueWithCommission: 0,
  year: getYear(new Date()),
  month: 1,
  day: 1
};

function InitiateEscrow() {
  const [escrow, setEscrow] = useState(initialState);
  const [account] = useRecoilState(accountState);
  const [commission] = useRecoilState(commissionState);
  const { initiateEscrow, getCommission } = useContractActions();
  const [loading] = useRecoilState(escrowsLoadingState);

  const { seller, value, valueWithCommission, year, month, day } = escrow;

  useEffect(() => {
    const init = async () => {
      await getCommission();
    };
    if (account) {
      init();
    }
    if (!loading) {
      setEscrow(initialState);
    }
  }, [loading, account]);

  // @ts-ignore
  const handleOnChange = (e) => {
    setEscrow({
      ...escrow,
      [e.target.name]: e.target.value,
      valueWithCommission:
        e.target.name === 'value' && parseFloat(e.target.value)
          ? parseFloat(e.target.value) +
            (parseFloat(e.target.value) * commission) / 100
          : 0
    });
  };

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!escrow || !seller || !value || !year || !month || !day) {
      toast('The fields cannot be empty', {
        autoClose: 1000,
        type: 'error'
      });
      return;
    }

    const timestamp = getUnixTime(new Date(year, month - 1, day));

    initiateEscrow(seller, timestamp, value);
  };

  return (
    <ContentWrapper>
      <section className='pt-16 max-w-4xl mx-auto'>
        <form className='p-8 bg-white rounded-md shadow-xl' onSubmit={submit}>
          <div className='grid grid-cols-1 gap-6 mt-4'>
            <div className='flex justify-between'>
              <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
                Initiate Escrow
              </h2>
              <Link
                to='/escrows'
                className='text-indigo-600 hover:text-indigo-800 transaction duration-75'
              >
                View Escrows
              </Link>
            </div>

            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                htmlFor='seller'
              >
                Seller Address{' '}
                <i>(copy a valid seller address from Sellers page)</i>
              </label>
              <input
                id='seller'
                name='seller'
                type='text'
                value={seller}
                onChange={handleOnChange}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div className='max-w-xs'>
              <label
                className='text-gray-700 dark:text-gray-200'
                htmlFor='expiry'
              >
                Expiry
              </label>
              <div className='mt-2 flex w-full justify-between'>
                <div className='max-w-[120px]'>
                  <label htmlFor='year'>Year</label>
                  <NumberInput
                    dateType={DateType.YEAR}
                    value={year}
                    onChange={handleOnChange}
                  />
                </div>
                <div className='max-w-[80px]'>
                  <label htmlFor='month'>Month</label>
                  <NumberInput
                    dateType={DateType.MONTH}
                    value={month}
                    onChange={handleOnChange}
                  />
                </div>
                <div className='max-w-[80px]'>
                  <label htmlFor='day'>Day</label>
                  <NumberInput
                    dateType={DateType.DAY}
                    value={day}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
            <div className='flex'>
              <div className='max-w-xs'>
                <label
                  className='text-gray-700 dark:text-gray-200'
                  htmlFor='value'
                >
                  Value <i>(ETH)</i>
                </label>
                <input
                  id='value'
                  name='value'
                  type='number'
                  value={value}
                  onChange={handleOnChange}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                />
              </div>
              <div className='max-w-xs ml-8'>
                <label className='text-gray-700 dark:text-gray-200 w-20'>
                  Commission
                </label>
                <div className='flex px-4 py-2 mt-2 flex-col justify-center items-center w-20'>
                  <p className=''>{commission} %</p>
                </div>
              </div>
              <div className='max-w-xs ml-8'>
                <label className='text-gray-700 dark:text-gray-200 w-20'>
                  Total (ETH)
                </label>
                <div className='flex px-4 py-2 mt-2 flex-col justify-center items-center w-20'>
                  <p className='font-bold'>{valueWithCommission}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <Button loading={loading} />
          </div>
        </form>
      </section>
      <ToastContainer />
    </ContentWrapper>
  );
}

export default InitiateEscrow;
