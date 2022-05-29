import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// @ts-ignore
import Logo from '../assets/svg/logo.svg?component';
import NavItem from './NavItem';
import { accountState } from './../recoil/atoms';
import { shortenAddress } from '../utils';
import useEthereum from '../hooks/useEthereum';

const menuItems = [
  { label: 'Services', url: '/services' },
  { label: 'Sellers', url: '/sellers' },
  { label: 'Buyers', url: '/buyers' },
  { label: 'Escrows', url: '/escrows' }
];

const Navbar = () => {
  const [account] = useRecoilState(accountState);
  const { connectWallet } = useEthereum();

  return (
    <header>
      <div className='px-4 w-full h-[64px] shadow-md flex justify-between items-center'>
        <Link to='/'>
          <div className='flex items-center justify-center text-indigo-600'>
            <Logo />
            <span className='ml-4 text-2xl font-bold uppercase'>Esqrow</span>
          </div>
        </Link>
        <nav className='flex items-center'>
          {menuItems.map((item) => {
            return <NavItem key={item.url} to={item.url} label={item.label} />;
          })}
        </nav>
        <button
          className='bg-indigo-500 px-4 py-2 rounded-lg text-gray-100 font-semibold hover:bg-indigo-600 disabled:bg-indigo-400 disabled:hover:bg-indigo-400 transition'
          disabled={!!account}
          onClick={connectWallet}
        >
          {account ? shortenAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
