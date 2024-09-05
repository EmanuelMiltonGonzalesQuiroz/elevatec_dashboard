import React from 'react';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';

const Header = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = user ? user.email : 'No email available';

  return (
    <header className="bg-gradient-to-r from-orange-500 to-brown-700 text-white flex justify-between items-center p-4 max-h-[10vh]">
      <img src={logo} alt="Logo" className="w-32" />
      <div className="flex items-center">
        <span className="mr-4">{userEmail}</span>
      </div>
    </header>
  );
};

export default Header;
