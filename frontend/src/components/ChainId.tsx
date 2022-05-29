import { useRecoilState } from 'recoil';

import { chainIdState } from '../recoil/atoms';
import { chainIdToNetwork } from '../utils';

const ChainId = () => {
  const [chainId] = useRecoilState(chainIdState);

  return (
    <div className='absolute bottom-20 right-10 text-gray-100 hover:text-gray-200 hover:cursor-pointer hover:font-semibold transition duration-100 rounded-full text-4xl bg-indigo-600 hover:bg-indigo-700 p-4 active:shadow-xl active:translate-y-[1px]'>
      {chainIdToNetwork(chainId)}
    </div>
  );
};

export default ChainId;
