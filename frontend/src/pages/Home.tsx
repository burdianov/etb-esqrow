// @ts-ignore
import Stats from '../assets/svg/banking.svg?component';
import ContentWrapper from './../components/ContentWrapper';

const Home = () => {
  return (
    <ContentWrapper>
      <div className='flex justify-between w-full h-full'>
        <div className='w-1/2 h-full flex flex-col justify-center ml-[5%]'>
          <h1 className='font-bold text-4xl'>Secure Escrow Services</h1>
          <h3 className='mt-4 text-2xl font-thin uppercase'>Best in town</h3>
        </div>
        <div className='w-1/2 h-full flex flex-col items-center justify-center'>
          <Stats />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Home;
