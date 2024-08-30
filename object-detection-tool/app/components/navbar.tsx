"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionForm from "./ActionForm"; // Import the updated ActionForm component

const NavBar: React.FC = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false); // State to control ActionForm visibility
  const [toastMessage, setToastMessage] = useState<string | null>(null); // State to control toast notifications

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const handleToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleActionForm = () => {
    setShowActionForm(!showActionForm);
  };

  const closeActionForm = () => {
    setShowActionForm(false); // Close the ActionForm
  };

  return (
    <nav className="fixed w-full z-20 bg-gray-800 text-white flex items-center px-4 py-2 shadow-md">
      <div className="flex-grow">
        <Link href="/" passHref>
          <div className={`text-gray-300 font-bold text-lg ${path === '/' ? 'text-gray-300' : ''}`}>
            OBJECT DETECTION TOOL
          </div>
        </Link>
      </div>
      
      <button
        type="button"
        onClick={toggleActionForm}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Manage Data
      </button>

      {showActionForm && (
        <div className="absolute top-16 right-4 bg-gray-800 p-4 rounded shadow-lg z-10">
          <ActionForm apiUrl={apiUrl} onToast={handleToast} onClose={closeActionForm} />
        </div>
      )}
      
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-20">
          {toastMessage}
        </div>
      )}

      <button
        type="button"
        onClick={toggleMenu}
        className="ml-4 text-white"
        aria-label="Toggle menu"
      >
        {/* Add your menu icon here */}
      </button>
      
      <div
        className={`md:hidden bg-gray-800 bg-opacity-90 w-full absolute top-16 right-0 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-end space-y-2 px-4 py-5">
          <Link href="/" passHref>
            <button
              onClick={toggleMenu}
              className={`w-full text-right px-3 py-2 rounded-md text-lg font-semibold ${path === '/' ? "text-white bg-primary" : "text-white hover:text-gray-200"}`}
            >
              E C L I P S E
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
