import Navbar from '../Navbar';
import Footer from './Footer';

/**
 * Layout wraps every page with Navbar + Footer.
 * Pages that need full-bleed (Home hero) can pass noContainer=true.
 */
const Layout = ({ children, noContainer = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${noContainer ? '' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
