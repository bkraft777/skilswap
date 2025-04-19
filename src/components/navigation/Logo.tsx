
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="gradient-circle w-10 h-10"></div>
      <span className="ml-2 text-2xl font-poppins font-bold">SkilSwap.io</span>
    </Link>
  );
};

export default Logo;
