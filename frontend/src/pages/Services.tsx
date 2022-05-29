// @ts-ignore
import UnderConstruction from '../assets/svg/construction.svg?component';
import ContentWrapper from './../components/ContentWrapper';

const Services = () => {
  return (
    <ContentWrapper>
      <div className='flex w-full h-full justify-center items-center'>
        <UnderConstruction />
        <h1 className='absolute top-1/4 font-bold text-3xl bg-indigo-800 px-8 py-4 rounded-lg bg-opacity-50 text-white'>
          Under Construction
        </h1>
      </div>
    </ContentWrapper>
  );
};

export default Services;
