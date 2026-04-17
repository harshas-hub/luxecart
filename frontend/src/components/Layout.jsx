import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>

      {/* Content */}
      <Navbar />
      <main className="relative z-10 pt-24 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
