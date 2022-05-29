import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='text-9xl font-thin mb-4 -mt-36'>404</h1>
      <h3 className='text-center font-semibold text-2xl'>Ooops!</h3>
      <p className='text-lg mb-4'>The page doesn't exist or is unavailable.</p>
      <Link
        to='/'
        className='font-semibold px-8 py-4 bg-indigo-500 text-gray-100 hover:bg-indigo-600 transition duration-75 cursor-pointer active:translate-y-[2px] rounded-lg'
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
