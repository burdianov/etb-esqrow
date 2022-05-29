import { SyntheticEvent, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import ContentWrapper from '../components/ContentWrapper';
import useContractActions from './../hooks/useContractActions';
import { useRecoilState } from 'recoil';
import { sellersLoadingState } from '../recoil/atoms';
import Button from '../components/Button';

const initialState = { name: '', email: '' };

function RegisterSeller() {
  const [seller, setSeller] = useState(initialState);
  const { registerSeller } = useContractActions();
  const [loading] = useRecoilState(sellersLoadingState);

  useEffect(() => {
    if (!loading) {
      setSeller(initialState);
    }
  }, [loading]);

  const handleOnChange = (e) => {
    setSeller({ ...seller, [e.target.name]: e.target.value });
  };

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!seller || !seller.name || !seller.email) {
      toast('The fields cannot be empty', {
        autoClose: 1000,
        type: 'error'
      });
      return;
    }

    registerSeller(seller.name, seller.email);
  };

  return (
    <ContentWrapper>
      <section className='pt-20 max-w-4xl mx-auto'>
        <form className='p-8 bg-white rounded-md shadow-xl' onSubmit={submit}>
          <div className='grid grid-cols-1 gap-6 mt-4'>
            <div className='flex justify-between'>
              <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
                Register Seller
              </h2>
              <Link
                to='/sellers'
                className='text-indigo-600 hover:text-indigo-800 transaction duration-75'
              >
                View Sellers
              </Link>
            </div>

            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                htmlFor='name'
              >
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={seller.name}
                onChange={handleOnChange}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                htmlFor='email'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                value={seller.email}
                onChange={handleOnChange}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
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

export default RegisterSeller;
