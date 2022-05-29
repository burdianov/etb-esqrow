import { Outlet } from 'react-router-dom';

import ContentWrapper from './ContentWrapper';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </div>
    </div>
  );
}

export default Layout;
